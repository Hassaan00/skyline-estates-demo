import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";
import { brand } from "@/lib/data";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: { default: "Skyline Estates · Luxury Real Estate in Dubai", template: "%s · Skyline Estates" },
  description: "Penthouses, beachfront villas and investment homes across Dubai and Abu Dhabi. Meet Layla, our 24/7 AI property advisor who matches homes and books private viewings in seconds.",
  keywords: ["Dubai luxury real estate", "Palm Jumeirah villa", "Dubai Marina penthouse", "Golden Visa property", "Dubai off-plan", "buy apartment Dubai"],
  openGraph: { title: "Skyline Estates · Dubai", description: "Luxury homes, matched by AI. Private viewings booked 24/7.", type: "website", locale: "en_AE" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#08080b", width: "device-width", initialScale: 1 };
const jsonLd = { "@context": "https://schema.org", "@type": "RealEstateAgent", name: brand.name, telephone: brand.phone, email: brand.email,
  address: { "@type": "PostalAddress", streetAddress: "Burj Daman, Level 42, DIFC", addressLocality: "Dubai", addressCountry: "AE" }, areaServed: ["Dubai", "Abu Dhabi"],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "612" } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink-950">Skip to content</a>
        {children}
        <ChatWidget />
        <CookieBanner />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
