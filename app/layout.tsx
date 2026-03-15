import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcana Pack Opener",
  description: "Open mystical card packs and discover what fate has in store.",
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
