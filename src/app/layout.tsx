import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";


const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // No `weight` array — Fraunces is a variable font, so this loads the
  // full weight axis instead of two fixed static instances. Restricting
  // it to specific weights was the root cause of headings silently
  // falling back to a system font on mobile Safari, where missing-weight
  // fake-bolding isn't reliably supported the way it is on desktop Chrome.
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"], // IBM Plex Mono is NOT variable — static weights are correct here
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
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
