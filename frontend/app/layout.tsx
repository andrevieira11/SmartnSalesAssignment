import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SmartnSales Task Board",
  description: "Coordinate store operations across regions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
