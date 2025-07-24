import ArticleEditor from "@/components/admin/articles/ArticleEditor"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ArticleEditor articleId={id} />
}
