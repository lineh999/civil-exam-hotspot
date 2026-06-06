$ErrorActionPreference = "SilentlyContinue"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$port = 3010
$logPath = Join-Path $projectRoot "dev-server.log"
$errPath = Join-Path $projectRoot "dev-server.log.err"

$existingListener = netstat -ano | Select-String ":$port\s+.*LISTENING"

if ($existingListener) {
  exit 0
}

Start-Process `
  -FilePath "cmd.exe" `
  -ArgumentList "/c", "npm.cmd run dev -- -p $port" `
  -WorkingDirectory $projectRoot `
  -RedirectStandardOutput $logPath `
  -RedirectStandardError $errPath `
  -WindowStyle Hidden

