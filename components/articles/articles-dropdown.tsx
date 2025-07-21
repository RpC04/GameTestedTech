"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from 'next/navigation';

interface Category {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    icon?: string;
}

interface CategoryWithSubs extends Category {
    subcategories: Category[];
}

export default function ArticlesDropdown() {
    const [open, setOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
    const [loading, setLoading] = useState(true);
    const [dropdownStyle, setDropdownStyle] = useState<'horizontal' | 'vertical'>('horizontal');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Detectar si hay espacio suficiente para el dropdown horizontal
    useEffect(() => {
        const checkDropdownLayout = () => {
            if (dropdownRef.current && open) {
                const rect = dropdownRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const dropdownWidth = 256 + 288; // ancho base + ancho subcategorías
                
                // Si no hay espacio suficiente, cambiar a vertical
                if (rect.left + dropdownWidth > viewportWidth || viewportWidth < 640) {
                    setDropdownStyle('vertical');
                } else {
                    setDropdownStyle('horizontal');
                }
            }
        };

        if (open) {
            checkDropdownLayout();
        }

        window.addEventListener('resize', checkDropdownLayout);
        return () => window.removeEventListener('resize', checkDropdownLayout);
    }, [open]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase
                    .from("categories")
                    .select("*")
                    .order("name");

                if (error) throw error;

                const parentCategories: CategoryWithSubs[] = [];
                data?.forEach(cat => {
                    if (cat.parent_id === null) {
                        const parent: CategoryWithSubs = {
                            ...cat,
                            subcategories: []
                        };

                        data.forEach(subCat => {
                            if (subCat.parent_id === cat.id) {
                                parent.subcategories.push(subCat);
                            }
                        });

                        if (parent.subcategories.length > 0) {
                            parentCategories.push(parent);
                        }
                    }
                });

                setCategories(parentCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    const handleCategoryClick = (category: Category) => {
        router.push(`/articles?category=${category.slug}`);
        setOpen(false);
        setHoveredIndex(null);
    };

    if (loading) {
        return (
            <div className="flex items-center gap-1 px-4 py-2 text-white">
                <span>Articles</span>
                <ChevronDown className="w-4 h-4 ml-1" />
            </div>
        );
    }

    return (
        <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => {
                setOpen(false);
                setHoveredIndex(null);
            }}
        >
            <div className="flex items-center gap-1 px-4 py-2">
                <Link href="/articles" className="text-white hover:text-game-cyan transition">
                    Articles
                </Link>
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform text-white ${open ? "rotate-180" : ""}`} />
            </div>

            {open && (
                <>
                    {dropdownStyle === 'horizontal' ? (
                        // Layout horizontal (cuando hay espacio)
                        <div className="absolute left-0 top-full flex bg-[#0f0f23] shadow-2xl rounded-xl z-[9999] min-w-[256px] max-w-[544px]">
                            <ul className="w-64 py-4 px-2 space-y-1 border-r border-gray-700">
                                {categories.map((cat, i) => (
                                    <li
                                        key={cat.id}
                                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer gap-2 transition
                                          ${hoveredIndex === i ? "bg-[#ff6b35] text-white" : "text-gray-200 hover:bg-[#ff6b35]"}
                                        `}
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onClick={() => handleCategoryClick(cat)}
                                    >
                                        <span className="flex-1 text-sm">{cat.name}</span>
                                        <ChevronRight className="ml-auto w-4 h-4" />
                                    </li>
                                ))}
                            </ul>
                            
                            {hoveredIndex !== null && categories[hoveredIndex]?.subcategories.length > 0 && (
                                <ul className="w-72 py-4 px-4 space-y-2">
                                    {categories[hoveredIndex].subcategories.map((sub) => (
                                        <li key={sub.id}>
                                            <button
                                                onClick={() => handleCategoryClick(sub)}
                                                className="block w-full text-left px-3 py-2 rounded-lg text-gray-100 hover:bg-[#ff6b35] hover:text-white transition text-sm"
                                            >
                                                {sub.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        // Layout vertical (cuando no hay espacio)
                        <div className="absolute left-0 top-full bg-[#0f0f23] shadow-2xl rounded-xl z-[9999] w-80 max-w-[90vw] max-h-[70vh] overflow-y-auto">
                            <div className="py-4 px-2">
                                {categories.map((cat, i) => (
                                    <div key={cat.id} className="mb-1">
                                        <div
                                            className={`flex items-center px-4 py-2 rounded-lg cursor-pointer gap-2 transition
                                              ${hoveredIndex === i ? "bg-[#ff6b35] text-white" : "text-gray-200 hover:bg-[#ff6b35]"}
                                            `}
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onClick={() => handleCategoryClick(cat)}
                                        >
                                            <span className="flex-1 text-sm font-medium">{cat.name}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${hoveredIndex === i ? 'rotate-180' : ''}`} />
                                        </div>
                                        
                                        {/* Subcategorías expandidas debajo */}
                                        {hoveredIndex === i && cat.subcategories.length > 0 && (
                                            <div className="mt-1 ml-4 space-y-1">
                                                {cat.subcategories.map((sub) => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => handleCategoryClick(sub)}
                                                        className="block w-full text-left px-3 py-1.5 rounded text-gray-300 hover:bg-[#ff6b35] hover:text-white transition text-sm"
                                                    >
                                                        {sub.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}