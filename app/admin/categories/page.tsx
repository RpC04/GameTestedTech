"use client"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tag, Plus, Edit, Trash2, Save, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const [editingCategory, setEditingCategory] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name")

      if (error) throw error

      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target

    if (name === "name" && newCategory.slug === "") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      setNewCategory((prev) => ({
        ...prev,
        name: value,
        slug,
      }))
    } else {
      setNewCategory((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleEditCategoryChange = (e) => {
    const { name, value } = e.target

    setEditingCategory((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      setError("Category name is required")
      return
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCategory.name,
          slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, "-"),
          description: newCategory.description,
        })
        .select()

      if (error) throw error

      setCategories((prev) => [...prev, data[0]])
      setNewCategory({ name: "", slug: "", description: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Error adding category:", error)
      setError("Failed to add category")
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory.name) {
      setError("Category name is required")
      return
    }

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description,
        })
        .eq("id", editingCategory.id)

      if (error) throw error

      setCategories((prev) => prev.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)))
      setEditingCategory(null)
    } catch (error) {
      console.error("Error updating category:", error)
      setError("Failed to update category")
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category? This will affect all articles using this category.")) {
      return
    }

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) throw error

      setCategories((prev) => prev.filter((cat) => cat.id !== id))
    } catch (error) {
      console.error("Error deleting category:", error)
      setError("Failed to delete category")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
          disabled={isAdding}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Add Category Form */}
      {isAdding && (
        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Add New Category</h2>
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
                value={newCategory.name}
                onChange={handleNewCategoryChange}
                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                placeholder="Category Name"
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
                value={newCategory.slug}
                onChange={handleNewCategoryChange}
                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                placeholder="category-slug"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newCategory.description}
              onChange={handleNewCategoryChange}
              rows={3}
              className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
              placeholder="Category description"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddCategory}
              className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Category
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1f1f3a] text-gray-300 text-left">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Articles</th>
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
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded w-48"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded w-12"></div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="h-4 bg-gray-700 rounded w-20 ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : categories.length > 0 ? (
                categories.map((category: any) =>
                  editingCategory && editingCategory.id === category.id ? (
                    <tr key={category.id} className="border-t border-gray-800 bg-[#1f1f3a]">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="name"
                          value={editingCategory.name}
                          onChange={handleEditCategoryChange}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="slug"
                          value={editingCategory.slug}
                          onChange={handleEditCategoryChange}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="description"
                          value={editingCategory.description}
                          onChange={handleEditCategoryChange}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-400">{category.article_count || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={handleUpdateCategory}
                            className="text-green-500 hover:text-green-400 p-1"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="text-gray-400 hover:text-white p-1"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={category.id} className="border-t border-gray-800 hover:bg-[#1f1f3a]">
                      <td className="px-4 py-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-[#9d8462]" />
                          {category.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{category.slug}</td>
                      <td className="px-4 py-3 text-gray-400">{category.description}</td>
                      <td className="px-4 py-3 text-gray-400">{category.article_count || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="text-gray-400 hover:text-white p-1"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
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
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No categories found. Create your first category!
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
