import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhatsApp Wrapped - Your Year in Chats",
  description:
    "Discover your WhatsApp chat personality, most active times, and conversation insights with this Spotify Wrapped-style experience.",
  keywords: ["WhatsApp", "Wrapped", "Chat Analysis", "Year in Review"],
  openGraph: {
    title: "WhatsApp Wrapped - Your Year in Chats",
    description: "Discover your chat personality and conversation insights",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
