import type { Metadata } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";


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
  title: "School Book Download Archive | EPD",
  description:
    "Browse and download school textbooks by grade category, medium, and grade.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable}`}
    >
      <body
         className="font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}
