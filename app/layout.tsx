import type { Metadata } from "next";
import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const logoFont = Great_Vibes({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: 'Thrill of Life',
  description: 'Browse and rate theme parks, roller coasters, and rides.',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    siteName: 'Thrill of Life',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${logoFont.variable} h-full antialiased`}
    >
      <head>
        {/* Umami Analytics */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="3a61fb80-6921-4eb8-92bf-b3f984364e23"></script>
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}