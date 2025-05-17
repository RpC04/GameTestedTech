"use client"

import Image from "next/image"
import Link from "next/link"
import { Search, Youtube, Instagram, Twitter, DiscIcon as Discord, Facebook, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HomeJsonLd } from "@/components/home-jsonld"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function Articles() {
    // Sample latest articles data
    const [latestArticles, setLatestArticles] = useState<any[]>([])
    const [featuredGames, setFeaturedGames] = useState<any[]>([])
    const [categories, setCategories] = useState<{ id: number; name: string; icon?: string }[]>([])

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
        async function fetchFeaturedGames() {
            const { data, error } = await supabase
                .from("articles")
                .select(`
        *,
        article_tags (
          tag:tags (
            id,
            name,
            is_featured
          )
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
        async function fetchArticles() {
            const { data, error } = await supabase
                .from("articles") // Fetch articles from the "articles" table
                .select(`
                    *,
                    author:authors (
                      name,
                      avatar_url
                    ), article_tags (
                    tag:tags ( id, name )
                    )
                  `)
                .order("created_at", { ascending: false }) // Fetch latest articles
                .limit(6)

            if (!error && data) {
                setLatestArticles(data)
            }
        }

        fetchArticles()
    }, [])

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header completo con imagen de fondo */}
            <div className="relative">
                {/* Imagen de fondo para todo el header */}
                <div className="absolute inset-0 w-full h-full">
                    <img src="/images/cyberpunk-bg.png" alt="Cyberpunk background" className="w-full h-full object-cover" />
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

                            <div className="relative flex-1 max-w-xl mx-8">
                                <input
                                    type="text"
                                    className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-full py-2 px-4 pr-10 text-white"
                                    placeholder="Buscar..."
                                />
                                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>

                            <nav className="hidden md:flex items-center gap-6">
                                <Link href="/" className="text-game-white hover:text-game-cyan transition">
                                    Home
                                </Link>
                                <Link href="/articles" className="text-game-white hover:text-game-cyan transition">
                                    Articles
                                </Link>
                                <Link href="/about" className="text-game-white hover:text-game-cyan transition">
                                    About
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
                                <Link href="/articles">
                                    <Button className="bg-[#9d8462] hover:bg-[#8d7452] text-white rounded-md">Explore Now</Button>
                                </Link>
                                <Link href="/contact">
                                    <Button
                                        variant="outline"
                                        className="bg-transparent hover:bg-[#1a1a2e] border-2 border-[#9d8462] text-white rounded-md"
                                    >
                                        Contact Us
                                    </Button>
                                </Link>
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
                            <Image
                                src="/placeholder.svg?height=400&width=400"
                                alt="Gaming concept"
                                width={400}
                                height={400}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* El resto del contenido permanece igual */}
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
                                    <div className="absolute top-2 left-2 bg-game-tag-blue text-white text-xs px-3 py-1 rounded-full">
                                        {(game.tags && game.tags[0]) || "Game"}
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
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
                                <Link
                                    href="/articles"
                                    className="text-game-cyan hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    View all <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

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
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                                            className="flex items-center justify-between p-2 hover:bg-[#2a0045] rounded-md transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{category.icon}</span>
                                                <span className="text-white">{category.name}</span>
                                            </div>
                                        </Link>
                                    ))}

                                </div>
                                <Button className="w-full mt-4 bg-[#9d8462] hover:bg-[#8d7452] text-white">All Categories</Button>
                            </div>

                            {/* Upcoming Games 
                            <div className="bg-[#1f0032] rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Upcoming Games</h3>
                                <div className="space-y-4">
                                    {upcomingGames.map((game, index) => (
                                        <div key={index} className="flex gap-3">
                                            <Image
                                                src={game.image || "/placeholder.svg"}
                                                alt={game.title}
                                                width={50}
                                                height={50}
                                                className="rounded-md object-cover"
                                            />
                                            <div>
                                                <h4 className="text-white font-medium">{game.title}</h4>
                                                <p className="text-game-cyan text-xs">{game.releaseDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
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
            </section>

            {/* Community Stats Section */}
            <section className="bg-game-dark py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-6">
                            <p className="text-3xl md:text-4xl font-bold text-game-cyan">1.2M+</p>
                            <p className="text-gray-400 mt-2">Community Members</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl md:text-4xl font-bold text-game-cyan">10K+</p>
                            <p className="text-gray-400 mt-2">Game Reviews</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl md:text-4xl font-bold text-game-cyan">5K+</p>
                            <p className="text-gray-400 mt-2">Gaming Guides</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl md:text-4xl font-bold text-game-cyan">24/7</p>
                            <p className="text-gray-400 mt-2">Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-game-dark py-8 mt-auto border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">✉</span>
                                <a href="mailto:contact@gametestedtech.com" className="text-gray-400 hover:text-white">
                                    contact@gametestedtech.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">✉</span>
                                <a href="mailto:marketing@gametestedtech.com" className="text-gray-400 hover:text-white">
                                    marketing@gametestedtech.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">✉</span>
                                <a href="mailto:partnerships@gametestedtech.com" className="text-gray-400 hover:text-white">
                                    partnerships@gametestedtech.com
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
                            <Link href="/" className="block text-gray-400 hover:text-white">
                                Inicio
                            </Link>
                            <Link href="/articles" className="block text-gray-400 hover:text-white">
                                Artículos
                            </Link>
                            <Link href="/about" className="block text-gray-400 hover:text-white">
                                About
                            </Link>
                            <Link href="/contact" className="block text-gray-400 hover:text-white">
                                Contact
                            </Link>
                            <Link href="/legal" className="block text-gray-400 hover:text-white">
                                Legal Notice
                            </Link>
                            <Link href="/legal/privacy" className="block text-gray-400 hover:text-white">
                                Privacy Policy
                            </Link>
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-4">
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
                </div>
            </footer>
            <HomeJsonLd articles={latestArticles} />
        </div>
    )
}