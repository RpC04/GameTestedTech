import { useState } from "react"
import { Tag, Edit, Trash2, Save, X, ChevronRight, FolderOpen } from "lucide-react"
import type { Category } from "@/types/admin/categories/types"

interface CategoryRowProps {
  category: Category
  level?: number
  parentCategories: Category[]
  expandedCategories: Set<string>
  onToggleExpanded: (id: string) => void
  onEdit: (category: Category) => void
  onUpdate: (id: string, data: { name: string; parent_id: string | null }) => void
  onDelete: (id: string) => void
}

export function CategoryRow({
  category,
  level = 0,
  parentCategories,
  expandedCategories,
  onToggleExpanded,
  onEdit,
  onUpdate,
  onDelete
}: CategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: category.name,
    parent_id: category.parent_id
  })

  const hasSubcategories = category.subcategories && category.subcategories.length > 0
  const isExpanded = expandedCategories.has(category.id)

  const handleSave = async () => {
    const success = await onUpdate(category.id, editData)
    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditData({ name: category.name, parent_id: category.parent_id })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <tr className="border-t border-gray-800 bg-[#1f1f3a]">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462]"
            />
          </div>
        </td>
        <td className="px-4 py-3">
          <select
            value={editData.parent_id || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, parent_id: e.target.value || null }))}
            className="bg-[#0a0a14] border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462]"
          >
            <option value="">No parent (Top level category)</option>
            {parentCategories
              .filter(cat => cat.id !== category.id)
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
              onClick={handleSave}
              className="text-green-500 hover:text-green-400 p-1"
              title="Save"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
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
                onClick={() => onToggleExpanded(category.id)}
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
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-white p-1"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="text-gray-400 hover:text-red-500 p-1"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && hasSubcategories && category.subcategories!.map(subcat => (
        <CategoryRow
          key={subcat.id}
          category={subcat}
          level={level + 1}
          parentCategories={parentCategories}
          expandedCategories={expandedCategories}
          onToggleExpanded={onToggleExpanded}
          onEdit={onEdit}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </>
  )
}