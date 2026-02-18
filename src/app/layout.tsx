import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Worst Website In History",
  description: "You found us. Congratulations? This will be an experience.",
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
