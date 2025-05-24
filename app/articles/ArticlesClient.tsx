"use client"

import Image from "next/image"
import Link from "next/link"
import DatePicker from "react-datepicker"
import { Search, Youtube, Instagram, Twitter, DiscIcon as Discord, Facebook, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HomeJsonLd } from "@/components/home-jsonld"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Disclosure } from "@headlessui/react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Articles() {
    // Sample latest articles data
    const [latestArticles, setLatestArticles] = useState<any[]>([])
    const [featuredGames, setFeaturedGames] = useState<any[]>([])
    const [categories, setCategories] = useState<{ id: number; name: string; icon?: string }[]>([])
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [startDate, endDate] = dateRange
    const [tags, setTags] = useState<{ id: number; name: string }[]>([])
    const [selectedTags, setSelectedTags] = useState<number[]>([])

    const dotPositions = [
        { top: "11.028856%", left: "27.500000%" },
        { top: "50.000000%", left: "5.000000%" },
        { top: "88.971144%", left: "27.500000%" },
        { top: "88.971144%", left: "72.500000%" },
        { top: "50.000000%", left: "95.000000%" },
        { top: "11.028856%", left: "72.500000%" },
    ];

    useEffect(() => {
        async function fetchCategories() {
            const { data, error } = await supabase
                .from("categories")
                .select("id, name, icon")
                .order("name")

            if (!error && data) {
                setCategories(data)
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        async function fetchTags() {
            const { data, error } = await supabase
                .from("tags")
                .select("id, name")
                .order("name")

            if (!error && data) {
                setTags(data)
            }
        }

        fetchTags()
    }, [])

    useEffect(() => {
        async function fetchFeaturedGames() {
            const { data, error } = await supabase
                .from("articles")
                .select(`
                    *,
                    category:categories ( id, name ),
                    article_tags (
                        tag:tags ( id, name, is_featured )
                    )
                `)
                .order("created_at", { ascending: false })

            if (!error && data) {
                // Filtra los artículos que tienen al menos un tag destacado
                const filtered = data.filter((article) =>
                    (article.article_tags || []).some(({ tag }) => tag?.is_featured)
                )

                setFeaturedGames(filtered.slice(0, 3)) // Muestra máximo 3 destacados
            }
        }

        fetchFeaturedGames()
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

            // Filtro por categorías (asume que tienes category_id en la tabla articles)
            if (selectedCategories.length > 0) {
                query = query.in("category_id", selectedCategories)
            }

            // Filtro por fechas
            if (startDate)
                query = query.gte("created_at", startDate.toISOString().split("T")[0])

            if (endDate) {
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                query = query.lte("created_at", end.toISOString())
            }

            const { data, error } = await query

            if (!error && data) {
                // Filtro manual por tags (relación muchos a muchos)
                const filteredByTags =
                    selectedTags.length > 0
                        ? data.filter((article) =>
                            (article.article_tags || []).some(({ tag }) => selectedTags.includes(tag.id))
                        )
                        : data
                setLatestArticles(filteredByTags)
            }
        }

        fetchFilteredArticles()
    }, [selectedCategories, selectedTags, startDate, endDate])

    function handleClearFilters() {
        setSelectedCategories([])
        setSelectedTags([])
        setDateRange([null, null])
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    }


    return (
        <div className="min-h-screen flex flex-col">
            {/* Complete header with background image */}
            <div className="relative">
                {/* Imagen de fondo para todo el header */}
                <div className="absolute inset-0 w-full h-full">
                    <img src="/images/articlepage-background.png" alt="Article background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Navbar */}
                <div className="relative z-10 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto py-4 px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <Link href="/" className="flex items-center gap-2">
                                    <Image
                                        src="/images/logo.png"
                                        alt="Game Tested Tech Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                    <span className="text-game-white text-sm font-bold hidden sm:inline">
                                        GAME
                                        <br />
                                        TESTED TECH
                                    </span>
                                </Link>
                            </div>
                            {/*
                            <div className="relative flex-1 max-w-xl mx-8">
                                <input
                                    type="text"
                                    className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-full py-2 px-4 pr-10 text-white"
                                    placeholder="Search..."
                                />
                                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
*/}
                            <nav className="hidden md:flex items-center gap-6">
                                <Link href="/" className="text-game-white hover:text-game-cyan transition">
                                    Home
                                </Link>
                                <Link href="/articles" className="text-game-white hover:text-game-cyan transition">
                                    Articles
                                </Link>
                                <Link href="/about" className="text-game-white hover:text-game-cyan transition">
                                    About Us
                                </Link>
                                <Link href="/contact" className="text-game-white hover:text-game-cyan transition">
                                    Contact
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Hero Section - Sin formas geométricas */}
                <div className="relative z-10 py-16 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-game-white">
                                    Your Ultimate <span className="text-game-pink">Gaming</span> Resource
                                </h1>
                                <p className="text-gray-300 mt-2">Discover the latest games, reviews, and gaming tech insights.</p>
                            </div>

                            <div className="flex gap-4">
                                <motion.div className="flex gap-4" variants={itemVariants}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href="/about">
                                            <Button className="bg-[#9d8462] hover:bg-[#9d8462] text-white rounded-md transition-all duration-300 border-0">
                                                About Us
                                            </Button>
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href="/contact">
                                            <Button variant="outline"
                                                className="bg-transparent hover:bg-transparent border-2 border-[#9d8462] hover:border-[#9d8462]
                                                text-white hover:text-white rounded-md transition-all duration-300">
                                                Contact Us
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>

                            <div className="flex gap-8 pt-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">666K</p>
                                    <p className="text-sm text-gray-400">Users</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">6666K</p>
                                    <p className="text-sm text-gray-400">Articles</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">666K</p>
                                    <p className="text-sm text-gray-400">Games</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden md:block">
                            <motion.div
                                className="relative hidden md:block"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.5 }}>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                    >
                                        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                                            <Image
                                                src="/images/game-controller-logo.png"
                                                alt="Game Controller Logo"
                                                width={350}
                                                height={350}
                                                className="object-contain z-10 relative"
                                            />
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-game-cyan/20 blur-xl"
                                                animate={{
                                                    scale: [1, 1.05, 1],
                                                    opacity: [0.5, 0.3, 0.5],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatType: "reverse",
                                                }}
                                            />
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-game-pink/20 blur-xl"
                                                animate={{
                                                    scale: [1.05, 1, 1.05],
                                                    opacity: [0.3, 0.5, 0.3],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatType: "reverse",
                                                }}
                                            />
                                        </div>
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
                                            animate={{
                                                rotate: 360,
                                                scale: [1, 1.02, 1],
                                            }}
                                            transition={{
                                                rotate: {
                                                    duration: 20,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: "linear",
                                                },
                                                scale: {
                                                    duration: 3,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatType: "reverse",
                                                },
                                            }}
                                        >
                                            {dotPositions.map((pos, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-2 h-2 rounded-full bg-game-cyan"
                                                    style={{ top: pos.top, left: pos.left }}
                                                    animate={{
                                                        opacity: [0.2, 1, 0.2],
                                                        scale: [0.8, 1.2, 0.8],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Number.POSITIVE_INFINITY,
                                                        delay: i * 0.3,
                                                    }}
                                                />
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Games Section */}
            <section className="bg-game-purple py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Featured</h2>
                        <Link href="/games" className="text-game-cyan hover:text-white flex items-center gap-1 transition-colors">
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredGames.map((game, index) => (
                            <Card key={game.id} className="bg-[#1f0032] border-none overflow-hidden">
                                <div className="aspect-video relative">
                                    <Image
                                        src={game.featured_image || "/placeholder.svg"}
                                        alt={`Thumbnail for article: ${game.title}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                                        {(game.article_tags?.[0]?.tag?.is_featured) && (
                                            <div className="bg-game-tag-blue text-white text-xs px-3 py-1 rounded-full">
                                                {game.article_tags[0].tag.name}
                                            </div>
                                        )}
                                        {game.category?.name && (
                                            <div className="bg-[#FDF2FA] text-[#C11574] text-xs px-3 py-1 rounded-full font-semibold">
                                                {game.category.name}
                                            </div>
                                        )}
                                    </div>
                                    {/*<div className="absolute top-2 right-2 bg-[#9d8462] text-white text-xs px-3 py-1 rounded-full flex items-center">
                                        ★ {game.rating || "4.5"}
                                    </div>*/}
                                </div>
                                <div className="p-4 space-y-2">
                                    <h3 className="font-bold text-white text-lg">{game.title}</h3>
                                    <p className="text-sm text-gray-400">{game.excerpt}</p>
                                    <Link href={`/blog/${game.slug}`}>
                                        <Button className="w-full bg-[#9d8462] hover:bg-[#8d7452] text-white mt-2">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Articles & Categories Section */}
            <section className="bg-game-dark py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Latest Articles - 3 columns */}
                        <div className="lg:col-span-3">

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {latestArticles.map((article, index) => (
                                    <article key={article.id} className="bg-[#1f0032] border-none overflow-hidden rounded-lg">
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
                                                <a
                                                    href={`/blog/${article.slug}`}
                                                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-game-cyan rounded"
                                                >
                                                    {article.title}
                                                </a>
                                            </h3>
                                            <p className="text-sm text-gray-400">{article.excerpt}</p>
                                            <div className="flex gap-2 pt-1">
                                                {(article.article_tags || []).map(({ tag }, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`/articles?tag=${tag.name.toLowerCase().replace(/\s+/g, "-")}`}
                                                        className="category-tag hover:bg-game-blue transition-colors"
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
                        <div className="lg:col-span-1 space-y-8">
                            {/*Categories */}
                            <div className="bg-[#1f0032] rounded-lg p-6">
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
                                                                    setSelectedCategories((prev) =>
                                                                        e.target.checked ? [...prev, id] : prev.filter((cid) => cid !== id)
                                                                    )
                                                                }}
                                                                className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm bg-[#1a1a1a] checked:bg-[#9d8462] checked:border-[#9d8462] focus:outline-none transition-all duration-150"
                                                            />
                                                            {category.name}
                                                        </label>
                                                    ))}
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>

                                    {/* TAG FILTER */}
                                    <Disclosure>
                                        {({ open }) => (
                                            <div>
                                                <Disclosure.Button className="flex w-full justify-between items-center text-white font-medium py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white">Tags</span>
                                                    </div>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-2">
                                                    {tags.map((tag) => (
                                                        <label
                                                            key={tag.id}
                                                            className="flex items-center gap-2 text-sm text-white cursor-pointer select-none"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={tag.id}
                                                                checked={selectedTags.includes(tag.id)}
                                                                onChange={(e) => {
                                                                    const id = parseInt(e.target.value)
                                                                    setSelectedTags((prev) =>
                                                                        e.target.checked ? [...prev, id] : prev.filter((tid) => tid !== id)
                                                                    )
                                                                }}
                                                                className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm bg-[#1a1a1a] checked:bg-[#9d8462] checked:border-[#9d8462] focus:outline-none transition-all duration-150"
                                                            />
                                                            {tag.name}
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
                                    className="w-full mt-4 bg-[#9d8462] hover:bg-[#8d7452] text-white"
                                >
                                    Clean Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section 
            <section className="bg-game-purple py-12">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated with Gaming News</h2>
                    <p className="text-gray-400 mb-6">
                        Subscribe to our newsletter and never miss the latest gaming news, reviews, and tech insights.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-md py-2 px-4 text-white"
                        />
                        <Button className="bg-[#9d8462] hover:bg-[#8d7452] text-white">Subscribe</Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                    </p>
                </div>
            </section>*/}

            {/* Footer */}
            <footer className="bg-game-dark py-8 mt-auto border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div>
                                <Link href="/" className="flex items-center gap-2 mb-4">
                                    <Image
                                        src="/images/logo.png"
                                        alt="Game Tested Tech Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                    <span className="text-game-white text-sm font-bold">
                                        GAME<br />TESTED TECH
                                    </span>
                                </Link>
                                <p className="text-gray-400 text-sm">
                                    Your trusted source for honest gaming hardware reviews, guides, and tech insights.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <span className="text-gray-400">✉</span>
                                <a href="mailto:contact@gametestedtech.com" className="text-gray-400 hover:text-white">
                                    contact@gametestedtech.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">📞</span>
                                <a href="tel:+11223456789" className="text-gray-400 hover:text-white">
                                    +1-1223-456-7890
                                </a>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-4">
                            <div className="text-white font-bold mb-4">Quick Links</div>
                            <Link href="/" className="block text-gray-400 hover:text-white">
                                Home
                            </Link>
                            <Link href="/articles" className="block text-gray-400 hover:text-white">
                                Articles
                            </Link>
                            <Link href="/about" className="block text-gray-400 hover:text-white">
                                About Us
                            </Link>
                            <Link href="/contact" className="block text-gray-400 hover:text-white">
                                Contact
                            </Link>
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-4">
                            <div className="text-white font-bold mb-4">Follow Us</div>
                            <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white">
                                <Youtube className="h-5 w-5" />
                                <span>Youtube</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white">
                                <Instagram className="h-5 w-5" />
                                <span>Instagram</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white">
                                <Twitter className="h-5 w-5" />
                                <span>Twitter</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white">
                                <Discord className="h-5 w-5" />
                                <span>Discord</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white">
                                <Facebook className="h-5 w-5" />
                                <span>Facebook</span>
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
                        <p>
                            © {new Date().getFullYear()} Game Tested Tech. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            <HomeJsonLd articles={latestArticles} />
        </div>
    )
}