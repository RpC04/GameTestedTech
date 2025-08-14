export type Category = {
  id: string
  name: string
  parent_id: string | null
  article_count?: number
  subcategories?: Category[]
  parent_name?: string
}

export interface CategoryFormData {
  name: string
  parent_id: string | null
}

export interface CategoryState {
  categories: Category[]
  allCategories: Category[]
  parentCategories: Category[]
  expandedCategories: Set<string>
  editingCategory: Category | null
  newCategory: CategoryFormData
  isAdding: boolean
  isLoading: boolean
}