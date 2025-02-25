import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wetracked.io - Documentation",
  description: "Documentation for wetracked.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
