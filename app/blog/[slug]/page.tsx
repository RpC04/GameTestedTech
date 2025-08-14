import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import BlogPost from "@/components/blog/blog-post"
import type { RelatedArticle } from "@/types/article"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  })
  // 1. Get the main article
  const { data: article, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories:category_id (id, name),
      authors:author_id (id, name, avatar_url, bio),
      comments (id)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !article) {
    return <div className="text-white p-8">Article not found.</div>
  }

  // 2. Get the tags (ids)
  const { data: articleTags } = await supabase
    .from('article_tags')
    .select('tag_id')
    .eq('article_id', article.id)

  const tagIds = (articleTags || []).map(t => t.tag_id)

  // 3. Get the tag names
  let tagNames: string[] = []
  if (tagIds.length > 0) {
    const { data: tags } = await supabase
      .from('tags')
      .select('name')
      .in('id', tagIds)
    tagNames = tags?.map(t => t.name) || []
  }

  // 4. Get related articles by category
  const { data: articlesByCategory } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, featured_image, category_id, author_id, created_at')
    .eq('category_id', article.category_id)
    .neq('id', article.id)
    .eq('status', 'published')

  // 5. Search for related articles by tags
  let articlesByTags: RelatedArticle[] = []
  if (tagIds.length > 0) {
    const { data: articleTagRows } = await supabase
      .from('article_tags')
      .select('article_id')
      .in('tag_id', tagIds)
      .neq('article_id', article.id)
    const relatedIds = [...new Set((articleTagRows || []).map(row => row.article_id))]
    if (relatedIds.length) {
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, featured_image, category_id, author_id, created_at')
        .in('id', relatedIds)
        .eq('status', 'published')
      articlesByTags = articles || []
    }
  }

  // 6. Combine, filter duplicates and limit
  const allArticles = [...(articlesByCategory || []), ...articlesByTags]
  const uniqueArticles: Record<number, RelatedArticle> = {}
  allArticles.forEach(a => { uniqueArticles[a.id] = a })
  const relatedArticles = Object.values(uniqueArticles).slice(0, 6)

  return (
    <BlogPost
      article={{
        ...article,
        featuredImage: article.featured_image,
        author: {
          id: article.authors?.id ?? null,
          name: article.authors?.name ?? "Autor desconocido",
          avatar: article.authors?.avatar_url ?? null,
          bio: article.authors?.bio ?? "",
          articles: 0,
          followers: 0
        },
        categories: [article.categories?.name ?? "Uncategorized"],
        tags: tagNames,
        comments: article.comments?.length ?? 0
      }}
      relatedArticles={relatedArticles}
    />
  )
}
