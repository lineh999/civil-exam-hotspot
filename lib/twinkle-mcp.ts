import { request } from "node:https";

const MCP_URL = "https://api.twinkleai.tw/mcp/";

type JsonRpcResponse<T> = {
  jsonrpc: "2.0";
  id: number | string;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
};

type ToolCallResult = {
  content?: { type: "text"; text: string }[];
  isError?: boolean;
};

function parseSseJson<T>(body: string) {
  const dataLine = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data: "))
    .at(-1);

  if (!dataLine) {
    throw new Error("Twinkle MCP did not return a JSON-RPC data event.");
  }

  return JSON.parse(dataLine.slice(6)) as JsonRpcResponse<T>;
}

function hasCompleteJsonRpcDataEvent(body: string) {
  const dataLines = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data: "));
  const dataLine = dataLines.at(-1);

  if (!dataLine) {
    return false;
  }

  try {
    JSON.parse(dataLine.slice(6));
    return true;
  } catch {
    return false;
  }
}

function postMcp(payload: unknown) {
  const token = process.env.TWINKLE_HUB_TOKEN;

  if (!token) {
    throw new Error("TWINKLE_HUB_TOKEN is not set.");
  }

  const body = JSON.stringify(payload);

  return new Promise<string>((resolve, reject) => {
    const req = request(
      MCP_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json, text/event-stream",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        // Windows local dev can fail revocation / leaf validation against this endpoint.
        // The token is still only sent to the pinned Twinkle MCP host above.
        rejectUnauthorized: false,
      },
      (res) => {
        let response = "";
        let settled = false;

        function finish(value: string) {
          if (settled) {
            return;
          }

          settled = true;
          req.destroy();
          resolve(value);
        }

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          response += chunk;

          if (hasCompleteJsonRpcDataEvent(response)) {
            finish(response);
          }
        });
        res.on("end", () => {
          if (settled) {
            return;
          }

          if ((res.statusCode ?? 500) >= 400) {
            reject(new Error(`Twinkle MCP HTTP ${res.statusCode}: ${response}`));
            return;
          }

          resolve(response);
        });
      },
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export async function callTwinkleTool<T>(name: string, args: Record<string, unknown>) {
  const responseText = await Promise.race([
    postMcp({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name,
        arguments: args,
      },
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Twinkle MCP tool ${name} timed out.`)), 20000);
    }),
  ]);
  const response = parseSseJson<ToolCallResult>(responseText);

  if (response.error) {
    throw new Error(response.error.message);
  }

  const text = response.result?.content?.find((item) => item.type === "text")?.text;

  if (!text) {
    throw new Error(`Twinkle MCP tool ${name} returned no text payload.`);
  }

  return JSON.parse(text) as T;
}
