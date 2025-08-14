"use client"

import { marked } from "marked"
import DOMPurify from "isomorphic-dompurify"
import * as cheerio from "cheerio";
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAnalytics } from '@/hooks/use-analytics'
import MobileTOC from "@/components/blog/mobile-toc"
import Footer from "../footer";

marked.setOptions({
    mangle: false,
    headerIds: false,
    headerPrefix: ''
})

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

// Configurar renderer para agregar ID a h2
const renderer = new marked.Renderer()
renderer.heading = function (text, level) {
    if (level === 1 || level === 2) {  // h1 y h2
        const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
        return `<h${level} id="${id}">${text}</h${level}>`
    }
    return `<h${level}>${text}</h${level}>`
}
marked.setOptions({ renderer })

function processHtmlAndExtractTOC(html: string): {
    htmlWithIds: string,
    toc: { id: string, title: string, children?: { id: string, title: string }[] }[]
} {
    const $ = cheerio.load(html);
    const toc: { id: string, title: string, children?: { id: string, title: string }[] }[] = [];
    let currentH1: { id: string, title: string, children: { id: string, title: string }[] } | null = null;

    $("h1, h2").each((idx, el) => {
        const text = $(el).text();
        const element = $(el);
        const tagName = element?.[0]?.tagName?.toLowerCase() || '';
        let id = $(el).attr("id");

        if (!id) {
            id = text
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "") + "-" + idx;
            $(el).attr("id", id);
        }

        if (tagName === "h1") {
            // Guardar el h1 anterior si existe
            if (currentH1) {
                toc.push(currentH1);
            }
            // Crear nuevo h1
            currentH1 = { id, title: text, children: [] };
        } else if (tagName === "h2") {
            // Si hay un h1 actual, agregar el h2 como hijo
            if (currentH1) {
                currentH1.children.push({ id, title: text });
            } else {
                // Si no hay h1, crear uno temporal o agregar directamente
                toc.push({ id, title: text });
            }
        }
    });

    // No olvides agregar el último h1
    if (currentH1) {
        toc.push(currentH1);
    }

    return { htmlWithIds: $.html(), toc };
}

// Convertir markdown a HTML seguro
function convertMarkdownToHTML(markdown: string): string {
    const rawHtml = marked.parse(markdown) // Si usas marked 6+, usa `await marked.parseAsync()`
    return DOMPurify.sanitize(rawHtml)
}

