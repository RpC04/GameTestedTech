// components/ArticleCard.tsx
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ArticleCard({ article, large = false, className = "" }) {
    if (!article) return null
    return (
        <article className={`bg-[#1f0032] rounded-lg overflow-hidden ${className}`}>
            <div className={`relative w-full ${large ? "h-[400px]" : "h-[240px]"}`}>

                <Image
                    src={article.featured_image || "/placeholder.svg"}
                    alt={`Thumbnail for article: ${article.title}`}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4 space-y-2">
                <time dateTime={article.created_at} className="text-game-cyan text-xs">
                    {new Date(article.created_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </time>
                <h3 className="font-bold text-white">
                    <Link
                        href={`/blog/${article.slug}`}
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-game-cyan rounded"
                    >
                        {article.title}
                    </Link>
                </h3>
                {article.excerpt && <p className="text-sm text-gray-400">{article.excerpt}</p>}
                <div className="flex gap-2 flex-wrap">
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
                <p className="text-xs text-gray-400 pt-1">
                    By <span className="font-medium">{article.author?.name || "Unknown"}</span>
                </p>
            </div>
        </article>
    )
}
