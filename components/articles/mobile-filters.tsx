"use client"

import { useState } from "react"
import DatePicker from "react-datepicker"
import { Button } from "@/components/ui/button"
import { Disclosure } from "@headlessui/react"
import { ChevronDown, Filter, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileFiltersProps {
    categories: { id: number; name: string; icon?: string }[]
    subcategories: { id: number; name: string; parent_id: number | null }[]
    selectedCategories: number[]
    setSelectedCategories: (categories: number[]) => void
    selectedSubcategories: number[]
    setSelectedSubcategories: (subcategories: number[]) => void
    dateRange: [Date | null, Date | null]
    setDateRange: (range: [Date | null, Date | null]) => void
    onClearFilters: () => void
}

export default function MobileFilters({
    categories,
    subcategories,
    selectedCategories,
    setSelectedCategories,
    selectedSubcategories,
    setSelectedSubcategories,
    dateRange,
    setDateRange,
    onClearFilters
}: MobileFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [startDate, endDate] = dateRange

    // Función para manejar selección de categorías padre con sus hijos
    const handleCategoryChange = (categoryId: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedCategories([...selectedCategories, categoryId])
            
            // Encontrar y agregar todas las subcategorías hijas
            const childSubcategories = subcategories
                .filter(sub => sub.parent_id === categoryId)
                .map(sub => sub.id)
            
            setSelectedSubcategories([...new Set([...selectedSubcategories, ...childSubcategories])])
        } else {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
            
            // Remover todas las subcategorías hijas
            const childSubcategories = subcategories
                .filter(sub => sub.parent_id === categoryId)
                .map(sub => sub.id)
            
            setSelectedSubcategories(
                selectedSubcategories.filter(subId => !childSubcategories.includes(subId))
            )
        }
    }

    // Función para manejar selección de subcategorías
    const handleSubcategoryChange = (subcategoryId: number, isChecked: boolean) => {
        const subcategory = subcategories.find(sub => sub.id === subcategoryId)
        
        if (isChecked) {
            setSelectedSubcategories([...selectedSubcategories, subcategoryId])
        } else {
            setSelectedSubcategories(selectedSubcategories.filter(id => id !== subcategoryId))
            
            // Si se deselecciona una subcategoría, deseleccionar también la categoría padre
            if (subcategory?.parent_id) {
                setSelectedCategories(selectedCategories.filter(id => id !== subcategory.parent_id))
            }
        }
    }

    const activeFiltersCount = selectedCategories.length + selectedSubcategories.length + 
        (startDate || endDate ? 1 : 0)

    return (
        <div className="lg:hidden mb-6">
            {/* Botón para abrir filtros */}
            <Button
                onClick={() => setIsOpen(true)}
                className="w-full bg-[#0f0f23] hover:bg-[#1a1a2e] text-white border border-gray-600 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                        <span className="bg-[#ff6b35] text-white text-xs px-2 py-1 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Modal/Overlay de filtros */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="absolute bottom-0 left-0 right-0 bg-[#0f0f23] rounded-t-lg max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <h3 className="text-lg font-semibold text-white">Filters</h3>
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    className="bg-transparent hover:bg-gray-700 p-2"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </Button>
                            </div>

                            {/* Filtros */}
                            <div className="p-4 space-y-4">
                                {/* Categories */}
                                <Disclosure defaultOpen>
                                    {({ open }) => (
                                        <div>
                                            <Disclosure.Button className="flex w-full justify-between items-center text-white font-medium py-3">
                                                <span>Categories</span>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="space-y-3 pb-3">
                                                {categories.map((category) => (
                                                    <label
                                                        key={category.id}
                                                        className="flex items-center gap-3 text-sm text-white cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category.id)}
                                                            onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                                                            className="w-4 h-4 rounded border-gray-500 bg-[#1a1a1a] text-[#ff6b35] focus:ring-[#ff6b35]"
                                                        />
                                                        <span className="text-lg">{category.icon}</span>
                                                        <span>{category.name}</span>
                                                    </label>
                                                ))}
                                            </Disclosure.Panel>
                                        </div>
                                    )}
                                </Disclosure>

                                {/* Subcategories */}
                                <Disclosure>
                                    {({ open }) => (
                                        <div>
                                            <Disclosure.Button className="flex w-full justify-between items-center text-white font-medium py-3">
                                                <span>Subcategories</span>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="space-y-3 pb-3 max-h-48 overflow-y-auto">
                                                {subcategories.map((subcategory) => (
                                                    <label
                                                        key={subcategory.id}
                                                        className="flex items-center gap-3 text-sm text-white cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSubcategories.includes(subcategory.id)}
                                                            onChange={(e) => handleSubcategoryChange(subcategory.id, e.target.checked)}
                                                            className="w-4 h-4 rounded border-gray-500 bg-[#1a1a1a] text-[#ff6b35] focus:ring-[#ff6b35]"
                                                        />
                                                        <span>{subcategory.name}</span>
                                                    </label>
                                                ))}
                                            </Disclosure.Panel>
                                        </div>
                                    )}
                                </Disclosure>

                                {/* Date Filter */}
                                <Disclosure>
                                    {({ open }) => (
                                        <div>
                                            <Disclosure.Button className="flex w-full justify-between items-center text-white font-medium py-3">
                                                <span>Date Range</span>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="pb-3">
                                                <DatePicker
                                                    selectsRange
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                                                    isClearable
                                                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-md px-3 py-2 text-white"
                                                    dateFormat="yyyy-MM-dd"
                                                    placeholderText="Select date range"
                                                />
                                            </Disclosure.Panel>
                                        </div>
                                    )}
                                </Disclosure>
                            </div>

                            {/* Footer con botones */}
                            <div className="flex gap-3 p-4 border-t border-gray-700">
                                <Button
                                    onClick={onClearFilters} 
                                    className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                                >
                                    Clear All
                                </Button>
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}