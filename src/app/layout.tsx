import type { Metadata } from "next";
import { Fraunces, Mukta } from "next/font/google";
import "./globals.css";

// next/font generates size-adjusted fallbacks, so there is no layout shift on font load.
const mukta = Mukta({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-mukta",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = { title: "GramSetu" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mukta.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
