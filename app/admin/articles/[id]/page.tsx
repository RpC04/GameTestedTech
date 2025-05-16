import ArticleEditor from "@/components/admin/ArticleEditor"

export default function Page({ params }: { params: { id: string } }) {
  return <ArticleEditor articleId={params.id} />
}
