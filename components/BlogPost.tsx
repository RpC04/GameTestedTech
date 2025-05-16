"use client"

import { marked } from "marked"
import DOMPurify from "dompurify" 

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, Send, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()


// Function to calculate reading time based on word count
const calculateReadingTime = (content: string): string => {
    const wordsPerMinute = 225
    const wordCount = content.trim().split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
}

// Función para formatear fechas
const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return "Unknown date"
    const parsedDate = typeof date === "string" ? new Date(date) : date
    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

// ✅ Configurar renderer para agregar ID a h2
const renderer = new marked.Renderer()
renderer.heading = function (text, level) {
    if (level === 2) {
        const id = text.toLowerCase().replace(/\s+/g, "-")
        return `<h2 id="${id}">${text}</h2>`
    }
    return `<h${level}>${text}</h${level}>`
}
marked.setOptions({ renderer })

// ✅ Convertir markdown a HTML seguro
function convertMarkdownToHTML(markdown: string): string {
    const rawHtml = marked.parse(markdown) // Si usas marked 6+, usa `await marked.parseAsync()`
    return DOMPurify.sanitize(rawHtml)
}

// ✅ Extraer TOC desde el HTML procesado
function extractTableOfContents(html: string): { id: string; title: string }[] {
    const regex = /<h2\s+id="([^"]+)">([^<]+)<\/h2>/g
    const toc: { id: string; title: string }[] = []
    let match
    while ((match = regex.exec(html)) !== null) {
        toc.push({ id: match[1], title: match[2] })
    }
    return toc
}

