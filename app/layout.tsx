import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flexi-band.vercel.app"

const description =
  "A nearly clear silicone loop for round and rectangular 13-gallon kitchen trash cans. Finger-loop pull tab, wipe-clean and dishwasher-safe. Reserve 20% off Launch Batch 1 — no payment today."

export const viewport: Viewport = {
  themeColor: "#fafaf9",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Flexi-Band™ — Keep the trash bag over the rim",
  description,
  openGraph: {
    title: "Flexi-Band™ — Keep the trash bag over the rim",
    description,
    images: [
      {
        url: "/flexi-band-hero.png",
        width: 1024,
        height: 1024,
        alt: "Flexi-Band holding a white liner on a rectangular stainless steel kitchen trash can",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flexi-Band™ — Keep the trash bag over the rim",
    description,
    images: ["/flexi-band-hero.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
