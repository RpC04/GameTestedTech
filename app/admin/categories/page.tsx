"use client"
import { Plus, AlertCircle, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryRow } from "@/components/admin/categories/categoryRow"
import { useCategories } from "@/hooks/useCategories"
import { LoadingSkeleton } from "@/components/ui/loadingSkeleton"

export default function CategoriesPage() {
  const {
    categories,
    parentCategories,
    expandedCategories,
    newCategory,
    isAdding,
    isLoading,
    error,
    updateState,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleExpanded,
    setError
  } = useCategories()

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateState({
      newCategory: {
        ...newCategory,
        [name]: value === '' ? null : value
      }
    })
  }

  const handleAddCategory = async () => {
    await createCategory(newCategory)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <Button
          onClick={() => updateState({ isAdding: true })}
          className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
          disabled={isAdding}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Error Message */}
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
                updateState({ isAdding: false })
                setError("")
              }} 
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleNewCategoryChange}
                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] focus:border-[#9d8462]"
                placeholder="Category Name"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Parent Category
              </label>
              <select
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

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                updateState({ isAdding: false })
                setError("")
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
              disabled={!newCategory.name.trim()}
            >
              <Save className="h-4 w-4" />
              Save Category
            </Button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1f1f3a] text-gray-300 text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Articles</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map(category => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    level={0}
                    parentCategories={parentCategories}
                    expandedCategories={expandedCategories}
                    onToggleExpanded={toggleExpanded}
                    onEdit={(category) => updateState({ editingCategory: category })}
                    onUpdate={updateCategory}
                    onDelete={deleteCategory}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                        <Plus className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium mb-1">No categories found</p>
                        <p className="text-sm text-gray-500">Create your first category to get started!</p>
                      </div>
                      <Button
                        onClick={() => updateState({ isAdding: true })}
                        className="bg-[#9d8462] hover:bg-[#8d7452] text-white mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories Summary */}
      {categories.length > 0 && (
        <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-800">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>
              Total: {categories.length} parent categories, {' '}
              {categories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)} subcategories
            </span>
          </div>
        </div>
      )}
    </div>
  )
}