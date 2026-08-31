import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://epd-download-prototype.vercel.app";
const ogImagePath = "/epd-prototype%20v1.09.png";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "School Book Download Archive | EPD",
    template: "%s | School Book Download Archive",
  },
  description:
    "Browse, search, and download official school textbooks, modules, and Pirivena books by medium, grade, and subject.",
  applicationName: "School Book Download Archive",
  authors: [{ name: "Educational Publications Department" }],
  creator: "Educational Publications Department",
  publisher: "Educational Publications Department",
  keywords: [
    "school book download archive",
    "textbooks",
    "modules",
    "pirivena books",
    "education publications department",
    "grade 1-11 resources",
    "school books Sri Lanka",
    "download school books",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "School Book Download Archive | EPD",
    description:
      "Browse, search, and download official school textbooks, modules, and Pirivena books by medium, grade, and subject.",
    siteName: "School Book Download Archive",
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: "School Book Download Archive preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School Book Download Archive | EPD",
    description:
      "Browse, search, and download official school textbooks, modules, and Pirivena books by medium, grade, and subject.",
    images: [ogImagePath],
  },
  icons: {
    icon: "/main-logo.png",
    shortcut: "/main-logo.png",
    apple: "/main-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a3d44",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
