import type { Article, WithContext } from "schema-dts"
import type { HomeJsonLdProps } from "@/types/article"

export function HomeJsonLd({ articles }: HomeJsonLdProps) {
  // Create structured data for the organization
  const organizationJsonLd: WithContext<any> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Game Tested Tech",
    url: "https://gametestedtech.com",
    logo: "https://gametestedtech.com/logo.png",
    sameAs: [
      "https://www.youtube.com/@gametestedtech",
      "https://www.instagram.com/gametestedtech",
      "https://x.com/GameTestedTech",
      "https://discord.gg/hgkdMseg9n",
      "https://facebook.com/gametestedtech",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      contactType: "customer service",
      email: "contact@gametestedtech.com",
    },
  }

  // Create structured data for the website
  const websiteJsonLd: WithContext<any> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Game Tested Tech",
    url: "https://gametestedtech.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://gametestedtech.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  // Create structured data for articles
  const articlesJsonLd: WithContext<Article>[] = articles.map((article, index) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Game Tested Tech",
      logo: {
        "@type": "ImageObject",
        url: "https://gametestedtech.com/logo.png",
      },
    },
    datePublished: article.date,
    dateModified: article.date,
    image: `https://gametestedtech.com/article-image-${index + 1}.jpg`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://gametestedtech.com/article/${index + 1}`,
    },
  }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      {articlesJsonLd.map((articleJsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      ))}
    </>
  )
}
