import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function ArticleCard({ article, large = false, className = "" }) {
    const router = useRouter()

    if (!article) return null

    const handleCardClick = () => {
        router.push(`/blog/${article.slug}`)
    }

    return (
        <article 
            className={`bg-[#1a1a2e] rounded-lg border border-gray-800 overflow-hidden cursor-pointer hover:bg-[#2a2a4e] transition-colors ${className}`}
            onClick={handleCardClick}
        >
            <div className={`relative w-full ${large ? "h-[400px]" : "h-[240px]"}`}>
                <Image
                    src={article.featured_image || "/placeholder.svg"}
                    alt={`Thumbnail for article: ${article.title}`}
                    fill
                    className="object-cover"
                />
                {article.category?.name && (
                    <div className="absolute top-2 left-2 bg-[#ff6b35] text-[#FFFFFF] text-xs font-semibold px-3 py-1 rounded-full text-center">
                        {article.category.name}
                    </div>
                )}
            </div>
            <div className="p-4 space-y-2">
                <time dateTime={article.created_at} className="text-[#3b82f6] text-xs">
                    {new Date(article.created_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </time>
                <h3 className="font-bold text-white">
                    {article.title}
                </h3>
                {article.excerpt && <p className="text-sm text-gray-400">{article.excerpt}</p>}
                <div className="flex gap-2 flex-wrap">
                    {(article.article_tags || []).map(({ tag }, idx) => (
                        <Link
                            key={idx}
                            href={`/articles?tag=${tag.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className="category-tag bg-game-blue transition-colors"
                            onClick={(e) => e.stopPropagation()}
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