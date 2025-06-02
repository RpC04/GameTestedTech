"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { ArticleCard } from "@/components/articles/article-card"
import { HorizontalArticleCard } from "@/components/articles/horizontal-article-card"
import ArticlesDropdown from "@/components/articles/articles-dropdown";
import Footer from "@/components/footer";


export default function Home() {
  // Estado para controlar las animaciones
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [activeTab] = useState("recent")
  const [latestArticles, setLatestArticles] = useState<any[]>([])

  const dotPositions = [
    { top: "11.028856%", left: "27.500000%" },
    { top: "50.000000%", left: "5.000000%" },
    { top: "88.971144%", left: "27.500000%" },
    { top: "88.971144%", left: "72.500000%" },
    { top: "50.000000%", left: "95.000000%" },
    { top: "11.028856%", left: "72.500000%" },
  ];

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

  // Función para cambiar slides
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % 3)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + 3) % 3)
  }

  // Efecto para cambiar slides automáticamente
  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovering])

  // Datos para el slider
  const heroSlides = [
    {
      title: "Tech for Gamers, By Gamers.",
      subtitle: "Where Gaming Meets Innovation. Tech for Gamers, By Gamers",
      image: "/images/game-controller-logo.png",
    },
  ]

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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f23]">
      {/* Header completo con imagen de fondo */}
      <div className="relative">
        {/* Imagen de fondo para todo el header con efecto parallax */}

        {/* Navbar */}
        <motion.div
          className="relative z-50 border-b border-gray-800 bg-[#0f0f23]"
          initial={{  opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center gap-8"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
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
              </motion.div>
              {/*
              <motion.div
                className="relative flex-1 max-w-xl mx-8"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <input
                  type="text"
                  className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-full py-2 px-4 pr-10 text-white transition-all duration-300 focus:border-game-cyan focus:ring-1 focus:ring-game-cyan"
                  placeholder="Search..."
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </motion.div>
              */}
              <motion.nav
                className="hidden md:flex items-center gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Link
                    href="/"
                    className="text-game-white hover:text-game-cyan transition-all duration-300 hover:scale-105 inline-block">
                    Home
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ArticlesDropdown />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/about"
                    className="text-game-white hover:text-game-cyan transition-all duration-300 hover:scale-105 inline-block"
                  >
                    About Us
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/contact"
                    className="text-game-white hover:text-game-cyan transition-all duration-300 hover:scale-105 inline-block">
                    Contact
                  </Link>
                </motion.div>
              </motion.nav>
            </div>
          </div>
        </motion.div>

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
              <AnimatePresence mode="wait" custom={activeSlide}>
                <motion.div
                  key={activeSlide}
                  custom={activeSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-2"
                >
                  <motion.h1 className="text-4xl md:text-5xl font-bold text-game-white" variants={itemVariants}>
                    {heroSlides[0].title}
                  </motion.h1>
                  <motion.p className="text-gray-300 mt-4" variants={itemVariants}>
                    {heroSlides[0].subtitle}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              <motion.div className="flex gap-4" variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/articles">
                    <Button className="bg-[#9d8462] hover:bg-[#9d8462] text-white rounded-md transition-all duration-300 border-0">
                      Explore Now
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

            <motion.div
              className="relative hidden md:block"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
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
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-blue-500/30 blur-2xl -z-10"></div>
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
                  className={`py-3 px-5 font-medium text-2xl transition-colors ${
                    activeTab === "recent"
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
                              At Game Tested Tech, we provide high-quality, truthful reviews to empower you with the knowledge you need to make informed decisions about gaming hardware and peripherals. Whether you’re researching your next upgrade, seeking validation after a purchase, or simply curious about the latest tech, we’re here to guide you. Our in-depth analyses cover everything from performance and features to value and user experience, ensuring you find the perfect gear for your gaming setup.
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

      {/* Newsletter Section 
      <section className="py-16 bg-game-purple">
        <motion.div
          className="max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Join Our Gaming Tech Community
          </motion.h2>
          <motion.p
            className="text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Subscribe to our newsletter and be the first to receive our latest articles, reviews, and exclusive content.
            Stay ahead of the curve with Game Tested Tech.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-game-cyan"
            />
            <Button className="bg-[#9d8462] hover:bg-[#9d8462] text-white py-3 px-6">Subscribe</Button>
          </motion.div>
          <motion.p
            className="text-xs text-gray-500 mt-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </motion.p>
        </motion.div>
      </section>*/}
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
                <p className="text-3xl md:text-4xl font-bold text-game-cyan">{stat.value}</p>
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