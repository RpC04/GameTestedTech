import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Category, CategoryFormData, CategoryState } from "@/types/admin/categories/types"

export function useCategories() {
  const [state, setState] = useState<CategoryState>({
    categories: [],
    allCategories: [],
    parentCategories: [],
    expandedCategories: new Set(),
    editingCategory: null,
    newCategory: { name: "", parent_id: null },
    isAdding: false,
    isLoading: true
  })

  const [error, setError] = useState("")
  const supabase = createClientComponentClient()

  // Función para actualizar estado
  const updateState = (updates: Partial<CategoryState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  // Organizar categorías en jerarquía
  const organizeCategories = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>()
    const rootCategories: Category[] = []

    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, subcategories: [] })
    })

    flatCategories.forEach(cat => {
      const category = categoryMap.get(cat.id)!
      
      if (!cat.parent_id) {
        rootCategories.push(category)
      } else if (categoryMap.has(cat.parent_id)) {
        const parent = categoryMap.get(cat.parent_id)!
        parent.subcategories = parent.subcategories || []
        parent.subcategories.push(category)
      }
    })

    return rootCategories
  }

  // Fetch categorías
  const fetchCategories = async () => {
    updateState({ isLoading: true })
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

      const categoriesWithCounts = (data || []).map(cat => ({
        ...cat,
        article_count: cat.articles?.[0]?.count || 0,
        parent_name: cat.parent?.name || null
      }))

      const parentCats = categoriesWithCounts.filter(cat => !cat.parent_id)
      const organized = organizeCategories(categoriesWithCounts)

      updateState({
        allCategories: categoriesWithCounts,
        parentCategories: parentCats,
        categories: organized,
        isLoading: false
      })

    } catch (error: any) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories")
      updateState({ isLoading: false })
    }
  }

  // Validar categoría
  const validateCategory = (categoryData: CategoryFormData, isEdit = false, editingId?: string): string | null => {
    if (!categoryData.name.trim()) {
      return "Category name is required"
    }

    if (isEdit && categoryData.parent_id === editingId) {
      return "A category cannot be its own parent"
    }

    if (categoryData.parent_id) {
      const parent = state.allCategories.find(cat => cat.id === categoryData.parent_id)
      if (parent && parent.parent_id) {
        return "Cannot assign a subcategory as parent. Only top-level categories can be parents."
      }
    }

    if (isEdit && categoryData.parent_id && editingId) {
      const hasSubcategories = state.allCategories.some(cat => cat.parent_id === editingId)
      if (hasSubcategories) {
        return "Cannot convert a category with subcategories into a subcategory. Please move or delete its subcategories first."
      }
    }

    return null
  }

  // Crear categoría
  const createCategory = async (categoryData: CategoryFormData) => {
    const validationError = validateCategory(categoryData)
    if (validationError) {
      setError(validationError)
      return false
    }

    try {
      const { error } = await supabase
        .from("categories")
        .insert({
          name: categoryData.name,
          parent_id: categoryData.parent_id,
          slug: categoryData.name.toLowerCase().replace(/\s+/g, '-')
        })

      if (error) throw error

      await fetchCategories()
      updateState({ 
        newCategory: { name: "", parent_id: null },
        isAdding: false 
      })
      setError("")
      return true

    } catch (error: any) {
      console.error("Error adding category:", error)
      setError("Failed to add category")
      return false
    }
  }

  // Actualizar categoría
  const updateCategory = async (id: string, categoryData: CategoryFormData) => {
    const validationError = validateCategory(categoryData, true, id)
    if (validationError) {
      setError(validationError)
      return false
    }

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: categoryData.name,
          parent_id: categoryData.parent_id,
          slug: categoryData.name.toLowerCase().replace(/\s+/g, '-')
        })
        .eq("id", id)

      if (error) throw error

      await fetchCategories()
      updateState({ editingCategory: null })
      setError("")
      return true

    } catch (error: any) {
      console.error("Error updating category:", error)
      setError("Failed to update category")
      return false
    }
  }

  // Eliminar categoría
  const deleteCategory = async (id: string) => {
    const hasSubcategories = state.allCategories.some(cat => cat.parent_id === id)
    
    const confirmMessage = hasSubcategories 
      ? "This category has subcategories. Deleting it will also affect its subcategories and all related articles. Are you sure?"
      : "Are you sure you want to delete this category?"

    if (!confirm(confirmMessage)) return false

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error
      
      await fetchCategories()
      setError("")
      return true

    } catch (error: any) {
      console.error("Error deleting category:", error)
      setError("Failed to delete category")
      return false
    }
  }

  // Toggle expandir categoría
  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(state.expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    updateState({ expandedCategories: newExpanded })
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    ...state,
    error,
    updateState,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleExpanded,
    setError
  }
}