// Extraer TOC desde el HTML procesado
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
export default function BlogPost({ article, relatedArticles = [] }: { article: any, relatedArticles?: any[] }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [liked, setLiked] = useState(false)
    const [viewCount, setViewCount] = useState(0)
    const [activeSection, setActiveSection] = useState("introduction")
    const [localArticle, setLocalArticle] = useState(article)
    const safeHtml = convertMarkdownToHTML(article.content || "")
    const { htmlWithIds, toc: tableOfContents } = processHtmlAndExtractTOC(safeHtml);
    const { trackEvent, trackConversion } = useAnalytics()
    const [readingStartTime, setReadingStartTime] = useState<number>(0)

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

    useEffect(() => {
        // SOLO aquí puedes usar document
        document.querySelectorAll("article h2").forEach((h2, idx) => {
            const text = h2.textContent || "";
            if (!h2.id) {
                h2.id = text
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "") + "-" + idx;
            }
        });
    }, [safeHtml]);

    const [authorArticlesCount, setAuthorArticlesCount] = useState(0);

    useEffect(() => {
        const fetchAuthorArticles = async () => {
            if (!post?.author?.id) {
                setAuthorArticlesCount(0);
                return;
            }

            const { count, error } = await supabase
                .from('articles')
                .select('id', { count: 'exact', head: true })
                .eq('author_id', post.author.id);

            setAuthorArticlesCount(error ? 0 : (count ?? 0));
        };

        fetchAuthorArticles();
    }, [post.author.id]);// Sin dependencia, se ejecuta una vez al montar

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

    useEffect(() => {
        // Evita sumar más de una vista por sesión
        const viewedKey = `viewed-article-${article.id}`;
        if (!localStorage.getItem(viewedKey)) {
            supabase
                .from("articles")
                .update({ views: (article.views ?? 0) + 1 })
                .eq("id", article.id)
                .then(() => {
                    localStorage.setItem(viewedKey, "true");
                });
        }
    }, [article.id]);

    {/* Google Analytics */ }
    // Analytics tracking cuando se monta el componente
    useEffect(() => {
        // Usar useLayoutEffect o setTimeout para evitar el conflicto de rendering
        const initAnalytics = () => {
            setReadingStartTime(Date.now())

            // Trackear visualización del artículo
            trackEvent('article_view', 'content', article.title)
        }

        // Diferir la inicialización para evitar el error
        const timeoutId = setTimeout(initAnalytics, 0)

        // Trackear scroll profundo (75% del artículo)
        const handleScroll = () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

            if (scrolled > 75) {
                trackEvent('deep_scroll', 'engagement', article.title, Math.round(scrolled))
                window.removeEventListener('scroll', handleScroll)
            }
        }

        window.addEventListener('scroll', handleScroll)

        // Timer para artículo "leído" (30 segundos)
        const readTimer = setTimeout(() => {
            trackConversion('article_read_30s', {
                article_title: article.title,
                article_category: article.categories?.[0] || 'uncategorized',
                article_id: article.id
            })
        }, 30000)

        // Timer para artículo "completado" (2 minutos)
        const completeTimer = setTimeout(() => {
            const timeSpent = Math.round((Date.now() - readingStartTime) / 1000) || 120
            trackConversion('article_completed', {
                article_title: article.title,
                article_category: article.categories?.[0] || 'uncategorized',
                reading_time_seconds: timeSpent
            })
        }, 120000)

        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(readTimer)
            clearTimeout(completeTimer)
        }
    }, []) // Sin dependencias para evitar re-ejecuciones

    // Trackear abandono de página en un useEffect separado
    useEffect(() => {
        if (readingStartTime === 0) return // No hacer nada si no se ha iniciado

        const handleBeforeUnload = () => {
            const timeSpent = Math.round((Date.now() - readingStartTime) / 1000)
            trackEvent('article_exit', 'engagement', article.title, timeSpent)
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [readingStartTime]) // Solo depende de readingStartTime

    // Función para trackear clicks en artículos relacionados
    const handleRelatedArticleClick = (relatedArticleTitle: string) => {
        trackEvent('related_article_click', 'navigation', relatedArticleTitle)
    }

    // Función para trackear compartir
    const handleShareClick = (platform: string) => {
        trackEvent('share_click', 'social', `${article.title} - ${platform}`)
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
                                    {/* Contenedor de la imagen */}
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        {/* Imagen de fondo con blur */}
                                        <div className="absolute inset-0 rounded-full overflow-hidden">
                                            <Image
                                                src={post.author.avatar || "/placeholder.svg"}
                                                alt=""
                                                fill
                                                className="object-cover blur-xl scale-110"
                                            />
                                        </div>
                                        {/* Imagen principal */}
                                        <div className="relative w-full h-full rounded-full overflow-hidden">
                                            <Image
                                                src={post.author.avatar || "/placeholder.svg"}
                                                alt={post.author.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    {/* Texto del autor */}
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

                <div className="mb-8">
                    <MobileTOC
                        tableOfContents={tableOfContents}
                        postId={post.id.toString()}
                        onItemClick={(title, postId) => {
                            trackEvent('mobile_toc_click', 'navigation', title, parseInt(postId));
                        }}
                    />
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
                        <div className="flex justify-end gap-4 mb-8">
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-full ${liked ? "bg-[#ff6b35]/20 text-[#ff6b35]" : "bg-[#1a1a2e] text-gray-400"} transition-colors`}
                                onClick={() => {
                                    handleLike();
                                    trackEvent(liked ? 'unlike' : 'like', 'engagement', post.title, post.id);
                                }}
                            >
                                <Heart className={`h-5 w-5 ${liked ? "fill-[#ff6b35]" : ""}`} />
                                <span>{localArticle.likes}</span>
                            </button>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a2e] text-gray-400">
                                <Eye className="h-5 w-5" />
                                <span>{viewCount}</span>
                            </div>
                            {/* 
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a2e] text-gray-400">
                                <Send className="h-5 w-5" />
                                <span>{post.shares}</span>
                            </div>*/}
                        </div>

                        <article
                            className="prose prose-lg prose-invert max-w-none whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
                        />

                        {/* Tags */}
                        <div className="mt-12 mb-8">
                            <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/articles?tag=${tag.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="bg-[#1a1a2e] text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-[#2a2a4e] transition-colors"
                                        onClick={() => {
                                            trackEvent('tag_click', 'navigation', tag, post.id);
                                        }}
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
                                    <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                                    <p className="text-white">{formatDate(article.updated_at)}</p>
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

                            {/* Table of Contents - Only visible on large screens*/}
                            <div className="hidden lg:block mb-8">
                                <h3 className="text-xl font-bold text-white mb-4">Table of Contents</h3>
                                <div className="bg-[#1a1a2e] rounded-lg p-6">
                                    <ul className="space-y-3">
                                        {tableOfContents.map((item) => (
                                            <li key={item.id}>
                                                {/* H1 principal */}
                                                <a
                                                    href={`#${item.id}`}
                                                    className="text-white hover:text-[#ff6b35] font-medium block"
                                                    onClick={() => {
                                                        trackEvent('toc_click', 'navigation', item.title, post.id);
                                                    }}
                                                >
                                                    {item.title}
                                                </a>

                                                {/* H2 anidados */}
                                                {item.children && item.children.length > 0 && (
                                                    <ul className="ml-4 mt-2 space-y-2">
                                                        {item.children.map((child) => (
                                                            <li key={child.id}>
                                                                <a
                                                                    href={`#${child.id}`}
                                                                    className="text-gray-300 hover:text-white text-sm block"
                                                                    onClick={() => {
                                                                        trackEvent('toc_click', 'navigation', child.title, post.id);
                                                                    }}
                                                                >
                                                                    {child.title}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Autor */}
                            <div className="bg-[#1a1a2e] rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-4">About the Author</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    {/* Contenedor de la imagen */}
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        {/* Imagen de fondo con blur */}
                                        <div className="absolute inset-0 rounded-full overflow-hidden">
                                            <Image
                                                src={post.author.avatar || "/placeholder.svg"}
                                                alt=""
                                                fill
                                                className="object-cover blur-xl scale-110"
                                            />
                                        </div>
                                        {/* Imagen principal */}
                                        <div className="relative w-full h-full rounded-full overflow-hidden">
                                            <Image
                                                src={post.author.avatar || "/placeholder.svg"}
                                                alt={post.author.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    {/* Texto del autor - FUERA del contenedor de imagen */}
                                    <div>
                                        <p className="font-bold text-white">{post.author.name}</p>
                                        <div className="flex gap-4 text-sm text-gray-400 mt-1">
                                            <span>{authorArticlesCount} Articles</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm">{post.author.bio}</p>
                                <Link href="/about" className="mt-4 w-full block">
                                    <button
                                        className="w-full bg-[#9d8462] hover:bg-[#9d8462] text-white py-2 rounded-md transition-colors"
                                        onClick={() => {
                                            trackEvent('author_details_click', 'navigation', post.author.name, post.id);
                                        }}
                                    >
                                        More details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Articles relacionados */}
                <div className="mt-16 mb-16">
                    {relatedArticles.length > 0 && (
                        <>
                            <h3 className="text-2xl font-bold text-white mb-8 text-center">Related Articles</h3>

                            {/* Estilos para ocultar scrollbar */}
                            <style jsx>{`
                                .scrollbar-hide {
                                    -ms-overflow-style: none;
                                    scrollbar-width: none;
                                }
                                .scrollbar-hide::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            {/* Carousel con botones fuera */}
                            <div className="relative">
                                {/* Botón izquierda - siempre visible y fuera */}
                                <button
                                    onClick={() => {
                                        const container = document.getElementById('carousel-container')
                                        if (container) {
                                            container.scrollLeft -= 400;
                                            trackEvent('carousel_left', 'interaction', 'related_articles', post.id);
                                        }
                                    }}
                                    className="absolute -left-8 md:-left-16 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white p-3 rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                {/* Carousel container */}
                                <div className="overflow-hidden">
                                    <div
                                        id="carousel-container"
                                        className="overflow-x-auto scrollbar-hide scroll-smooth"
                                    >
                                        <div className="flex gap-6">
                                            {relatedArticles.map((rel) => (
                                                <div
                                                    key={rel.id}
                                                    className="flex-none w-full md:w-[calc(33.333%-1rem)] bg-[#1a1a2e] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    <div className="relative aspect-video">
                                                        <Image
                                                            src={rel.featured_image || "/placeholder.svg"}
                                                            alt={rel.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">{rel.title}</h4>
                                                        <p className="text-gray-300 text-sm line-clamp-3">{rel.excerpt}</p>
                                                        <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
                                                            <Link
                                                                href={`/blog/${rel.slug}`}
                                                                className="inline-flex items-center gap-2 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white px-4 py-2 rounded-md transition-all transform hover:scale-105"
                                                                onClick={() => {
                                                                    trackEvent('related_article_click', 'navigation', rel.title, rel.id);
                                                                }}
                                                            >
                                                                Read More →
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Botón derecha - siempre visible y fuera */}
                                <button
                                    onClick={() => {
                                        const container = document.getElementById('carousel-container')
                                        if (container) {
                                            container.scrollLeft += 400;
                                            trackEvent('carousel_right', 'interaction', 'related_articles', post.id);
                                        }
                                    }}
                                    className="absolute -right-8 md:-right-16 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white p-3 rounded-full transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}