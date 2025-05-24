import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import BlogPost from "@/components/BlogPost"

export const dynamic = "force-dynamic"

export interface RelatedArticle {
  id: any
  title: any
  slug: any
  excerpt: any
  featured_image: any
  category_id: any
  author_id: any
  created_at: any
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // --- 1. Traer el artículo principal ---
  const { data: article, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories:category_id (id, name),
      authors:author_id (id, name, avatar_url, bio),
      comments (id)
    `)
    .eq("slug", slug)
    .single()

  if (error || !article) {
    return <div className="text-white p-8">Article not found.</div>
  }

  // --- 2. Traer los tags del artículo principal ---
  const { data: tags } = await supabase
    .from("tags")
    .select("name")
    .in("id", article.tags || [])

  // --- 3. OBTENER ARTÍCULOS RELACIONADOS ---
  const tagIds = Array.isArray(article.tags) ? article.tags : [];

  let articlesByTags: RelatedArticle[] = [];
  if (tagIds.length) {
    const { data: tagArticles } = await supabase
      .from('article_tags')
      .select('article_id, articles:article_id(id, title, slug, excerpt, featured_image, category_id, author_id, created_at)')
      .in('tag_id', tagIds);
    articlesByTags = (tagArticles || [])
      .map(r => r.articles)
      .flat()
      .filter(a => a && a.id !== article.id);
  }

  const { data: articlesByCategory } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, featured_image, category_id, author_id, created_at')
    .eq('category_id', article.category_id)
    .neq('id', article.id);

  const articlesByTagsIds = articlesByTags.map(a => a.id);
  const relatedArticles: RelatedArticle[] = [
    ...articlesByTags,
    ...((articlesByCategory || []).filter(a => !articlesByTagsIds.includes(a.id))),
  ].slice(0, 6);

  // --- 4. RETURN: pasa relatedArticles como prop ---
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
        tags: tags?.map(tag => tag.name) || [],
        comments: article.comments?.length ?? 0
      }}
      relatedArticles={relatedArticles}
    />
  )
}
