import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Gazette | Curated News with Editorial Precision",
  description:
    "A premium editorial news portal aggregating top stories from curated RSS feeds. Delivered with journalistic integrity and pixel-perfect design.",
  keywords: ["news", "editorial", "gazette", "RSS", "curated news", "technology", "world news"],
  openGraph: {
    title: "Studio Gazette",
    description: "Curated news with editorial precision",
    type: "website",
  },
  alternates: {
    types: {
      "application/rss+xml": "/api/rss/feed",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#fdfcf9] text-on-surface font-body">
        <Navbar />
        <main className="pt-[72px] flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