// Componente para la página de blog
export default function BlogPost({ article }: { article: any }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [liked, setLiked] = useState(false)
    const [viewCount, setViewCount] = useState(0)
    const [activeSection, setActiveSection] = useState("introduction")
    const [localArticle, setLocalArticle] = useState(article)
    const safeHtml = convertMarkdownToHTML(article.content || "")
    const tableOfContents = extractTableOfContents(safeHtml)


    const post = {
        ...article,
        likes: article.likes ?? 0,
        views: article.views ?? 0,
        shares: article.shares ?? 0,
        comments: article.comments ?? 0,
        publishedAt: article.created_at,
        tableOfContents: extractTableOfContents(article.content || ""),
        readingTime: calculateReadingTime(article.content?.replace(/<[^>]*>/g, "") || "")
    }

    // Efecto para simular carga e incrementar visualizaciones
    useEffect(() => {
        setIsLoaded(true)

        const likedKey = `liked-article-${article.id}`
        if (localStorage.getItem(likedKey)) {
            setLiked(true)
        }

        setViewCount(article.views || 0)

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }, { threshold: 0.5 })

        document.querySelectorAll("h2[id]").forEach((section) => observer.observe(section))

        return () => observer.disconnect()
    }, [article.id, article.views])

    const handleLike = async () => {
        const likedKey = `liked-article-${article.id}`
        const alreadyLiked = !!localStorage.getItem(likedKey)

        const newLikes = alreadyLiked
            ? Math.max(0, localArticle.likes - 1)
            : localArticle.likes + 1

        const { error } = await supabase
            .from("articles")
            .update({ likes: newLikes })
            .eq("id", article.id)

        if (error) {
            console.error("Failed to update likes:", error.message || error)
            return
        }

        setLiked(!alreadyLiked)
        setLocalArticle((prev) => ({ ...prev, likes: newLikes }))

        if (alreadyLiked) {
            localStorage.removeItem(likedKey)
        } else {
            localStorage.setItem(likedKey, "true")
        }
    }

    // Variantes de animación
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
    }

    return (
        <div className="min-h-screen bg-[#0a0a14] text-gray-200">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header con imagen de fondo y título centrado */}
                <div className="relative w-full h-[50vh] mb-12">
                    <div className="absolute inset-0">
                        <Image
                            src={post.featuredImage || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a14]"></div>
                    </div>

                    <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{post.title}</h1>
                            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">{post.excerpt}</p>

                            <div className="flex items-center justify-center gap-8">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={post.author.avatar || "/placeholder.svg"}
                                        alt={post.author.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium text-white">{post.author.name}</p>
                                        <p className="text-sm text-gray-300">{formatDate(post.publishedAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-300" />
                                    <span className="text-gray-300">{post.readingTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal en dos columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Columna de contenido principal */}
                    <motion.div
                        className="lg:col-span-8"
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        variants={fadeIn}
                    >
                        {/* Estadísticas del artículo */}
                        <div className="flex justify-between mb-8">
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-full ${liked ? "bg-[#ff6b35]/20 text-[#ff6b35]" : "bg-[#1a1a2e] text-gray-400"} transition-colors`}
                                onClick={handleLike}
                            >
                                <Heart className={`h-5 w-5 ${liked ? "fill-[#ff6b35]" : ""}`} />
                                <span>{localArticle.likes}</span>
                            </button>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a2e] text-gray-400">
                                <Eye className="h-5 w-5" />
                                <span>{viewCount}</span>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a2e] text-gray-400">
                                <Send className="h-5 w-5" />
                                <span>{post.shares}</span>
                            </div>
                        </div>

                        <article className="prose prose-lg prose-invert max-w-none whitespace-pre-line">
                            <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
                        </article>

                        {/* Tags */}
                        <div className="mt-12 mb-8">
                            <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/articles?tag=${tag.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="bg-[#1a1a2e] text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-[#2a2a4e] transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Barra lateral */}
                    <motion.div
                        className="lg:col-span-4"
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        variants={fadeIn}
                    >
                        <div className="sticky top-24 space-y-8">
                            {/* Metadatos del artículo */}
                            <div className="grid grid-cols-2 gap-6 mb-8 bg-[#1a1a2e] rounded-lg p-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Publication Date</p>
                                    <p className="text-white">{formatDate(post.publishedAt)}</p>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Category</p>
                                    <p className="text-white">{post.categories.join(", ")}</p>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Reading Time</p>
                                    <p className="text-white">{post.readingTime}</p>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Author</p>
                                    <p className="text-white">{post.author.name}</p>
                                </div>
                            </div>

                            {/* Tabla de contenidos */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-4">Table of Contents</h3>
                                <div className="bg-[#1a1a2e] rounded-lg p-6">
                                    <ul className="space-y-3">
                                        {tableOfContents.map((item) => (
                                            <li key={item.id}>
                                                <a href={`#${item.id}`} className="text-gray-300 hover:text-white">
                                                    {item.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Autor */}
                            <div className="bg-[#1a1a2e] rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-4">About the Author</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <Image
                                        src={post.author.avatar || "/placeholder.svg"}
                                        alt={post.author.name}
                                        width={64}
                                        height={64}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="font-bold text-white">{post.author.name}</p>
                                        <div className="flex gap-4 text-sm text-gray-400 mt-1">
                                            <span>{post.author.articles} Articles</span>
                                            <span>{post.author.followers.toLocaleString()} Followers</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm">{post.author.bio}</p>
                                <button className="mt-4 w-full bg-[#9d8462] hover:bg-[#9d8462] text-white py-2 rounded-md transition-colors">
                                    Follow Author
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sección de comentarios */}
                <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-800">
                    <h3 className="text-2xl font-bold text-white mb-6">Comments ({post.comments})</h3>

                    {/* Formulario de comentarios */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 mb-8">
                        <h4 className="text-lg font-medium text-white mb-4">Leave a Comment</h4>
                        <textarea
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md p-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-[#ff6b35] min-h-[120px]"
                            placeholder="Share your thoughts..."
                        ></textarea>
                        <div className="mt-3 flex justify-end">
                            <button className="bg-[#9d8462] hover:bg-[#9d8462] text-white px-4 py-2 rounded-md transition-colors">
                                Post Comment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Articles relacionados */}
                <div className="mt-16 mb-16">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">Related Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#1a1a2e] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                <div className="relative aspect-video">
                                    <Image
                                        src={`/placeholder.svg?height=300&width=500&text=Related Article ${i}`}
                                        alt={`Related Article ${i}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">
                                        {i === 1
                                            ? "The Impact of Machine Learning on Game Development"
                                            : i === 2
                                                ? "Ethical Considerations in AI-Driven Gaming"
                                                : "The Future of Procedural Generation in Open World Games"}
                                    </h4>
                                    <p className="text-gray-300 text-sm line-clamp-3">
                                        {i === 1
                                            ? "Exploring how machine learning algorithms are changing the way games are developed and played."
                                            : i === 2
                                                ? "A deep dive into the ethical implications of using AI to create and manage gaming experiences."
                                                : "How procedural generation is evolving to create more immersive and dynamic open world environments."}
                                    </p>
                                    <div className="mt-4">
                                        <Link href={`/blog/article-${i}`} className="text-[#9d8462] hover:text-[#ff6b35] transition-colors">
                                            Read More →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-game-dark py-8 mt-auto border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <Image
                                    src="/images/logo.png"
                                    alt="Game Tested Tech Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                                <span className="text-game-white text-sm font-bold">
                                    GAME
                                    <br />
                                    TESTED TECH
                                </span>
                            </Link>
                            <p className="text-gray-400 text-sm">
                                Your trusted source for honest gaming hardware reviews, guides, and tech insights.
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-4">
                            <h3 className="text-white font-bold mb-4">Quick Links</h3>
                            <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link href="/articles" className="block text-gray-400 hover:text-white transition-colors">
                                Articles
                            </Link>
                            <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                                About Us
                            </Link>
                            <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                                Contact
                            </Link>
                            <Link href="/legal/privacy" className="block text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-4">
                            <h3 className="text-white font-bold mb-4">Follow Us</h3>
                            <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                                Youtube
                            </a>
                            <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                                Instagram
                            </a>
                            <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                                Twitter
                            </a>
                            <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                                Discord
                            </a>
                            <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                                Facebook
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} Game Tested Tech. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}