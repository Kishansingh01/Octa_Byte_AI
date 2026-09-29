import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Octa Byte AI - Dynamic Portfolio Dashboard | Real-Time Yahoo & Google Finance",
  description: "Dynamic stock portfolio dashboard with real-time CMP from Yahoo Finance, P/E ratios and latest earnings from Google Finance, sector summaries, and investment performance analytics.",
  keywords: ["stock portfolio", "yahoo finance", "google finance", "octa byte ai", "financial dashboard", "next.js", "equity tracking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100">{children}</body>
    </html>
  );
}
