import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import BlogPost from "@/components/BlogPost"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

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

  const { data: tags } = await supabase
    .from("tags")
    .select("name")
    .in("id", article.tags || [])

  return (
    <BlogPost
      article={{
        ...article,
        author: {
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
    />
  )
}