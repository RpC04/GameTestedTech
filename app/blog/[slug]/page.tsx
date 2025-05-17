import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import BlogPost from "@/components/BlogPost"

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {

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
    .eq("slug", params.slug)
    .single()

  if (error || !article) {
    return <div className="text-white p-8">Article not found.</div>
  }

  // Transformar tags si están en JSOn
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
          articles: 0, // puedes hacer un count real si quieres
          followers: 0 // opcional tambien
        },
        categories: [article.categories?.name ?? "Uncategorized"],
        tags: tags?.map(tag => tag.name) || [],
        comments: article.comments?.length ?? 0
      }}
    />
  )
}

export default BlogPostPage
