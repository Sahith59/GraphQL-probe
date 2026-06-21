import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoLD GraphQL Lab",
  description: "Standalone BoLD BOLA test app using GraphQL object IDs in request bodies."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
