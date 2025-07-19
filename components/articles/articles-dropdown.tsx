"use client";
import { useState, useEffect } from "react";
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
    const router = useRouter();

    useEffect(() => {
        async function fetchCategories() {
            try {
                // Get all categories from Supabase
                const { data, error } = await supabase
                    .from("categories")
                    .select("*")
                    .order("name");

                if (error) throw error;

                // Organize into hierarchical structure
                const parentCategories: CategoryWithSubs[] = [];
                const categoryMap = new Map<number, Category>();

                // First, create a map of all categories
                data?.forEach(cat => {
                    categoryMap.set(cat.id, cat);
                });

                // Then, organize parent categories with their children
                data?.forEach(cat => {
                    if (cat.parent_id === null) {
                        // It's a parent category
                        const parent: CategoryWithSubs = {
                            ...cat,
                            subcategories: []
                        };

                        // Find all subcategories
                        data.forEach(subCat => {
                            if (subCat.parent_id === cat.id) {
                                parent.subcategories.push(subCat);
                            }
                        });

                        // Only add if it has subcategories
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
                <div
                    className={`absolute left-0 top-full flex bg-[#0f0f23] shadow-2xl rounded-xl z-[9999] ${hoveredIndex === null ? "w-[256px]" : ""
                        }`}
                    style={{ minHeight: 0 }}
                >
                    {/*categories */}
                    <ul className="w-64 py-4 px-2 space-y-1 border-r border-[#0f0f23]">
                        {categories.map((cat, i) => (
                            <li
                                key={cat.id}
                                className={`flex items-center px-4 py-2 rounded-lg cursor-pointer gap-2 transition
                                  ${hoveredIndex === i ? "bg-[#ff6b35] text-white" : "text-purple-200 hover:bg-[#ff6b35]"}
                                `}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onClick={() => {
                                    // Navigate to articles with the category slug
                                    router.push(`/articles?category=${cat.slug}`);
                                }}
                                tabIndex={0}
                            >
                                <span className="flex-1">{cat.name}</span>
                                <ChevronRight className="ml-auto w-4 h-4" />
                            </li>
                        ))}
                    </ul>
                    {/* Subcategories */}
                    {hoveredIndex !== null && categories[hoveredIndex]?.subcategories.length > 0 && (
                        <ul
                            className="w-72 py-4 px-4 space-y-2"
                            style={{ minHeight: "100%" }}
                            onMouseEnter={() => setHoveredIndex(hoveredIndex)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {categories[hoveredIndex].subcategories.map((sub) => (
                                <li key={sub.id}>
                                    <Link
                                        href={`/articles?category=${sub.slug}`}
                                        className="block px-3 py-2 rounded-lg text-purple-100 hover:bg-[#ff6b35] hover:text-white transition"
                                    >
                                        {sub.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}