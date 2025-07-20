"use client"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tag, Plus, Edit, Trash2, Save, X, AlertCircle, ChevronRight, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

type Category = {
  id: string
  name: string
  parent_id: string | null
  article_count?: number
  subcategories?: Category[]
  parent_name?: string // Para mostrar el nombre del padre
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [parentCategories, setParentCategories] = useState<Category[]>([]) // Solo categorías padre
  const [isLoading, setIsLoading] = useState(true)
  const [newCategory, setNewCategory] = useState<Omit<Category, "id" | "article_count" | "subcategories">>({
    name: "",
    parent_id: null
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          articles:articles(count),
          parent:categories!parent_id(name)
        `)
        .order("name")

      if (error) throw error

      // Procesar datos y agregar información del padre
      const categoriesWithCounts = (data || []).map(cat => ({
        ...cat,
        article_count: cat.articles?.[0]?.count || 0,
        parent_name: cat.parent?.name || null
      }))

      // Guardar todas las categorías
      setAllCategories(categoriesWithCounts)

      // Filtrar solo las categorías padre (sin parent_id) para el dropdown
      const parentCats = categoriesWithCounts.filter(cat => !cat.parent_id)
      setParentCategories(parentCats)

      // Organizar en estructura jerárquica
      const organized = organizeCategories(categoriesWithCounts)
      setCategories(organized)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  // Organizar categorías en estructura jerárquica de solo 2 niveles
  const organizeCategories = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>()
    const rootCategories: Category[] = []

    // Crear mapa de categorías
    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, subcategories: [] })
    })

    // Organizar en jerarquía de solo 2 niveles
    flatCategories.forEach(cat => {
      const category = categoryMap.get(cat.id)!
      
      if (!cat.parent_id) {
        // Es una categoría padre
        rootCategories.push(category)
      } else if (categoryMap.has(cat.parent_id)) {
        // Es una subcategoría, agregar al padre
        const parent = categoryMap.get(cat.parent_id)!
        parent.subcategories = parent.subcategories || []
        parent.subcategories.push(category)
      }
    })

    return rootCategories
  }

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewCategory(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }))
  }

  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditingCategory(prev => {
      if (!prev) return prev
      return {
        ...prev,
        [name]: value === '' ? null : value
      }
    })
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
          parent_id: newCategory.parent_id,
          slug: newCategory.name.toLowerCase().replace(/\s+/g, '-')
        })
        .select()

      if (error) throw error

      await fetchCategories()
      setNewCategory({ name: "", parent_id: null })
      setIsAdding(false)
      setError("")
    } catch (error) {
      console.error("Error adding category:", error)
      setError("Failed to add category")
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name) {
      setError("Category name is required")
      return
    }

    // Prevenir que una categoría sea su propio padre
    if (editingCategory.parent_id === editingCategory.id) {
      setError("A category cannot be its own parent")
      return
    }

    // Verificar que si tiene parent_id, el padre no sea una subcategoría
    if (editingCategory.parent_id) {
      const parent = allCategories.find(cat => cat.id === editingCategory.parent_id)
      if (parent && parent.parent_id) {
        setError("Cannot assign a subcategory as parent. Only top-level categories can be parents.")
        return
      }
    }

    // Si la categoría actual tiene subcategorías y se quiere convertir en subcategoría
    const currentCategory = allCategories.find(cat => cat.id === editingCategory.id)
    if (editingCategory.parent_id && currentCategory) {
      const hasSubcategories = allCategories.some(cat => cat.parent_id === currentCategory.id)
      if (hasSubcategories) {
        setError("Cannot convert a category with subcategories into a subcategory. Please move or delete its subcategories first.")
        return
      }
    }

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: editingCategory.name,
          parent_id: editingCategory.parent_id,
          slug: editingCategory.name.toLowerCase().replace(/\s+/g, '-')
        })
        .eq("id", editingCategory.id)

      if (error) throw error

      await fetchCategories()
      setEditingCategory(null)
      setError("")
    } catch (error) {
      console.error("Error updating category:", error)
      setError("Failed to update category")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    // Verificar si la categoría tiene subcategorías
    const hasSubcategories = allCategories.some(cat => cat.parent_id === id)
    
    let confirmMessage = "Are you sure you want to delete this category?"
    if (hasSubcategories) {
      confirmMessage = "This category has subcategories. Deleting it will also affect its subcategories and all related articles. Are you sure?"
    }

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error
      await fetchCategories()
      setError("")
    } catch (error) {
      console.error("Error deleting category:", error)
      setError("Failed to delete category")
    }
  }

  const CategoryRow = ({ category, level = 0 }: { category: Category; level?: number }) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const isEditing = editingCategory && editingCategory.id === category.id

    if (isEditing) {
      return (
        <tr className="border-t border-gray-800 bg-[#1f1f3a]">
          <td className="px-4 py-3">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
              <input
                type="text"
                name="name"
                value={editingCategory.name}
                onChange={handleEditCategoryChange}
                className="flex-1 bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462]"
              />
            </div>
          </td>
          <td className="px-4 py-3">
            <select
              name="parent_id"
              value={editingCategory.parent_id || ''}
              onChange={handleEditCategoryChange}
              className="bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462]"
            >
              <option value="">No parent (Top level category)</option>
              {parentCategories
                .filter(cat => cat.id !== editingCategory.id)
                .map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
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
                onClick={() => {
                  setEditingCategory(null)
                  setError("")
                }}
                className="text-gray-400 hover:text-white p-1"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      )
    }

    return (
      <>
        <tr className="border-t border-gray-800 hover:bg-[#1f1f3a]">
          <td className="px-4 py-3 font-medium text-white">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
              {hasSubcategories && (
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              )}
              {!hasSubcategories && <span className="w-4" />}
              {level === 0 ? (
                <FolderOpen className="h-4 w-4 text-[#9d8462]" />
              ) : (
                <Tag className="h-4 w-4 text-[#9d8462]" />
              )}
              {category.name}
            </div>
          </td>
          <td className="px-4 py-3 text-gray-400">
            {category.parent_id ? 'Subcategory' : 'Parent Category'}
          </td> 
          <td className="px-4 py-3 text-gray-400">{category.article_count || 0}</td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditingCategory(category)
                  setError("")
                }}
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
        {isExpanded && hasSubcategories && category.subcategories!.map(subcat => (
          <CategoryRow key={subcat.id} category={subcat} level={level + 1} />
        ))}
      </>
    )
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
            <button 
              onClick={() => {
                setIsAdding(false)
                setError("")
              }} 
              className="text-gray-400 hover:text-white"
            >
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
              <label htmlFor="parent_id" className="block text-sm font-medium text-gray-300 mb-2">
                Parent Category
              </label>
              <select
                id="parent_id"
                name="parent_id"
                value={newCategory.parent_id || ''}
                onChange={handleNewCategoryChange}
                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
              >
                <option value="">No parent (Top level category)</option>
                {parentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
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
                <th className="px-4 py-3">Type</th> 
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
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="h-4 bg-gray-700 rounded w-20 ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : categories.length > 0 ? (
                categories.map(category => (
                  <CategoryRow key={category.id} category={category} level={0} />
                ))
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