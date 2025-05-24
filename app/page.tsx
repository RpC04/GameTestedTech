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
import { ArticleCard } from "@/components/ArticleCard"
import { HorizontalArticleCard } from "@/components/HorizontalArticleCard"


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
        .order("created_at", { ascending: false })
        .limit(6)

      if (!error && data) {
        setLatestArticles(data)
      }
    }

    fetchArticles()
  }, [])

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
    {
      title: "Discover the Latest Gaming Tech",
      subtitle: "Stay ahead with cutting-edge reviews and insights",
      image: "/images/game-controller-logo.png",
    },
    {
      title: "Join Our Gaming Community",
      subtitle: "Connect with fellow gamers and tech enthusiasts",
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
    <div className="min-h-screen flex flex-col bg-game-dark">
      {/* Header completo con imagen de fondo */}
      <div className="relative">
        {/* Imagen de fondo para todo el header con efecto parallax */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ scale: 1.1 }}
          animate={{ scale: isLoaded ? 1 : 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img src="/images/cyberpunk-bg.png" alt="Cyberpunk background" className="w-full h-full object-cover" />
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1.2 }}
          ></motion.div>
        </motion.div>

        {/* Navbar */}
        <motion.div
          className="relative z-10 border-b border-gray-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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
                  <Link
                    href="/articles"
                    className="text-game-white hover:text-game-cyan transition-all duration-300 hover:scale-105 inline-block">
                    Articles
                  </Link>
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
                    {heroSlides[activeSlide].title}
                  </motion.h1>
                  <motion.p className="text-gray-300 mt-4" variants={itemVariants}>
                    {heroSlides[activeSlide].subtitle}
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

              <motion.div className="flex gap-2 pt-4" variants={itemVariants}>
                <motion.button
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
                  whileHover={{ scale: 1.1, backgroundColor: "#8fc9ff" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-4 w-4 text-black" />
                </motion.button>
                <motion.button
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
                  whileHover={{ scale: 1.1, backgroundColor: "#8fc9ff" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-4 w-4 text-black" />
                </motion.button>
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

      {/* Text Banner  with animation for the move and blur effect*/}
      <div className="relative py-8 overflow-hidden">
        <div className="absolute inset-0 bg-game-dark"></div>
        <div className="relative z-10 flex justify-center">
          <motion.div
            className="max-w-5xl w-[95%] mx-auto bg-gray-800/60 backdrop-blur-md rounded-lg py-6 px-8 text-center text-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <motion.div
              animate={{
                x: [5, 0, 5],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <p className="text-base md:text-lg font-medium mb-2">
                Game Tested Tech: Your Trusted Source for Honest Gaming Hardware Reviews & Recommendations
              </p>
              <p className="text-sm md:text-base text-gray-300">
                Explore in-depth reviews and guides to optimize your gaming setups.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Blog Content Section with Tabs */}
      <section className="py-12 bg-[#0f0a1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-1">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3">
              {/* Tabs for different post categories */}
              <motion.div
                className="flex border-b border-gray-700 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div
                  className={`py-3 px-5 font-medium text-sm transition-colors ${activeTab === "recent"
                    ? "text-game-cyan border-b-2 border-game-cyan"
                    : "text-gray-400 hover:text-white"
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
                      {/* 1. Artículo a la izquierda + 2 apilados a la derecha */}
                      <ArticleCard article={latestArticles[0]} large className="w-full" />

                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <ArticleCard article={latestArticles[1]} />
                        <ArticleCard article={latestArticles[2]} />
                      </div>

                      {/* 2. Artículo horizontal */}
                      <ArticleCard article={latestArticles[3]} large className="w-full" />

                      {/* Blocks */}
                      <div className="space-y-12">
                        {/* Block 1 */}
                        <div className="flex flex-col md:flex-row items-center  rounded-2xl shadow-lg p-6 gap-6">
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
                        </div>

                        {/* Block 2 */}
                        <div className="flex flex-col-reverse md:flex-row items-center  rounded-2xl shadow-lg p-6 gap-6">
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
                        </div>

                        {/* Block 3 */}
                        <div className="flex flex-col md:flex-row items-center  rounded-2xl shadow-lg p-6 gap-6">
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
                        </div>
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
      </section>

      {/* Footer con animación */}
      <motion.footer
        className="bg-game-dark py-8 mt-auto border-t border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants}>
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
              </motion.div>
              <motion.div className="flex items-center gap-2 pt-4" variants={itemVariants}>
                <span className="text-gray-400">✉</span>
                <a
                  href="mailto:contact@gametestedtech.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  contact@gametestedtech.com
                </a>
              </motion.div>
              <motion.div className="flex items-center gap-2" variants={itemVariants}>
                <span className="text-gray-400">📞</span>
                <a href="tel:+11223456789" className="text-gray-400 hover:text-white transition-colors">
                  +1-1223-456-7890
                </a>
              </motion.div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h3 className="text-white font-bold mb-4" variants={itemVariants}>
                Quick Links
              </motion.h3>
              <motion.div variants={itemVariants}>
                <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/articles" className="block text-gray-400 hover:text-white transition-colors">
                  Articles
                </Link>
              </motion.div> 
              <motion.div variants={itemVariants}>
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </motion.div> 
            </motion.div>

            {/* Social Media Links */}
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h3 className="text-white font-bold mb-4" variants={itemVariants}>
                Follow Us
              </motion.h3>
              <motion.div variants={itemVariants}>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Youtube
                </a>
              </motion.div>
              <motion.div variants={itemVariants}>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </motion.div>
              <motion.div variants={itemVariants}>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
              </motion.div>
              <motion.div variants={itemVariants}>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Discord
                </a>
              </motion.div>
              <motion.div variants={itemVariants}>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
              </motion.div>
            </motion.div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Game Tested Tech. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}