import Link from "next/link"
import Image from "next/image"
import ArticlesDropdown from "@/components/articles/articles-dropdown";
import { Search, Menu, X } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="w-full border-b border-gray-800"
      style={{
        backgroundImage: 'url("/images/cyberpunk-header.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="bg-[#0f0f23] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <motion.div
            className="flex items-center gap-8 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/KyleLogoNoText.png"
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

          {/* Search Bar - Responsive */}
          <SearchBar />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
            <Link href="/" className="text-game-white hover:text-game-cyan transition">
              Home
            </Link>
            <div className="relative">
              <ArticlesDropdown />
            </div>
            <Link href="/about" className="text-game-white hover:text-game-cyan transition">
              About Us
            </Link>
            <Link href="/contact" className="text-game-white hover:text-game-cyan transition">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative z-50 p-2 rounded-lg bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 hover:border-[#ff6b35] transition-all flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] shadow-2xl z-50 md:hidden overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header del menú */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/KyleLogoNoText.png"
                      alt="Game Tested Tech Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <span className="text-white text-sm font-bold">
                      GAME TESTED TECH
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#ff6b35]/20 hover:border-l-4 hover:border-[#ff6b35] transition-all group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-2 h-2 bg-[#ff6b35] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-white font-medium">Home</span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/articles"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#ff6b35]/20 hover:border-l-4 hover:border-[#ff6b35] transition-all group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-2 h-2 bg-[#ff6b35] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-white font-medium">Articles</span>
                  </Link>
                </motion.div> 

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/about"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#ff6b35]/20 hover:border-l-4 hover:border-[#ff6b35] transition-all group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-2 h-2 bg-[#ff6b35] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-white font-medium">About Us</span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#ff6b35]/20 hover:border-l-4 hover:border-[#ff6b35] transition-all group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-2 h-2 bg-[#ff6b35] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-white font-medium">Contact</span>
                  </Link>
                </motion.div>
              </div>

              {/* Footer del menú */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700 bg-[#0f0f23]/90">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Tech for Gamers, By Gamers
                  </p>
                  <div className="flex justify-center gap-4 mt-3">
                    <div className="text-center">
                      <div className="text-[#ff6b35] font-bold">500+</div>
                      <div className="text-gray-400 text-xs">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#ff6b35] font-bold">50K+</div>
                      <div className="text-gray-400 text-xs">Readers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#ff6b35] font-bold">20+</div>
                      <div className="text-gray-400 text-xs">Categories</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}