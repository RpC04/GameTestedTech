"use client"

import Image from "next/image"
import Link from "next/link"
import DatePicker from "react-datepicker"
import { Button } from "@/components/ui/button"
import { HomeJsonLd } from "@/components/home-jsonld"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Disclosure } from "@headlessui/react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import MobileFilters from "@/components/articles/mobile-filters"
import { useSearchParams } from 'next/navigation'
import { useHeroStats } from "@/hooks/useHeroStats";

export default function Articles() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [latestArticles, setLatestArticles] = useState<any[]>([])
    const [categories, setCategories] = useState<{ id: number; name: string; icon?: string }[]>([])
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [subcategories, setSubcategories] = useState<{ id: number; name: string; parent_id: number | null }[]>([])
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([])
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [startDate, endDate] = dateRange
    const { heroStats, loading: statsLoading, error: statsError } = useHeroStats();
    const searchParams = useSearchParams()
    const categorySlug = searchParams.get('category')

    const floatAnimation = {
        y: [0, -15, 0],
        rotate: [0, 2, 0, -2, 0],
        transition: {
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    }

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    // Effect to activate category filter based on URL slug
    useEffect(() => {
        async function activateCategoryFilter() {
            if (categorySlug) {
                // Split the parameter by commas to handle multiple categories
                const categorySlugs = categorySlug.split(',').map(slug => slug.trim());

                // Search for all categories that match the slugs
                const { data, error } = await supabase
                    .from("categories")
                    .select("id, parent_id, slug")
                    .in("slug", categorySlugs); // Use 'in' instead of 'eq' for multiple values

                if (data && !error) {
                    const parentCategoryIds: number[] = [];
                    const subcategoryIds: number[] = [];

                    data.forEach(category => {
                        // If it has a parent_id it's a subcategory
                        if (category.parent_id) {
                            subcategoryIds.push(category.id);
                        } else {
                            // If it doesn't have a parent_id it's a parent category
                            parentCategoryIds.push(category.id);
                        }
                    });

                    // Update states with all found categories
                    if (parentCategoryIds.length > 0) {
                        setSelectedCategories(parentCategoryIds);
                    }
                    if (subcategoryIds.length > 0) {
                        setSelectedSubcategories(subcategoryIds);
                    }
                }
            } else {
                // If there is no categorySlug, clear category filters
                setSelectedCategories([]);
                setSelectedSubcategories([]);
            }
        }

        activateCategoryFilter();
    }, [categorySlug]);

    useEffect(() => {
        async function fetchCategories() {
            const { data, error } = await supabase
                .from("categories")
                .select("id, name")
                .is("parent_id", null)
                .order("name")

            if (!error && data) {
                setCategories(data)
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        async function fetchSubcategories() {
            const { data, error } = await supabase
                .from("categories")
                .select("id, name, parent_id")
                .not("parent_id", "is", null) // Only subcategories
                .order("name")

            if (!error && data) {
                setSubcategories(data)
            }
        }

        fetchSubcategories()
    }, [])

    useEffect(() => {
        async function fetchFilteredArticles() {
            let query = supabase
                .from("articles")
                .select(`
                *,
                author:authors (
                    name,
                    avatar_url
                ),
                article_tags (
                    tag:tags ( id, name )
                ),
                category:categories (
                    id,
                    name
                )
            `)
                .order("created_at", { ascending: false })

            query = query.eq("status", "published");
            // Filter by categories (assumes you have category_id in the articles table)
            const allSelectedCategories = [...selectedCategories, ...selectedSubcategories]
            if (allSelectedCategories.length > 0) {
                query = query.in("category_id", allSelectedCategories)
            }

            // Filter by dates
            if (startDate)
                query = query.gte("created_at", startDate.toISOString().split("T")[0])

            if (endDate) {
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                query = query.lte("created_at", end.toISOString())
            }

            const { data, error } = await query

            if (!error && data) {
                setLatestArticles(data)
            }
        }

        fetchFilteredArticles()
    }, [selectedCategories, selectedSubcategories, startDate, endDate])

    function handleClearFilters() {
        setSelectedCategories([])
        setSelectedSubcategories([])
        setDateRange([null, null])
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0f0f23]">
            {/* Navbar */}
            <div className="relative">
                <Header />

                {/* Hero Section - Without geometric shapes */}
                <div className="relative w-full bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#ff6b35] blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#8fc9ff] blur-3xl"></div>
                        </div>
                    </div>
                    <motion.div
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: isLoaded ? 1 : 1.1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >

                        <motion.div
                            className="absolute inset-0 bg-black/30"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ duration: 1.2 }}
                        ></motion.div>
                    </motion.div>
                    <div className="relative z-10 py-16 overflow-hidden">
                        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-4xl font-bold text-game-white">
                                        Your Ultimate <span className="text-[#ff6b35]">Gaming</span> Resource
                                    </h1>
                                    <p className="text-gray-300 mt-2">Discover the latest reviews, helpful guides, and tech insights.</p>
                                </div>

                                <motion.div className="flex gap-4" variants={itemVariants}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href="/about">
                                            <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-md transition-all duration-300 border-0">
                                                About Us
                                            </Button>
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href="/contact">
                                            <Button variant="outline"
                                                className="bg-transparent border border-gray-600 hover:border-white text-white px-6 py-3 rounded-md transition-all transform hover:scale-105">
                                                Contact Us
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </motion.div>

                                <motion.div className="flex gap-8 pt-4" variants={itemVariants}>
                                    {statsLoading ? (
                                        [...Array(3)].map((_, index) => (
                                            <div key={index} className="text-center">
                                                <div className="animate-pulse">
                                                    <div className="h-6 w-12 bg-gray-700 rounded mb-1"></div>
                                                    <div className="h-4 w-16 bg-gray-600 rounded"></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : statsError ? (
                                        <div className="text-red-500 text-sm">
                                            Error loading stats
                                        </div>
                                    ) : (
                                        heroStats.map((stat) => (
                                            <motion.div
                                                key={stat.id}
                                                className="text-center"
                                                whileHover={{ y: -5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <p className="text-2xl font-bold">{stat.value}</p>
                                                <p className="text-sm text-gray-400">{stat.label}</p>
                                            </motion.div>
                                        ))
                                    )}
                                </motion.div>
                            </div>

                            <div className="hidden md:flex justify-center items-center">
                                <motion.div
                                    animate={floatAnimation}
                                    className="relative"
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.5 }}
                                            className="relative"
                                        >
                                            <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                                                <Image
                                                    src="/images/game-controller-logo.png"
                                                    alt="Game Controller Logo"
                                                    width={350}
                                                    height={350}
                                                    className="object-contain z-10 relative"
                                                    priority
                                                />
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-blue-500/30 blur-2xl -z-10"></div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0a0a14] to-transparent"></div>
                    </div>

                </div>
            </div>
            <div className="bg-[#0a0a14] pt-6">
                <div className="max-w-7xl mx-auto px-6">
                    <MobileFilters
                        categories={categories}
                        subcategories={subcategories}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        selectedSubcategories={selectedSubcategories}
                        setSelectedSubcategories={setSelectedSubcategories}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        onClearFilters={handleClearFilters}
                    />
                </div>
            </div>
            {/* Latest Articles & Categories Section */}
            <section className="bg-[#0a0a14] py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Latest Articles - 3 columns */}
                        <div className="col-span-1 lg:col-span-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {latestArticles.map((article) => (
                                    <article key={article.id} className="bg-[#0f0f23] border-none overflow-hidden rounded-lg cursor-pointer hover:bg-[#1a1a2e] transition-all duration-300 transform hover:scale-[1.02]"
                                        onClick={() => window.location.href = `/blog/${article.slug}`}>
                                        <div className="aspect-video relative">
                                            <Image
                                                src={article.featured_image || "/placeholder.svg?height=200&width=300"}
                                                alt={`Thumbnail for article: ${article.title}`}
                                                fill
                                                className="object-cover"
                                            />
                                            {article.category?.name && (
                                                <div className="absolute top-2 left-2 bg-[#FDF2FA] text-[#C11574] text-xs px-3 py-1 rounded-full font-semibold">
                                                    {article.category.name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <time dateTime={article.created_at} className="text-game-cyan text-xs">
                                                {new Date(article.created_at).toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </time>
                                            <h3 className="font-bold text-white">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-gray-400">{article.excerpt}</p>
                                            <div className="flex gap-2 pt-1">
                                                {(article.article_tags || []).map(({ tag }, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`/articles?tag=${tag.name.toLowerCase().replace(/\s+/g, "-")}`}
                                                        className="category-tag hover:bg-game-blue transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {tag.name}
                                                    </a>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-400 pt-1">
                                                By <span className="font-medium">{article.author?.name || "Unknown"}</span>
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar - Categories & Upcoming */}
                        <div className="hidden lg:block lg:col-span-1 space-y-8">
                            {/*Categories */}
                            <div className="bg-[#0f0f23] rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
                                <div className="space-y-3">
                                    {/* CATEGORY FILTER */}
                                    <Disclosure>
                                        {({ open }) => (
                                            <div>
                                                <Disclosure.Button className="flex w-full justify-between items-center text-white font-medium py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white">Category</span>
                                                    </div>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-2">
                                                    {categories.map((category) => (
                                                        <label
                                                            key={category.id}
                                                            className="flex items-center gap-2 text-sm text-white cursor-pointer select-none"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={category.id}
                                                                checked={selectedCategories.includes(category.id)}
                                                                onChange={(e) => {
                                                                    const id = parseInt(e.target.value)

                                                                    if (e.target.checked) {
                                                                        // Add the parent category
                                                                        setSelectedCategories((prev) => [...prev, id])

                                                                        // Find and add all child subcategories
                                                                        const childSubcategories = subcategories
                                                                            .filter(sub => sub.parent_id === id)
                                                                            .map(sub => sub.id)

                                                                        setSelectedSubcategories((prev) => {
                                                                            const newSubcategories = [...prev]
                                                                            childSubcategories.forEach(childId => {
                                                                                if (!newSubcategories.includes(childId)) {
                                                                                    newSubcategories.push(childId)
                                                                                }
                                                                            })
                                                                            return newSubcategories
                                                                        })
                                                                    } else {
                                                                        // Remove the parent category
                                                                        setSelectedCategories((prev) => prev.filter((cid) => cid !== id))

                                                                        // Find and remove all child subcategories
                                                                        const childSubcategories = subcategories
                                                                            .filter(sub => sub.parent_id === id)
                                                                            .map(sub => sub.id)

                                                                        setSelectedSubcategories((prev) =>
                                                                            prev.filter(subId => !childSubcategories.includes(subId))
                                                                        )
                                                                    }
                                                                }}
                                                                className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm bg-[#1a1a1a] checked:bg-[#9d8462] checked:border-[#9d8462] focus:outline-none transition-all duration-150"
                                                            />
                                                            <span className="text-xl">{category.icon}</span>
                                                            {category.name}
                                                        </label>
                                                    ))}
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>

                                    {/* SUBCATEGORY FILTER */}
                                    <Disclosure>
                                        {({ open }) => (
                                            <div>
                                                <Disclosure.Button className="flex w-full justify-between items-center text-white font-medium py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white">Subcategories</span>
                                                    </div>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-2">
                                                    {subcategories.map((subcategory) => (
                                                        <label
                                                            key={subcategory.id}
                                                            className="flex items-center gap-2 text-sm text-white cursor-pointer select-none"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={subcategory.id}
                                                                checked={selectedSubcategories.includes(subcategory.id)}
                                                                onChange={(e) => {
                                                                    const id = parseInt(e.target.value)
                                                                    setSelectedSubcategories((prev) =>
                                                                        e.target.checked ? [...prev, id] : prev.filter((cid) => cid !== id)
                                                                    )
                                                                }}
                                                                className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm bg-[#1a1a1a] checked:bg-[#9d8462] checked:border-[#9d8462] focus:outline-none transition-all duration-150"
                                                            />
                                                            {subcategory.name}
                                                        </label>
                                                    ))}
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>

                                    {/* DATE FILTER */}
                                    <Disclosure>
                                        {({ open }) => (
                                            <div>
                                                <Disclosure.Button className="flex w-full justify-between items-center text-white font-medium py-2">
                                                    <span className="text-white">Date</span>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="mt-2 space-y-3">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-white text-sm">Select Range:</label>
                                                        <DatePicker
                                                            selectsRange
                                                            startDate={startDate}
                                                            endDate={endDate}
                                                            onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                                                            isClearable
                                                            className="bg-[#1a1a1a] border border-gray-600 rounded-md px-3 py-1 text-white w-full"
                                                            dateFormat="yyyy-MM-dd"
                                                            placeholderText="Click to pick date range"
                                                            calendarClassName="bg-[#1a0030] text-white rounded-md shadow-lg border border-gray-700"
                                                            popperClassName="z-50"
                                                            showYearDropdown
                                                            scrollableYearDropdown
                                                            yearDropdownItemNumber={40}
                                                            showMonthDropdown
                                                            scrollableMonthYearDropdown
                                                        />
                                                    </div>
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
                                </div>

                                <Button
                                    onClick={handleClearFilters}
                                    className="w-full mt-4 bg-[#ff6b35] hover:bg-[#8d7452] text-white"
                                >
                                    Clean Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <Footer />
            <HomeJsonLd articles={latestArticles} />
        </div>
    )
}