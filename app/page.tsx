"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  Clock,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function Home() {
  // Estado para controlar las animaciones
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [activeTab, setActiveTab] = useState("recent")

  const dotPositions = [
    { top: "11.028856%", left: "27.500000%" },
    { top: "50.000000%", left: "5.000000%" },
    { top: "88.971144%", left: "27.500000%" },
    { top: "88.971144%", left: "72.500000%" },
    { top: "50.000000%", left: "95.000000%" },
    { top: "11.028856%", left: "72.500000%" },
  ];

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

  // Datos de ejemplo para los blogs
  const featuredPosts = [
    {
      id: 1,
      title: "The Future of Gaming: Next-Gen Consoles and What to Expect",
      excerpt:
        "An in-depth look at the upcoming generation of gaming consoles and the technologies that will define gaming for years to come.",
      date: "March 15, 2025",
      author: "Alex Rodriguez",
      image: "/placeholder.svg?height=400&width=600",
      views: 15420,
      comments: 342,
      categories: ["Hardware", "Gaming"],
      featured: true,
    },
    {
      id: 2,
      title: "Mechanical vs Membrane Keyboards: Which is Right for Your Gaming Setup?",
      excerpt:
        "We compare the pros and cons of mechanical and membrane keyboards to help you make the best choice for your gaming needs.",
      date: "March 10, 2025",
      author: "Sarah Chen",
      image: "/placeholder.svg?height=400&width=600",
      views: 12840,
      comments: 256,
      categories: ["Peripherals", "Reviews"],
      featured: true,
    },
    {
      id: 3,
      title: "How to Build Your First Gaming PC: A Complete Guide for Beginners",
      excerpt:
        "Everything you need to know about building your first gaming PC, from selecting components to final assembly.",
      date: "March 5, 2025",
      author: "Michael Johnson",
      image: "/placeholder.svg?height=400&width=600",
      views: 18650,
      comments: 423,
      categories: ["Guides", "PC Building"],
      featured: true,
    },
  ]

  const recentPosts = [
    {
      id: 4,
      title: "RTX 5090 vs RX 8900 XT: The Ultimate GPU Showdown",
      excerpt: "We put the latest flagship GPUs from NVIDIA and AMD to the test in real-world gaming scenarios.",
      date: "March 25, 2025",
      author: "David Kim",
      image: "/placeholder.svg?height=300&width=400",
      views: 8420,
      comments: 187,
      categories: ["Hardware", "Reviews"],
    },
    {
      id: 5,
      title: "The Best Gaming Monitors of 2025: High Refresh Rates and Beyond",
      excerpt:
        "Our comprehensive guide to the best gaming monitors available this year, from budget options to premium displays.",
      date: "March 23, 2025",
      author: "Emily Watson",
      image: "/placeholder.svg?height=300&width=400",
      views: 6240,
      comments: 124,
      categories: ["Peripherals", "Reviews"],
    },
    {
      id: 6,
      title: "Optimizing Your Gaming Setup for Maximum Performance",
      excerpt: "Tips and tricks to ensure your gaming rig is running at its absolute best for competitive gaming.",
      date: "March 20, 2025",
      author: "James Wilson",
      image: "/placeholder.svg?height=300&width=400",
      views: 5890,
      comments: 98,
      categories: ["Guides", "Performance"],
    },
    {
      id: 7,
      title: "The Evolution of Gaming Audio: From Stereo to Spatial Sound",
      excerpt:
        "How gaming audio has evolved over the years and what technologies are shaping the future of immersive sound.",
      date: "March 18, 2025",
      author: "Lisa Thompson",
      image: "/placeholder.svg?height=300&width=400",
      views: 4760,
      comments: 76,
      categories: ["Audio", "Technology"],
    },
  ]

  const popularPosts = [
    {
      id: 8,
      title: "10 Essential PC Upgrades That Won't Break the Bank",
      excerpt:
        "Affordable upgrades that can significantly improve your gaming PC's performance without costing a fortune.",
      date: "February 28, 2025",
      author: "Robert Chen",
      image: "/placeholder.svg?height=300&width=400",
      views: 24680,
      comments: 312,
      categories: ["Hardware", "Guides"],
    },
    {
      id: 9,
      title: "The Best Gaming Headsets for Every Budget in 2025",
      excerpt:
        "From budget-friendly options to premium experiences, we've tested dozens of gaming headsets to find the best for you.",
      date: "February 20, 2025",
      author: "Amanda Garcia",
      image: "/placeholder.svg?height=300&width=400",
      views: 22450,
      comments: 287,
      categories: ["Audio", "Reviews"],
    },
    {
      id: 10,
      title: "SSD vs HDD for Gaming: Is the Performance Difference Worth It?",
      excerpt: "We analyze the real-world performance differences between SSDs and HDDs for gaming applications.",
      date: "February 15, 2025",
      author: "Thomas Wright",
      image: "/placeholder.svg?height=300&width=400",
      views: 21380,
      comments: 265,
      categories: ["Storage", "Performance"],
    },
    {
      id: 11,
      title: "Gaming at 4K: Is It Worth the Hardware Investment?",
      excerpt:
        "A detailed analysis of whether gaming at 4K resolution is worth the significant hardware costs involved.",
      date: "February 10, 2025",
      author: "Sophia Martinez",
      image: "/placeholder.svg?height=300&width=400",
      views: 20150,
      comments: 243,
      categories: ["Hardware", "Analysis"],
    },
  ]

  const commentedPosts = [
    {
      id: 12,
      title: "The Controversial Rise of AI in Game Development",
      excerpt:
        "Exploring how artificial intelligence is changing game development and the controversies surrounding its use.",
      date: "March 1, 2025",
      author: "Daniel Lee",
      image: "/placeholder.svg?height=300&width=400",
      views: 18750,
      comments: 645,
      categories: ["Industry", "Technology"],
    },
    {
      id: 13,
      title: "Are Gaming Subscriptions the Future? Xbox Game Pass vs PlayStation Plus",
      excerpt:
        "We compare the major gaming subscription services and discuss whether they represent the future of game distribution.",
      date: "February 25, 2025",
      author: "Olivia Johnson",
      image: "/placeholder.svg?height=300&width=400",
      views: 16840,
      comments: 587,
      categories: ["Services", "Analysis"],
    },
    {
      id: 14,
      title: "The Ethics of Microtransactions in Modern Gaming",
      excerpt:
        "A deep dive into the controversial practice of microtransactions and their impact on game design and player experience.",
      date: "February 18, 2025",
      author: "Nathan Brown",
      image: "/placeholder.svg?height=300&width=400",
      views: 15920,
      comments: 542,
      categories: ["Industry", "Opinion"],
    },
    {
      id: 15,
      title: "PC vs Console Gaming in 2025: Which Platform Reigns Supreme?",
      excerpt:
        "The age-old debate continues: we analyze the current state of PC and console gaming to determine which offers the better experience.",
      date: "February 12, 2025",
      author: "Rachel Kim",
      image: "/placeholder.svg?height=300&width=400",
      views: 14780,
      comments: 521,
      categories: ["Gaming", "Comparison"],
    },
  ]

  // Categorías populares
  const popularCategories = [
    { name: "Hardware", count: 156, icon: "🖥️" },
    { name: "Reviews", count: 124, icon: "⭐" },
    { name: "Guides", count: 98, icon: "📚" },
    { name: "Gaming", count: 87, icon: "🎮" },
    { name: "Performance", count: 76, icon: "⚡" },
    { name: "Technology", count: 65, icon: "🔧" },
  ]

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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
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

              <motion.div
                className="relative flex-1 max-w-xl mx-8"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <input
                  type="text"
                  className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-full py-2 px-4 pr-10 text-white transition-all duration-300 focus:border-game-cyan focus:ring-1 focus:ring-game-cyan"
                  placeholder="Buscar..."
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </motion.div>

              <motion.nav
                className="hidden md:flex items-center gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Link
                    href="/"
                    className="text-game-white hover:text-game-cyan transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Inicio
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/articles"
                    className="text-game-white hover:text-game-cyan transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Artículos
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/about"
                    className="text-game-white hover:text-game-cyan transition-all duration-300 hover:scale-105 inline-block"
                  >
                    About
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/contact"
                    className="text-game-white hover:text-game-cyan transition-all duration-300 hover:scale-105 inline-block"
                  >
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
              transition={{ duration: 0.7, delay: 0.5 }}
            >
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

      {/* Text Banner con animación de desplazamiento y efecto blur */}
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

      {/* Featured Posts Section */}
      <section className="py-12 bg-game-dark">
        <motion.div
          className="max-w-7xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h2
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Featured Articles
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link
                href="/articles"
                className="text-game-cyan hover:text-white flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="bg-[#1f0032] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-video">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2 mb-2">
                      {post.categories.map((category, idx) => (
                        <Link
                          key={idx}
                          href={`/category/${category.toLowerCase()}`}
                          className="bg-game-tag-blue text-white text-xs px-3 py-1 rounded-full hover:bg-game-blue transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white line-clamp-2">{post.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span suppressHydrationWarning>{post.views.toLocaleString("en-US")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Main Blog Content Section with Tabs */}
      <section className="py-12 bg-[#0f0a1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                <button
                  className={`py-3 px-5 font-medium text-sm transition-colors ${activeTab === "recent"
                    ? "text-game-cyan border-b-2 border-game-cyan"
                    : "text-gray-400 hover:text-white"
                    }`}
                  onClick={() => setActiveTab("recent")}
                >
                  Recent Posts
                </button>
                <button
                  className={`py-3 px-5 font-medium text-sm transition-colors ${activeTab === "popular"
                    ? "text-game-cyan border-b-2 border-game-cyan"
                    : "text-gray-400 hover:text-white"
                    }`}
                  onClick={() => setActiveTab("popular")}
                >
                  Most Viewed
                </button>
                <button
                  className={`py-3 px-5 font-medium text-sm transition-colors ${activeTab === "commented"
                    ? "text-game-cyan border-b-2 border-game-cyan"
                    : "text-gray-400 hover:text-white"
                    }`}
                  onClick={() => setActiveTab("commented")}
                >
                  Most Commented
                </button>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recentPosts.map((post, index) => (
                        <motion.article
                          key={post.id}
                          className="bg-[#1f0032] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="relative aspect-video">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <div className="flex gap-1">
                                {post.categories.slice(0, 1).map((category, idx) => (
                                  <Link
                                    key={idx}
                                    href={`/category/${category.toLowerCase()}`}
                                    className="bg-game-tag-blue text-white text-xs px-2 py-1 rounded-full hover:bg-game-blue transition-colors"
                                  >
                                    {category}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <Link href={`/article/${post.id}`} className="group">
                              <h3 className="text-lg font-bold text-white group-hover:text-game-cyan transition-colors line-clamp-2 mb-2">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                            <div className="flex justify-between items-center text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{typeof window !== "undefined" ? post.views.toLocaleString() : post.views}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>{post.comments}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Popular Posts */}
                {activeTab === "popular" && (
                  <motion.div
                    key="popular"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {popularPosts.map((post, index) => (
                        <motion.article
                          key={post.id}
                          className="bg-[#1f0032] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="relative aspect-video">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <div className="flex gap-1">
                                {post.categories.slice(0, 1).map((category, idx) => (
                                  <Link
                                    key={idx}
                                    href={`/category/${category.toLowerCase()}`}
                                    className="bg-game-tag-blue text-white text-xs px-2 py-1 rounded-full hover:bg-game-blue transition-colors"
                                  >
                                    {category}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <div className="bg-game-pink text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>Popular</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <Link href={`/article/${post.id}`} className="group">
                              <h3 className="text-lg font-bold text-white group-hover:text-game-cyan transition-colors line-clamp-2 mb-2">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                            <div className="flex justify-between items-center text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-game-cyan font-medium">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>{post.comments}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Most Commented Posts */}
                {activeTab === "commented" && (
                  <motion.div
                    key="commented"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {commentedPosts.map((post, index) => (
                        <motion.article
                          key={post.id}
                          className="bg-[#1f0032] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="relative aspect-video">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <div className="flex gap-1">
                                {post.categories.slice(0, 1).map((category, idx) => (
                                  <Link
                                    key={idx}
                                    href={`/category/${category.toLowerCase()}`}
                                    className="bg-game-tag-blue text-white text-xs px-2 py-1 rounded-full hover:bg-game-blue transition-colors"
                                  >
                                    {category}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <div className="bg-[#9d8462] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>Hot Topic</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <Link href={`/article/${post.id}`} className="group">
                              <h3 className="text-lg font-bold text-white group-hover:text-game-cyan transition-colors line-clamp-2 mb-2">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                            <div className="flex justify-between items-center text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1 text-game-cyan font-medium">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>{post.comments}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* También actualiza el botón de "Load More Articles" en la sección de artículos: */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Button className="bg-[#9d8462] hover:bg-[#9d8462] text-white">Load More Articles</Button>
              </motion.div>
            </div>

            {/* Sidebar - Categories & Newsletter */}
            <div className="lg:col-span-1 space-y-8">
              {/* Popular Categories */}
              <motion.div
                className="bg-[#1f0032] rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Popular Categories</h3>
                <div className="space-y-3">
                  {popularCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={`/category/${category.name.toLowerCase()}`}
                        className="flex items-center justify-between p-2 hover:bg-[#2a0045] rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{category.icon}</span>
                          <span className="text-white">{category.name}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{category.count}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-game-tag-blue hover:bg-game-blue text-white">All Categories</Button>
              </motion.div>

              {/* Newsletter Subscription */}
              <motion.div
                className="bg-[#1f0032] rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Subscribe to Our Newsletter</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Get the latest gaming tech news and reviews delivered directly to your inbox.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full bg-[#10061e] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-game-cyan"
                  />
                  {/* Y actualiza el botón de suscripción en la sección de Newsletter: */}
                  <Button className="bg-[#9d8462] hover:bg-[#9d8462] text-white py-3 px-6">Subscribe</Button>
                </form>
                <p className="text-gray-500 text-xs mt-2">We respect your privacy. Unsubscribe at any time.</p>
              </motion.div>

              {/* Tags Cloud */}
              <motion.div
                className="bg-[#1f0032] rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-game-cyan" />
                  <h3 className="text-xl font-bold text-white">Popular Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Gaming",
                    "Hardware",
                    "Reviews",
                    "PC Building",
                    "Peripherals",
                    "Graphics Cards",
                    "Processors",
                    "Monitors",
                    "Keyboards",
                    "Gaming Mice",
                    "Audio",
                    "Storage",
                    "Performance",
                    "Budget Builds",
                    "Cooling",
                  ].map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-block bg-[#10061e] text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-game-tag-blue hover:text-white transition-colors"
                      >
                        {tag}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
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
                <Link href="/categories" className="block text-gray-400 hover:text-white transition-colors">
                  Categories
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
              <motion.div variants={itemVariants}>
                <Link href="/legal/privacy" className="block text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
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
