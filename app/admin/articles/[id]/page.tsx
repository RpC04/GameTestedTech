import ArticleEditor from "@/components/admin/ArticleEditor"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ArticleEditor articleId={id} />
}
