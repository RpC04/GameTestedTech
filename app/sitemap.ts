import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gametestedtech.com"

  // Main pages
  const routes = ["", "/about", "/contact", "/explore", "/privacy", "/legal"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Article pages
  const articleRoutes = Array(12)
    .fill(null)
    .map((_, i) => ({
      url: `${baseUrl}/articles/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

  // Category pages
  const categoryRoutes = ["strategy", "rpg", "fps", "mmorpg", "sports"].map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...routes, ...articleRoutes, ...categoryRoutes]
}
