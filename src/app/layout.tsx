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
  title: {
    default: "PKHeX Web - Free Online Pokémon Save Editor",
    template: "%s | PKHeX Web",
  },
  description:
    "Free browser-based Pokémon save editor. Edit Generation 1-3 save files online — Red, Blue, Yellow, Gold, Silver, Crystal, Ruby, Sapphire, Emerald, FireRed, LeafGreen. No download required.",
  keywords: [
    "PKHeX",
    "Pokemon save editor",
    "Pokemon editor online",
    "Gen 1 save editor",
    "Gen 2 save editor",
    "Gen 3 save editor",
    "Pokemon Red save editor",
    "Pokemon Blue save editor",
    "Pokemon Yellow save editor",
    "Pokemon Gold save editor",
    "Pokemon Silver save editor",
    "Pokemon Crystal save editor",
    "Pokemon Ruby save editor",
    "Pokemon Sapphire save editor",
    "Pokemon Emerald save editor",
    "Pokemon FireRed save editor",
    "Pokemon LeafGreen save editor",
    "SAV file editor",
    "Pokemon IV editor",
    "Pokemon EV editor",
  ],
  authors: [{ name: "satya-nutella" }],
  creator: "satya-nutella",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "PKHeX Web - Free Online Pokémon Save Editor",
    description:
      "Edit your Pokémon save files directly in the browser. Supports Gen 1-3 games. Free, no download required.",
    siteName: "PKHeX Web",
  },
  twitter: {
    card: "summary_large_image",
    title: "PKHeX Web - Free Online Pokémon Save Editor",
    description:
      "Edit your Pokémon save files directly in the browser. Supports Gen 1-3 games. Free, no download required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
