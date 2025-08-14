"use client"

import { useState } from "react"
import { ChevronDown, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Update the type to include children
interface MobileTOCProps {
    tableOfContents: {
        id: string;
        title: string;
        children?: { id: string; title: string }[]
    }[]
    postId: string
    onItemClick?: (title: string, postId: string) => void
}

export default function MobileTOC({ tableOfContents, postId, onItemClick }: MobileTOCProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (tableOfContents.length === 0) return null

    // Improved function to handle click with hierarchical structure
    const handleItemClick = (item: { id: string; title: string }) => {
        onItemClick?.(item.title, postId)

        setTimeout(() => {
            setIsOpen(false)
        }, 100)

        setTimeout(() => {
            const element = document.getElementById(item.id)
            if (element) {
                // Automatic header height calculation
                const header = document.querySelector('header') || document.querySelector('nav')
                const headerHeight = header ? header.offsetHeight : 0

                const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
                // Use the actual header height + a bit of padding
                const offset = headerHeight + 20

                window.scrollTo({
                    top: offsetTop - offset,
                    behavior: 'smooth'
                })
            }
        }, 150)
    }

    // Calculate total sections including children
    const totalSections = tableOfContents.reduce((total, item) => {
        return total + 1 + (item.children?.length || 0)
    }, 0)

    return (
        <div className="lg:hidden mb-6">
            {/* Button to open TOC */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white border border-gray-600 rounded-lg p-4 flex items-center justify-between transition-all"
                whileTap={{ scale: 0.98 }}
            >
                <div className="flex items-center gap-3">
                    <List className="h-5 w-5 text-[#ff6b35]" />
                    <span className="font-medium">Table of Contents</span>
                    <span className="text-sm text-gray-400">({totalSections} sections)</span>
                </div>
                <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </motion.button>

            {/* Dropdown with hierarchical structure */}
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
                                    <div key={item.id}>
                                        {/* Main H1 heading */}
                                        <motion.li
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <button
                                                className="w-full text-left block px-4 py-3 text-white font-medium hover:text-[#ff6b35] hover:bg-[#1a1a2e] transition-colors border-l-2 border-transparent hover:border-[#ff6b35]"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <span className="text-sm">{item.title}</span>
                                            </button>
                                        </motion.li>

                                        {/* Nested H2 headings */}
                                        {item.children && item.children.length > 0 && (
                                            <>
                                                {item.children.map((child, childIndex) => (
                                                    <motion.li
                                                        key={child.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: (index * 0.05) + ((childIndex + 1) * 0.03) }}
                                                    >
                                                        <button
                                                            className="w-full text-left block pl-8 pr-4 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a2e] transition-colors border-l-2 border-transparent hover:border-[#ff6b35]/50"
                                                            onClick={() => handleItemClick(child)}
                                                        >
                                                            <span className="text-xs">  {child.title}</span>
                                                        </button>
                                                    </motion.li>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}