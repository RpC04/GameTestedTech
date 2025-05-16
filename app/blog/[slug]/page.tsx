"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, Send, Clock } from "lucide-react"
import { Header } from "@/components/header"

// Function to calculate reading time based on word count
const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 225
  const wordCount = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readingTime} min read`
}

// Simulated function to fetch blog post data
// In a real application, this would be replaced with an API call or database query
const getBlogPost = (slug: string) => {
  // En un caso real, esto sería una llamada a una API o base de datos
  const post = {
    id: 1,
    slug: "artificial-intelligence-in-gaming",
    title: "Artificial Intelligence (AI) in Gaming: Revolutionizing Player Experience",
    excerpt:
      "An in-depth look at how artificial intelligence is transforming the gaming industry and creating more immersive experiences.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Artificial Intelligence (AI) has become a cornerstone of modern gaming, transforming how games are developed, played, and experienced. From creating more realistic non-player characters (NPCs) to generating dynamic game worlds, AI technologies are revolutionizing the gaming industry in unprecedented ways.</p>
      
      <p>This article explores the various applications of AI in gaming, its current state, and what the future might hold for gamers and developers alike.</p>
      
      <figure>
        <img src="/placeholder.svg?height=400&width=800" alt="AI in gaming illustration" class="rounded-lg w-full" />
        <figcaption class="text-center text-sm text-gray-400 mt-2">AI-powered characters and environments in modern gaming</figcaption>
      </figure>
      
      <h2 id="ai-in-gaming">Artificial Intelligence (AI) in Gaming</h2>
      <p>The integration of AI in gaming goes beyond simple scripted behaviors. Modern games utilize sophisticated AI systems that can learn, adapt, and respond to player actions in ways that create truly immersive experiences.</p>
      
      <p>Some key applications of AI in gaming include:</p>
      
      <ul>
        <li><strong>Procedural content generation</strong>: Creating game worlds, levels, and assets dynamically</li>
        <li><strong>Adaptive difficulty systems</strong>: Adjusting game challenge based on player performance</li>
        <li><strong>NPC behavior and pathfinding</strong>: Creating more realistic and intelligent computer-controlled characters</li>
        <li><strong>Player behavior analysis</strong>: Understanding how players interact with games to improve design</li>
      </ul>
      
      <blockquote>
        <p>"AI is not just changing how games are played, but fundamentally altering how they're created. The boundaries between designer intent and emergent gameplay are becoming increasingly blurred."</p>
        <cite>— Dr. Julian Togelius, Associate Professor at NYU's Game Innovation Lab</cite>
      </blockquote>
      
      <h2 id="predictive-analytics">Predictive Analytics and Game Design</h2>
      <p>One of the most powerful applications of AI in gaming is predictive analytics. By analyzing vast amounts of player data, game developers can:</p>
      
      <ul>
        <li>Identify patterns in player behavior</li>
        <li>Predict player preferences and pain points</li>
        <li>Optimize game balance and progression</li>
        <li>Create personalized gaming experiences</li>
      </ul>
      
      <p>This data-driven approach to game design has led to more engaging and satisfying games that can adapt to different player types and preferences.</p>
      
      <h2 id="ai-npcs">The Evolution of AI-Powered NPCs</h2>
      <p>Non-player characters (NPCs) have undergone a remarkable transformation thanks to advances in AI. Modern NPCs can:</p>
      
      <ul>
        <li>Learn from player interactions</li>
        <li>Exhibit emergent behaviors not explicitly programmed</li>
        <li>Adapt their strategies based on player actions</li>
        <li>Display more natural and contextual dialogue</li>
      </ul>
      
      <p>Games like "The Last of Us Part II," "Red Dead Redemption 2," and "F.E.A.R." showcase how sophisticated AI systems can create memorable and challenging NPC encounters.</p>
      
      <h2 id="procedural-generation">Procedural Content Generation</h2>
      <p>AI-driven procedural generation has revolutionized how game worlds are created. This technology allows for:</p>
      
      <ul>
        <li>Virtually infinite game worlds and levels</li>
        <li>Unique experiences for each playthrough</li>
        <li>Reduced development time for creating game assets</li>
        <li>Dynamic environments that respond to player actions</li>
      </ul>
      
      <p>Games like "No Man's Sky," "Minecraft," and "Rogue-like" titles demonstrate the power of procedural generation in creating vast and varied gaming experiences.</p>
      
      <h2 id="future-of-ai">The Future of AI in Gaming</h2>
      <p>As AI technologies continue to advance, we can expect even more revolutionary applications in gaming:</p>
      
      <ul>
        <li><strong>Dynamic narrative generation</strong>: AI systems that can create compelling stories and quests on the fly</li>
        <li><strong>Hyper-personalization</strong>: Games that adapt not just difficulty but entire experiences based on player preferences</li>
        <li><strong>Emotional AI</strong>: NPCs capable of recognizing and responding to player emotions</li>
        <li><strong>Cross-game learning</strong>: AI systems that learn player preferences across different games</li>
      </ul>
      
      <p>These advancements promise to create gaming experiences that are more immersive, responsive, and personalized than ever before.</p>
      
      <h2 id="conclusion">Conclusion: A New Era of Gaming</h2>
      <p>Artificial intelligence is not just a feature of modern games but increasingly their foundation. As AI technologies continue to evolve, the line between virtual and real experiences will blur further, creating games that can truly understand and respond to players in meaningful ways.</p>
      
      <p>For gamers, developers, and the industry as a whole, AI represents not just an enhancement to existing gaming paradigms but a complete reimagining of what games can be. The future of AI in gaming is not just about better graphics or more realistic physics—it's about creating truly intelligent virtual worlds that can surprise, challenge, and delight players in ways we're only beginning to imagine.</p>
    `,
    publishedAt: new Date("2025-03-15T09:30:00"),
    author: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Gaming technology enthusiast and AI researcher with over 10 years of experience in the industry.",
      articles: 47,
      followers: 12500,
    },
    categories: ["Technology", "Gaming"],
    tags: ["Artificial Intelligence", "Game Design", "NPCs", "Procedural Generation", "Gaming Technology"],
    featuredImage: "/placeholder.svg?height=600&width=1200",
    views: 24500,
    likes: 18700,
    shares: 3420,
    comments: 342,
    tableOfContents: [
      { id: "introduction", title: "Introduction" },
      { id: "ai-in-gaming", title: "Artificial Intelligence (AI) in Gaming" },
      { id: "predictive-analytics", title: "Predictive Analytics and Game Design" },
      { id: "ai-npcs", title: "The Evolution of AI-Powered NPCs" },
      { id: "procedural-generation", title: "Procedural Content Generation" },
      { id: "future-of-ai", title: "The Future of AI in Gaming" },
      { id: "conclusion", title: "Conclusion: A New Era of Gaming" },
    ],
  }

  // Calcular el tiempo de lectura basado en el contenido
  return {
    ...post,
    readingTime: calculateReadingTime(post.content.replace(/<[^>]*>/g, ""))
  }
  
}

