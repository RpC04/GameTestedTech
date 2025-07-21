import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import Script from 'next/script'
import './globals.css'

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
})

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const metadata: Metadata = {
  title: {
    default: "Game Tested Tech - Gaming Articles & Reviews",
    template: "%s | Game Tested Tech",
  },
  description: "Discover the latest gaming articles, reviews, and tech insights from Game Tested Tech.",
  keywords: ["gaming", "video games", "game reviews", "gaming tech", "esports", "game tested tech"],
  authors: [{ name: "Game Tested Tech Team" }],
  creator: "Game Tested Tech",
  publisher: "Game Tested Tech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gametestedtech.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Game Tested Tech - Gaming Articles & Reviews",
    description: "Discover the latest gaming articles, reviews, and tech insights from Game Tested Tech.",
    url: "https://gametestedtech.com",
    siteName: "Game Tested Tech",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Game Tested Tech - Gaming Articles & Reviews",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Tested Tech - Gaming Articles & Reviews",
    description: "Discover the latest gaming articles, reviews, and tech insights from Game Tested Tech.",
    creator: "@GameTestedTech",
    images: ["/twitter-image.jpg"],
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        
        {children}
      </body>
    </html>
  )
}