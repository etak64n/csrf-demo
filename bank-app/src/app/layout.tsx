import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureBank",
  description: "SecureBank - オンラインバンキング",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
