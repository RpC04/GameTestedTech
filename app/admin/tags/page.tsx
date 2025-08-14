"use client"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tag, TagIcon, Plus, Edit, Trash2, Save, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type Tag = {
  id: string
  name: string
  slug: string 
}


export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newTag, setNewTag] = useState<Omit<Tag, "id" | "article_count">>({
    name: "",
    slug: "", 
  })
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTags()
  }, [])

const fetchTags = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("tags").select("*").order("name")
      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error("Error fetching tags:", error)
      setError("Failed to load tags")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "name" && newTag.slug === "") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      setNewTag((prev) => ({
        ...prev,
        name: value,
        slug,
      }))
    } else {
      setNewTag((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleEditTagChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setEditingTag((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleAddTag = async () => {
    if (!newTag.name) {
      setError("Tag name is required")
      return
    }

    try {
      const { data, error } = await supabase
        .from("tags")
        .insert({
          name: newTag.name,
          slug: newTag.slug || newTag.name.toLowerCase().replace(/\s+/g, "-")
        })
        .select()

      if (error) throw error

      setTags((prev) => [...prev, data[0]])
      setNewTag({ name: "", slug: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Error adding tag:", error)
      setError("Failed to add tag")
    }
  }

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name) {
      setError("Tag name is required")
      return
    }

    try {
      const { error } = await supabase
        .from("tags")
        .update({
          name: editingTag.name,
          slug: editingTag.slug
        })
        .eq("id", editingTag.id)

      if (error) throw error

      setTags((prev) => prev.map((tag) => (tag.id === editingTag.id ? editingTag : tag)))
      setEditingTag(null)
    } catch (error) {
      console.error("Error updating tag:", error)
      setError("Failed to update tag")
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag? This will affect all articles using this tag.")) {
      return
    }

    try {
      const { error } = await supabase.from("tags").delete().eq("id", id)
      if (error) throw error
      setTags((prev) => prev.filter((tag) => tag.id !== id))
    } catch (error) {
      console.error("Error deleting tag:", error)
      setError("Failed to delete tag")
    }
  }

    return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Tags</h1>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
          disabled={isAdding}
        >
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Add Tag Form */}
      {isAdding && (
        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Add New Tag</h2>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTag.name}
                onChange={handleNewTagChange}
                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                placeholder="Tag Name"
              />
            </div> 
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={newTag.slug}
                onChange={handleNewTagChange}
                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                placeholder="tag-slug"
              />
            </div>
          </div> 

          <div className="flex justify-end">
            <Button
              onClick={handleAddTag}
              className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Tag
            </Button>
          </div>
        </div>
      )}

      {/* Tags List */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1f1f3a] text-gray-300 text-left"> 
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th> 
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index} className="border-t border-gray-800 animate-pulse"> 
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </td> 
                      <td className="px-4 py-3 text-right">
                        <div className="h-4 bg-gray-700 rounded w-20 ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : tags.length > 0 ? (
                tags.map((tag: Tag) =>
                  editingTag && editingTag.id === tag.id ? (
                    <tr key={tag.id} className="border-t border-gray-800 bg-[#1f1f3a]"> 
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="name"
                          value={editingTag.name}
                          onChange={handleEditTagChange}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="slug"
                          value={editingTag.slug}
                          onChange={handleEditTagChange}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                      </td>  
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={handleUpdateTag}
                            className="text-green-500 hover:text-green-400 p-1"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingTag(null)}
                            className="text-gray-400 hover:text-white p-1"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={tag.id} className="border-t border-gray-800 hover:bg-[#1f1f3a]"> 
                      <td className="px-4 py-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <TagIcon className="h-4 w-4 text-[#9d8462]" />
                          {tag.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{tag.slug}</td> 
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingTag(tag)}
                            className="text-gray-400 hover:text-white p-1"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No tags found. Create your first tag!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}