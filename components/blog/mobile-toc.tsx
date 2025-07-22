"use client"

import { useState } from "react"
import { ChevronDown, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileTOCProps {
    tableOfContents: { id: string; title: string }[]
    postId: string
    onItemClick?: (title: string, postId: string) => void
}

export default function MobileTOC({ tableOfContents, postId, onItemClick }: MobileTOCProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (tableOfContents.length === 0) return null

    return (
        <div className="lg:hidden mb-6">
            {/* Botón para abrir TOC */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white border border-gray-600 rounded-lg p-4 flex items-center justify-between transition-all"
                whileTap={{ scale: 0.98 }}
            >
                <div className="flex items-center gap-3">
                    <List className="h-5 w-5 text-[#ff6b35]" />
                    <span className="font-medium">Table of Contents</span>
                    <span className="text-sm text-gray-400">({tableOfContents.length} sections)</span>
                </div>
                <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </motion.button>

            {/* Dropdown animado */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[#0f0f23] border border-gray-600 border-t-0 rounded-b-lg max-h-64 overflow-y-auto">
                            <ul className="py-2">
                                {tableOfContents.map((item, index) => (
                                    <motion.li
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <a
                                            href={`#${item.id}`}
                                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1a1a2e] transition-colors border-l-2 border-transparent hover:border-[#ff6b35]"
                                            onClick={() => {
                                                setIsOpen(false)
                                                onItemClick?.(item.title, postId)
                                            }}
                                        >
                                            <span className="text-sm">{item.title}</span>
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}