// Función para formatear fechas
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Componente para la página de blog
export default function BlogPost({ params }: { params: { slug: string } }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [activeSection, setActiveSection] = useState("introduction")

  // Obtener datos del post
  const rawPost = getBlogPost(params.slug)

  const post = {
    ...rawPost,
    readingTime: calculateReadingTime(rawPost.content.replace(/<[^>]*>/g, ""))
  }
  

  // Efecto para simular carga e incrementar visualizaciones
  useEffect(() => {
    setIsLoaded(true)

    // Simular incremento de visualizaciones
    setViewCount(post.views)

    // Configurar observador de intersección para detectar secciones visibles
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    // Observar todas las secciones con encabezados
    document.querySelectorAll("h2[id]").forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [post.views])

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
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-[#ff6b35]" : ""}`} />
                <span>{liked ? post.likes + 1 : post.likes}</span>
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

            <article className="prose prose-lg prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
                    {post.tableOfContents.map((item) => (
                      <li key={item.id} className="flex items-start">
                        <div
                          className={`mt-1.5 mr-2 h-1.5 w-1.5 rounded-full ${activeSection === item.id ? "bg-[#ff6b35]" : "bg-gray-600"}`}
                        ></div>
                        <a
                          href={`#${item.id}`}
                          className={`${activeSection === item.id ? "text-white font-medium" : "text-gray-400"} hover:text-white transition-colors`}
                        >
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
