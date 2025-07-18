import Head from "next/head"

interface SeoHeadProps {
  canonicalUrl?: string
}

export function SeoHead({ canonicalUrl }: SeoHeadProps) {
  return (
    <Head>
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Additional meta tags */}
      <meta name="theme-color" content="#0f0f23" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Preload critical assets */}
      <link rel="preload" href="/fonts/custom-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Head>
  )
}
