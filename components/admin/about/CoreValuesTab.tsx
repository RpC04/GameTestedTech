"use client"
import { Button } from "@/components/ui/button" 
import { useState } from "react"
import { Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react"
import type { CoreValue, CoreValuesTabProps } from "./types"

export function CoreValuesTab({
    coreValues,
    onSave,
    onDelete,
    onToggleActive
}: CoreValuesTabProps) {
    const [showForm, setShowForm] = useState(false)
    const [editingValue, setEditingValue] = useState<CoreValue | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const value = {
            id: editingValue?.id,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            icon_name: formData.get('icon_name') as string,
            color: formData.get('color') as string,
            is_active: true
        }
        onSave(value)
        setShowForm(false)
        setEditingValue(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Core Values</h3>
                <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add New Value
                </Button>
            </div>
            <h6 className="text-lg font-medium text-white">
                Remember that if you want to add valid icons visit:{" "}
                <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9d8462] underline"
                >
                    Lucide React Icons
                </a>
            </h6>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md border border-gray-700">
                    <h4 className="text-lg font-medium text-white mb-4">
                        {editingValue ? 'Edit Core Value' : 'Add New Core Value'}
                    </h4>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={editingValue?.title || ""}
                                    required
                                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                    placeholder="e.g., Integrity"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Icon Name</label>
                                <input
                                    type="text"
                                    name="icon_name"
                                    defaultValue={editingValue?.icon_name || ""}
                                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                    placeholder="e.g., shield, lightbulb"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                            <input
                                type="text"
                                name="color"
                                defaultValue={editingValue?.color || "#9d8462"}
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                placeholder="#9d8462"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                defaultValue={editingValue?.description || ""}
                                required
                                rows={4}
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                placeholder="Describe this core value..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setEditingValue(null)
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#9d8462] hover:bg-[#8d7452] text-white">
                                Save Value
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Values List */}
            <div className="space-y-3">
                {coreValues.map((value, index) => (
                    <div
                        key={value.id}
                        className="bg-[#1a1a2e] rounded-lg p-4 flex items-center justify-between"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-2xl">{index + 1}</div>
                            <div>
                                <h4 className="text-white font-medium">{value.title}</h4>
                                <p className="text-gray-400 text-sm mt-1 max-w-md">{value.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500">Icon: {value.icon_name}</span>
                                    <span className="text-xs text-gray-500">Color: {value.color}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => onToggleActive(value.id, value.is_active)}
                                className={`p-2 ${value.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                            >
                                {value.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>

                            <Button
                                onClick={() => {
                                    setEditingValue(value)
                                    setShowForm(true)
                                }}
                                className="p-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <Edit3 className="h-4 w-4" />
                            </Button>

                            <Button
                                onClick={() => onDelete(value.id)}
                                className="p-2 bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {coreValues.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No core values added yet. Click "Add New Value" to get started.
                    </div>
                )}
            </div>
        </div>
    )
}