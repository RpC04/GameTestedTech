"use client"

import { useState, useEffect } from "react"
import type React from "react"
import type { ArticleFormWithTags, Category, Tag } from "@/types/article"

import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Save, ArrowLeft, ImageIcon, Eye, EyeOff, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RichTextEditor from "./RichTextEditor"

export default function ArticleEditor({ articleId }: { articleId: string }) {
  const isNewArticle = articleId === "new"
  const numericId = isNewArticle ? null : Number.parseInt(articleId)

  const extractFilePathFromUrl = (url: string): string | null => {
    const parts = url.split('/storage/v1/object/public/imagesblog/')
    return parts.length > 1 ? parts[1] : null
  }

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
  const [activeTab, setActiveTab] = useState<string>("editor")
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Pick<Category, "id" | "name">[]>([])
  const [availableTags, setAvailableTags] = useState<Pick<Tag, "id" | "name">[]>([])

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        //Fetch of categories
        const { data: categoriesData } = await supabase.from("categories").select("id, name").order("name")

        if (categoriesData) setCategories(categoriesData)

        //Fetch of tags
        const { data: tagsData } = await supabase.from("tags").select("id, name").order("name")

        if (tagsData) setAvailableTags(tagsData)

        //Fetch of article if not new
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

  const handleContentChange = (content: string) => {
    setArticle((prev) => ({
      ...prev,
      content,
    }))
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
        title: articleData.title,
        slug: articleData.slug,
        content: articleData.content,
        excerpt: articleData.excerpt,
        featured_image: articleData.featured_image,
        category_id: articleData.category_id,
        meta_title: articleData.meta_title,
        meta_description: articleData.meta_description,
        status,
        updated_at: new Date().toISOString(),
        ...(isNewArticle && { created_at: new Date().toISOString() }),
      }

      if (isNewArticle) {
        // Get authenticated user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError || !user) throw new Error("Could not obtain the user.")

        // Get author corresponding to this user
        const { data: author, error: authorError } = await supabase.from("authors").select("id").limit(1).single()

        if (authorError || !author) throw new Error("Could not find author linked to user.")

        // Insert article with author_id included
        const { data, error } = await supabase
          .from("articles")
          .insert([
            {
              ...payload,
              author_id: author.id,
            },
          ])
          .select()

        if (error) throw error

        const newArticleId = data?.[0]?.id
        if (!newArticleId) throw new Error("Could not obtain the ID of the new article.")

        if (tags.length > 0) {
          const tagInserts = tags.map((tagId) => ({
            article_id: newArticleId,
            tag_id: tagId,
          }))
          const { error: tagError } = await supabase.from("article_tags").insert(tagInserts)
          if (tagError) throw tagError
        }
        router.push(`/admin/articles/${newArticleId}`)
        return
      } else {
        const article_id = Number.parseInt(articleId)
        if (Number.isNaN(article_id)) throw new Error("Invalid article ID")

        const { error } = await supabase.from("articles").update(payload).eq("id", article_id)
        if (error) throw error

        // First delete old tags
        await supabase.from("article_tags").delete().eq("article_id", article_id)

        // Then insert new ones
        if (tags.length > 0) {
          const tagInserts = tags.map((tagId) => ({
            article_id,
            tag_id: tagId,
          }))
          const { error: tagError } = await supabase.from("article_tags").insert(tagInserts)
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
      if (article.featured_image) {
        const oldFilePath = extractFilePathFromUrl(article.featured_image)
        if (oldFilePath) {
          await supabase.storage.from("imagesblog").remove([oldFilePath])
        }
      }

      const { error } = await supabase.from("articles").delete().eq("id", articleId)
      if (error) throw error
      router.push("/admin/articles")
    } catch (error) {
      console.error("Error deleting article:", error)
      setError("Failed to delete article")
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (article.featured_image) {
        try {
          const oldFilePath = extractFilePathFromUrl(article.featured_image); //Use the helper function
          console.log("Path to delete:", oldFilePath); // Debug

          if (oldFilePath) {
            const { error: deleteError } = await supabase.storage
              .from("imagesblog")
              .remove([oldFilePath]);

            if (deleteError) {
              console.error("Error deleting:", deleteError);
            } else {
              console.log("Previous image deleted successfully");
            }
          }
        } catch (error) {
          console.log("Could not delete previous image:", error)
        }
      }

      const filePath = `featured-images/${Date.now()}-${file.name}`;
      const { error } = await supabase
        .storage
        .from("imagesblog")
        .upload(filePath, file);

      if (error) {
        setError("Error uploading image: " + error.message);
        return;
      }


      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("imagesblog").getPublicUrl(filePath);
      const publicUrl = publicUrlData?.publicUrl;

      setArticle(prev => ({
        ...prev,
        featured_image: publicUrl,
      }));

      // If existing article, update the featured image in the database
      if (!isNewArticle && article.id) {
        const { error: updateError } = await supabase
          .from("articles")
          .update({ featured_image: publicUrl })
          .eq("id", article.id);
        if (updateError) {
          setError("Error updating article image: " + updateError.message);
        }
      }
    } catch (error: any) {
      console.error("Error uploading image:", error)
      setError("Error uploading image: " + (error.message || "Unknown error"))
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <div>
            <h1 className="text-2xl font-bold text-white">{isNewArticle ? "Create New Article" : "Edit Article"}</h1>
            <span className={`
                ml-3 px-3 py-1 rounded-full text-xs font-semibold 
                ${article.status === "draft" ? "bg-yellow-900/30 text-yellow-400" : ""}
                ${article.status === "published" ? "bg-green-900/30 text-green-400" : ""}
                ${article.status === "archived" ? "bg-gray-900/30 text-gray-400" : ""}
              `}>
              {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
            </span>
          </div>
        </div>


        <div className="flex items-center gap-2">
          {/* Preview/Edit toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab(activeTab === "editor" ? "preview" : "editor")}
            className={`flex items-center gap-1
      ${activeTab === "editor"
                ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                : "bg-transparent text-white border border-white hover:bg-white hover:text-black"}`}
          >
            {activeTab === "editor" ? (<><Eye className="h-4 w-4" />Preview</>) : (<><EyeOff className="h-4 w-4" />Edit</>)}
          </Button>

          {/* Delete */}
          {!isNewArticle && (
            <Button variant="destructive" size="sm" onClick={handleDelete} className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}

          {/* Condiciones por status */}
          {article.status === "draft" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("draft")}
                disabled={isSaving}
                className="flex items-center gap-1 bg-white text-black border border-gray-300 hover:bg-gray-100"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave("published")}
                disabled={isSaving}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Publish
              </Button>
            </>
          )}

          {article.status === "published" && (
            <Button
              size="sm"
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Update
            </Button>
          )}

          {article.status === "archived" && (
            <Button
              size="sm"
              onClick={() => handleSave("archived")}
              disabled={isSaving}
              className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700"
            >
              <Save className="h-4 w-4" />
              Update Archived
            </Button>
          )}
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
          <div className="bg-slate-900 rounded-lg p-6 shadow-md">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={article.title ?? ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Article Title"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-slate-900 rounded-lg shadow-md">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-950 rounded-t-lg">
                <TabsTrigger value="editor" className="rounded-tl-lg">
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="rounded-tr-lg">
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="p-0 m-0">
                <RichTextEditor
                  content={article.content}
                  onChange={handleContentChange}
                  placeholder="Escribe tu artículo aquí..."
                />
              </TabsContent>
              <TabsContent value="preview" className="p-6 prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Excerpt */}
          <div className="bg-slate-900 rounded-lg p-6 shadow-md">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={article.excerpt ?? ""}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-950 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief summary of the article"
            ></textarea>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="bg-slate-900 rounded-lg p-6 shadow-md">
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
                  className="w-full bg-slate-950 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full bg-slate-950 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="article-slug"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-slate-900 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-white mb-4">Category</h3>

            <select
              id="category_id"
              name="category_id"
              value={article.category_id ?? ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="bg-slate-900 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-white mb-4">Tags</h3>

            <div className="space-y-2">
              {availableTags.map((tag: any) => (
                <label key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={article.tags.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="rounded bg-slate-950 border-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-300">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-slate-900 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-white mb-4">Featured Image</h3>

            {/* ...inside the Featured Image section... */}
            <div className="space-y-4">

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                id="featured_image_file"
                style={{ display: "none" }}
                onChange={handleUploadImage}
              />
              <button
                type="button"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-md flex items-center justify-center gap-2"
                onClick={() => document.getElementById("featured_image_file")?.click()}
              >
                <ImageIcon className="h-4 w-4" />
                Upload Image
              </button>

              {article.featured_image && (
                <div className="mt-2 relative aspect-video bg-slate-950 rounded-md overflow-hidden">
                  <img
                    src={article.featured_image || "/placeholder.svg"}
                    alt="Featured"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                    }}
                  />
                  {/* Button to remove image (optional) */}
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 text-white text-xs px-2 py-1 rounded"
                    onClick={() =>
                      setArticle(prev => ({ ...prev, featured_image: "" }))
                    }
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* SEO */}
          <div className="bg-slate-900 rounded-lg p-6 shadow-md">
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
                  className="w-full bg-slate-950 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full bg-slate-950 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
