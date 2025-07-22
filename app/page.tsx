"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { ArticleCard } from "@/components/articles/article-card"
import { HorizontalArticleCard } from "@/components/articles/horizontal-article-card"
import ArticlesDropdown from "@/components/articles/articles-dropdown";
import { Header } from "@/components/header"
import Footer from "@/components/footer";


export default function Home() {
  // Estado para controlar las animaciones
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [activeTab] = useState("recent")
  const [latestArticles, setLatestArticles] = useState<any[]>([])

  const floatAnimation = {
    y: [0, -15, 0],
    rotate: [0, 2, 0, -2, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  useEffect(() => {
    async function fetchArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select(`
              *,
              author:authors (
                name,
                avatar_url
              ), article_tags (
                tag:tags ( id, name )
              ),
              category:categories ( id, name )
        `)
        .eq('status', 'published')
        .order("created_at", { ascending: false })
        .limit(6)

      if (!error && data) {
        setLatestArticles(data)
      }
    }

    fetchArticles()
  }, [])

  // For community stats
  const stats = [
    { value: "1.2M+", label: "Community Members" },
    { value: "10K+", label: "Game Reviews" },
    { value: "5K+", label: "Gaming Guides" },
    { value: "24/7", label: "Support" },
  ];

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // Aparece cada 0.15s
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: "spring" } },
  };

  // Efecto para activar las animaciones después de que la página cargue
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Variantes de animación para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f23]">
      {/* Header completo con imagen de fondo */}
      
      <div className="relative">
        <Header />

        {/* Hero Section - Con slider animado */}
        <div className="relative w-full bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] overflow-hidden">
          {/* Decorative blobs/fondo */}
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
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <AnimatePresence>
                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-game-white">
                      Tech for Gamers, By Gamers.
                    </h1>
                    <p className="text-gray-300 mt-4" >
                      Where Gaming Meets Innovation. Tech for Gamers, By Gamers
                    </p>
                  </div>
                </AnimatePresence>

                <motion.div className="flex gap-4" variants={itemVariants}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/articles">
                      <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-md transition-all duration-300 border-0">
                        Explore Now
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
                  <motion.div
                    className="text-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-sm text-gray-400">Articles</p>
                  </motion.div>
                  <motion.div
                    className="text-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <p className="text-2xl font-bold">50K+</p>
                    <p className="text-sm text-gray-400">Readers</p>
                  </motion.div>
                  <motion.div
                    className="text-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <p className="text-2xl font-bold">20+</p>
                    <p className="text-sm text-gray-400">Categories</p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Imagen del controlador con animación de flotación mejorada */}
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

      {/* Main Blog Content Section with Tabs */}
      <motion.section className="py-12 bg-[#0a0a14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-1">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3">
              {/* Tabs for different post-categories */}
              <motion.div
                className="flex mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div
                  className={`py-3 px-5 font-medium text-2xl transition-colors ${activeTab === "recent"
                      ? "text-game-cyan"
                      : "text-gray-400"
                    }`}
                >
                  Recent Posts
                </div>
              </motion.div>

              {/* Recent Posts */}
              <AnimatePresence mode="wait">
                {activeTab === "recent" && (
                  <motion.div
                    key="recent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-10">
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <ArticleCard article={latestArticles[0]} />
                        <ArticleCard article={latestArticles[1]} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <ArticleCard article={latestArticles[2]} />
                        <ArticleCard article={latestArticles[3]} />
                      </div>

                      {/* Blocks */}
                      <div className="space-y-12">
                        {/* Block 1 */}
                        <motion.div
                          className="flex flex-col md:flex-row items-center rounded-2xl shadow-lg p-6 gap-6"
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
                          viewport={{ once: true, amount: 0.2 }}
                        >
                          <img
                            src="/images/unsplash.png"
                            alt="Unfiltered Reviews"
                            className="w-full h-40 md:w-[360px] md:h-[240px] object-cover rounded-xl"
                          />
                          <div>
                            <h3 className="text-xl font-bold mb-2 text-white">
                              Unfiltered Reviews: Honest Opinions You Can Trust
                            </h3>
                            <p className="text-gray-300">
                              At Game Tested Tech, we provide high-quality, truthful reviews to empower you with the knowledge you need to make informed decisions about gaming hardware and peripherals. Whether you're researching your next upgrade, seeking validation after a purchase, or simply curious about the latest tech, we're here to guide you. Our in-depth analyses cover everything from performance and features to value and user experience, ensuring you find the perfect gear for your gaming setup.
                            </p>
                          </div>
                        </motion.div>

                        {/* Block 2 */}
                        <motion.div
                          className="flex flex-col-reverse md:flex-row items-center rounded-2xl shadow-lg p-6 gap-6"
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.25, type: "spring" }}
                          viewport={{ once: true, amount: 0.2 }}
                        >
                          <div className="text-right w-full">
                            <h3 className="text-xl font-bold mb-2 text-white">
                              Unlock True Gaming Potential: Expert Guides
                            </h3>
                            <p className="text-gray-300">
                              Game Tested Tech strives to provide a wealth of diverse and helpful information to empower gamers of all levels, from enthusiasts to casual players. This includes comprehensive guides covering a wide range of topics, such as troubleshooting common errors, optimizing performance, overclocking components, and building powerful gaming PCs. Our guides are designed to be easy to understand and follow, making it simple for anyone to learn and apply the knowledge.
                            </p>
                          </div>
                          <img
                            src="/images/unsplash.png"
                            alt="Expert Guides"
                            className="w-full h-40 md:w-[360px] md:h-[240px] object-cover rounded-xl"
                          />
                        </motion.div>

                        {/* Block 3 */}
                        <motion.div
                          className="flex flex-col md:flex-row items-center rounded-2xl shadow-lg p-6 gap-6"
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
                          viewport={{ once: true, amount: 0.2 }}
                        >
                          <img
                            src="/images/unsplash.png"
                            alt="Methodology"
                            className="w-full h-40 md:w-[360px] md:h-[240px] object-cover rounded-xl"
                          />
                          <div>
                            <h3 className="text-xl font-bold mb-2 text-white">
                              The Game Tested Way: Our Rigorous Methodology
                            </h3>
                            <p className="text-gray-300">
                              Benchmarking products requires meticulous care, time, and unwavering honesty. At GTT, we prioritize accuracy and take all necessary precautions to ensure the integrity of our data. We acknowledge that unforeseen circumstances or human error can occasionally lead to inaccuracies, and we take full responsibility for rectifying any such issues. Game Tested Tech cares about providing you with reliable and trustworthy information.
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* 4. Dos artículos horizontales alternados */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <HorizontalArticleCard article={latestArticles[4]} reverse={false} />
                        <HorizontalArticleCard article={latestArticles[5]} reverse={true} />
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.section>
      {/* Community Stats Section */}
      <motion.section
        className="bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] py-12 border-t border-gray-800"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            variants={container}
          >
            {stats.map((stat, i) => (
              <motion.div key={i} className="p-6" variants={item}>
                <p className={
                  "text-3xl md:text-4xl font-bold " +
                  (i === 0
                    ? "text-white"
                    : i === 2
                      ? "text-[#ff6b35]"
                      : "text-game-cyan")
                }
                >
                  {stat.value}
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      <Footer />
    </div>
  )
}