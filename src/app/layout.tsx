import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SITE } from "@/lib/site";

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
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Online Shopping in Kenya`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "online shopping Kenya",
    "buy phones Kenya",
    "electronics Kenya",
    "home appliances Nairobi",
    "fashion Kenya",
    "beauty products Kenya",
    "farm supplies Kenya",
    "livestock supplies",
    "Kasokoi Store",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: SITE.name,
    title: `${SITE.name} — Online Shopping in Kenya`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Online Shopping in Kenya`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-KE"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
