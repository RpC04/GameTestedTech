// components/HorizontalArticleCard.tsx
import Image from "next/image"
import Link from "next/link"

interface HorizontalArticleCardProps {
  article: any
  reverse?: boolean
  className?: string
}

export function HorizontalArticleCard({
  article,
  reverse = false,
  className = "",
}: HorizontalArticleCardProps) {
  if (!article) return null

  return (
    <div className={`flex flex-col md:flex-row ${reverse ? "md:flex-row-reverse" : ""} gap-6 bg-[#1f0032] rounded-lg overflow-hidden ${className}`}>
      {/* Imagen */}
      <div className="relative w-full md:w-[40%] h-[200px] md:h-auto min-h-[200px]">
        <Image
          src={article.featured_image || "/placeholder.svg"}
          alt={`Image for ${article.title}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 p-6 flex flex-col justify-center space-y-2">
        <time dateTime={article.created_at} className="text-game-cyan text-xs">
          {new Date(article.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h3 className="text-white text-xl font-semibold leading-snug">
          <Link href={`/blog/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && <p className="text-gray-400 text-sm">{article.excerpt}</p>}
        <div className="flex gap-2 flex-wrap pt-1">
          {(article.article_tags || []).map(({ tag }, idx) => (
            <Link
              key={idx}
              href={`/articles?tag=${tag.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="category-tag hover:bg-game-blue transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          By <span className="font-medium">{article.author?.name || "Unknown"}</span>
        </p>
      </div>
    </div>
  )
}
