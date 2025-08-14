"use client"

import { Button } from "@/components/ui/button" 
import { useState } from "react"
import { Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react"
import type { FAQ, FaqTabProps } from "@/types/admin/about/types"

export function FaqTab({
    faqs,
    onSave,
    onDelete,
    onToggleActive
}: FaqTabProps) {
    const [showForm, setShowForm] = useState(false)
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)

        const faq = {
            id: editingFaq?.id,
            question: formData.get('question') as string,
            answer: formData.get('answer') as string,
            is_active: true
        }

        onSave(faq)
        setShowForm(false)
        setEditingFaq(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Frequently Asked Questions</h3>
                <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add FAQ
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md border border-gray-700">
                    <h4 className="text-lg font-medium text-white mb-4">
                        {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                    </h4>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
                            <input
                                type="text"
                                name="question"
                                defaultValue={editingFaq?.question || ""}
                                required
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                placeholder="What is your question?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Answer</label>
                            <textarea
                                name="answer"
                                defaultValue={editingFaq?.answer || ""}
                                required
                                rows={6}
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                placeholder="Provide a detailed answer..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setEditingFaq(null)
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#9d8462] hover:bg-[#8d7452] text-white">
                                Save FAQ
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* FAQ List */}
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <div
                        key={faq.id}
                        className="bg-[#1a1a2e] rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm bg-[#9d8462] text-white px-2 py-1 rounded">Q{index + 1}</span>
                                    {!faq.is_active && <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">Hidden</span>}
                                </div>
                                <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                                <p className="text-gray-400 text-sm">{faq.answer.substring(0, 200)}...</p>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    onClick={() => onToggleActive(faq.id, faq.is_active)}
                                    className={`p-2 ${faq.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                                >
                                    {faq.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>

                                <Button
                                    onClick={() => {
                                        setEditingFaq(faq)
                                        setShowForm(true)
                                    }}
                                    className="p-2 bg-blue-600 hover:bg-blue-700"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </Button>

                                <Button
                                    onClick={() => onDelete(faq.id)}
                                    className="p-2 bg-red-600 hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No FAQs added yet. Click "Add FAQ" to get started.
                    </div>
                )}
            </div>
        </div>
    )
}