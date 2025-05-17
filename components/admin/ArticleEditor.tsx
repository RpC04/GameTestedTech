"use client"

import { useState, useEffect } from "react"
import type React from "react"
import type { ArticleFormWithTags, Category, Tag } from "@/types/article"

import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
    Save,
    ArrowLeft,
    ImageIcon,
    LinkIcon,
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Code,
    Eye,
    EyeOff,
    Trash2,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ArticleEditor({ articleId }: { articleId: string }) {
    const isNewArticle = articleId === "new"
    const numericId = isNewArticle ? null : Number.parseInt(articleId)

    const [article, setArticle] = useState<ArticleFormWithTags>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured_image: "",
        status: "draft",
        category_id: null,
        tags: [],
        author_id: null,
        meta_title: "",
        meta_description: "",
    })


    const [isLoading, setIsLoading] = useState(!isNewArticle)
    const [isSaving, setIsSaving] = useState(false)
    const [previewMode, setPreviewMode] = useState(false)
    const [error, setError] = useState("")
    const [categories, setCategories] = useState<Pick<Category, "id" | "name">[]>([])
    const [availableTags, setAvailableTags] = useState<Pick<Tag, "id" | "name">[]>([])


    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            try {
                //Fetch de categorías
                const { data: categoriesData } = await supabase
                    .from("categories")
                    .select("id, name")
                    .order("name")

                if (categoriesData) setCategories(categoriesData)

                //Fetch de tags
                const { data: tagsData } = await supabase
                    .from("tags")
                    .select("id, name")
                    .order("name")

                if (tagsData) setAvailableTags(tagsData)

                //Fetch del artículo si no es nuevo
                if (numericId) {
                    const { data: articleData, error } = await supabase
                        .from("articles")
                        .select(`
                            *,
                            article_tags (
                            tag_id
                            )
                        `)
                        .eq("id", numericId)
                        .single()


                    if (error) throw error

                    if (articleData) {
                        const tagIds = (articleData.article_tags || []).map((t: any) => t.tag_id)
                        setArticle({
                            ...articleData,
                            tags: tagIds,
                        })
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error)
                setError("Failed to load article data")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [numericId, supabase])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        // Auto-generate slug from title if it's a new article and slug hasn't been manually edited
        if (name === "title" && (isNewArticle || article.slug === "")) {
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "-")

            setArticle((prev) => ({
                ...prev,
                title: value,
                slug,
            }))
        } else {
            setArticle((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleTagChange = (tagId: string) => {
        setArticle((prev) => {
            const tags = [...prev.tags]
            return tags.includes(tagId)
                ? { ...prev, tags: tags.filter((id) => id !== tagId) }
                : { ...prev, tags: [...tags, tagId] }
        })
    }


    const handleSave = async (newStatus?: string) => {
        // Basic validation
        if (!article.title) return setError("Title is required")
        if (!article.content) return setError("Content is required")

        setIsSaving(true)
        setError("")

        try {
            const status = newStatus || article.status
            const { tags, article_tags, ...articleData } = article

            const payload = {
                ...articleData,
                status,
                updated_at: new Date().toISOString(),
                ...(isNewArticle && { created_at: new Date().toISOString() }),
            }

            if (isNewArticle) {
                // 🔐 Obtener usuario autenticado
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                if (userError || !user) throw new Error("No se pudo obtener el usuario.")

                // 🔁 Buscar el autor correspondiente (relacionado con ese usuario)
                const { data: author, error: authorError } = await supabase
                    .from("authors")
                    .select("id")
                    .limit(1)
                    .single()

                if (authorError || !author) throw new Error("No se encontró un autor vinculado al usuario.")

                // 📝 Insertar el artículo con author_id incluido
                const { data, error } = await supabase
                    .from("articles")
                    .insert([
                        {
                            ...payload,
                            author_id: author.id,
                        }
                    ])
                    .select()

                if (error) throw error

                const newArticleId = data?.[0]?.id
                if (!newArticleId) throw new Error("No se pudo obtener el ID del nuevo artículo.")

                if (tags.length > 0) {
                    const tagInserts = tags.map((tagId) => ({
                        article_id: newArticleId,
                        tag_id: tagId,
                    }))
                    const { error: tagError } = await supabase
                        .from("article_tags")
                        .insert(tagInserts)
                    if (tagError) throw tagError
                }
            } else {
                const article_id = Number.parseInt(articleId)
                if (Number.isNaN(article_id)) throw new Error("Invalid article ID")

                const { error } = await supabase
                    .from("articles")
                    .update(payload)
                    .eq("id", article_id)
                if (error) throw error

                // Primero borra los tags antiguos
                await supabase.from("article_tags").delete().eq("article_id", article_id)

                // Luego inserta los nuevos
                if (tags.length > 0) {
                    const tagInserts = tags.map((tagId) => ({
                        article_id,
                        tag_id: tagId,
                    }))
                    const { error: tagError } = await supabase
                        .from("article_tags")
                        .insert(tagInserts)
                    if (tagError) throw tagError
                }
            }
        } catch (error: any) {
            console.error("Error saving article:", error?.message || error, error?.details)
            setError("Failed to save article")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!articleId || !confirm("Are you sure you want to delete this article?")) return
        try {
            const { error } = await supabase.from("articles").delete().eq("id", articleId)
            if (error) throw error
            router.push("/admin/articles")
        } catch (error) {
            console.error("Error deleting article:", error)
            setError("Failed to delete article")
        }
    }

    // Editor toolbar actions
    const insertText = (before: string, after = "") => {
        const textarea = document.getElementById("content") as HTMLTextAreaElement
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = textarea.value.substring(start, end)
        const replacement = before + selectedText + after

        setArticle((prev) => ({
            ...prev,
            content: textarea.value.substring(0, start) + replacement + textarea.value.substring(end),
        }))

        // Set cursor position after insertion
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
        }, 0)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9d8462]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/admin/articles")} className="text-gray-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">{isNewArticle ? "Create New Article" : "Edit Article"}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-1"
                    >
                        {previewMode ? (
                            <>
                                <EyeOff className="h-4 w-4" />
                                Edit
                            </>
                        ) : (
                            <>
                                <Eye className="h-4 w-4" />
                                Preview
                            </>
                        )}
                    </Button>

                    {!isNewArticle && (
                        <Button variant="destructive" size="sm" onClick={handleDelete} className="flex items-center gap-1">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave("draft")}
                        disabled={isSaving}
                        className="flex items-center gap-1"
                    >
                        <Save className="h-4 w-4" />
                        Save Draft
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => handleSave("published")}
                        disabled={isSaving}
                        className="flex items-center gap-1 bg-[#9d8462] hover:bg-[#8d7452]"
                    >
                        <Save className="h-4 w-4" />
                        {article.status === "published" ? "Update" : "Publish"}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={article.title ?? ""}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                            placeholder="Article Title"
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="bg-[#1a1a2e] rounded-lg shadow-md">
                        {/* Editor Toolbar */}
                        <div className="border-b border-gray-800 p-2 flex flex-wrap gap-1">
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("# ", "\n")}
                                title="Heading 1"
                            >
                                <Heading1 className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("## ", "\n")}
                                title="Heading 2"
                            >
                                <Heading2 className="h-4 w-4" />
                            </button>
                            <div className="h-6 border-l border-gray-700 mx-1"></div>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("**", "**")}
                                title="Bold"
                            >
                                <Bold className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("*", "*")}
                                title="Italic"
                            >
                                <Italic className="h-4 w-4" />
                            </button>
                            <div className="h-6 border-l border-gray-700 mx-1"></div>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("- ", "\n")}
                                title="Bullet List"
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("1. ", "\n")}
                                title="Numbered List"
                            >
                                <ListOrdered className="h-4 w-4" />
                            </button>
                            <div className="h-6 border-l border-gray-700 mx-1"></div>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("[", "](https://)")}
                                title="Link"
                            >
                                <LinkIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("![alt text](", ")")}
                                title="Image"
                            >
                                <ImageIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f3a] rounded"
                                onClick={() => insertText("```\n", "\n```")}
                                title="Code Block"
                            >
                                <Code className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Editor/Preview Area */}
                        {previewMode ? (
                            <div className="p-6 prose prose-invert max-w-none">
                                {/* In a real app, you'd use a Markdown parser here */}
                                <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br>") }} />
                            </div>
                        ) : (
                            <div className="p-6">
                                <textarea
                                    id="content"
                                    name="content"
                                    value={article.content ?? ""}
                                    onChange={handleChange}
                                    className="w-full h-96 bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462] font-mono"
                                    placeholder="Write your article content here... (Markdown supported)"
                                ></textarea>
                            </div>
                        )}
                    </div>

                    {/* Excerpt */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
                            Excerpt
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={article.excerpt ?? ""}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                            placeholder="Brief summary of the article"
                        ></textarea>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status & Visibility */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-medium text-white mb-4">Status & Visibility</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={article.status ?? ""}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    value={article.slug ?? ""}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                                    placeholder="article-slug"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-medium text-white mb-4">Category</h3>

                        <select
                            id="category_id"
                            name="category_id"
                            value={article.category_id ?? ""}
                            onChange={handleChange}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-medium text-white mb-4">Tags</h3>

                        <div className="space-y-2">
                            {availableTags.map((tag: any) => (
                                <label key={tag.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={article.tags.includes(tag.id)}
                                        onChange={() => handleTagChange(tag.id)}
                                        className="rounded bg-[#0a0a14] border-gray-700 text-[#9d8462] focus:ring-[#9d8462]"
                                    />
                                    <span className="ml-2 text-gray-300">{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-medium text-white mb-4">Featured Image</h3>

                        <div className="space-y-4">
                            <input
                                type="text"
                                id="featured_image"
                                name="featured_image"
                                value={article.featured_image ?? ""}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                                placeholder="Image URL"
                            />

                            <button
                                type="button"
                                className="w-full bg-[#1f1f3a] hover:bg-[#2a2a4e] text-white py-2 rounded-md flex items-center justify-center gap-2"
                            >
                                <ImageIcon className="h-4 w-4" />
                                Upload Image
                            </button>

                            {article.featured_image && (
                                <div className="mt-2 relative aspect-video bg-[#0a0a14] rounded-md overflow-hidden">
                                    <img
                                        src={article.featured_image || "/placeholder.svg"}
                                        alt="Featured"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-medium text-white mb-4">SEO</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    id="meta_title"
                                    name="meta_title"
                                    value={article.meta_title ?? ""}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                                    placeholder="SEO Title"
                                />
                            </div>

                            <div>
                                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    id="meta_description"
                                    name="meta_description"
                                    value={article.meta_description ?? ""}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                                    placeholder="SEO Description"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}