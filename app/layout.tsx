import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "公職命題熱點分析平台",
  description: "用近三年歷屆試題整理高頻考點，幫學生排出考前複習優先順序。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
