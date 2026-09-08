import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { siteConfig } from "@/config/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "school uniforms",
    "school dress online",
    "thermals for kids",
    "school shoes",
    "school bags",
    "DPS uniform",
    "Kendriya Vidyalaya uniform",
    "Ryan school uniform",
    "TirupatiBalajee Dresses",
  ],
  authors: [{ name: "TirupatiBalajee Dresses" }],
  creator: "TirupatiBalajee Dresses",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-brand-cream text-brand-navy-950 antialiased flex flex-col justify-between selection:bg-brand-yellow-300 selection:text-brand-navy-950">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileBottomNav />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#0F172A",
              color: "#FFFFFF",
              borderRadius: "1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
            },
          }}
        />
      </body>
    </html>
  );
}
