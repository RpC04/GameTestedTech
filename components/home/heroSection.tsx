"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants, floatAnimation } from "@/constants/home/animations";
import { heroStats } from "@/constants/home/data";

interface HeroSectionProps {
  isLoaded: boolean;
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
}

export const HeroSection = ({ isLoaded, isHovering, setIsHovering }: HeroSectionProps) => {
  return (
    <div className="relative w-full bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] overflow-hidden">
      {/* Decorative background */}
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
        />
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
                <p className="text-gray-300 mt-4">
                  Where Gaming Meets Innovation.
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
                  <Button 
                    variant="outline"
                    className="bg-transparent border border-gray-600 hover:border-white text-white px-6 py-3 rounded-md transition-all transform hover:scale-105"
                  >
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div className="flex gap-8 pt-4" variants={itemVariants}>
              {heroStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Controller Image */}
          <div className="hidden md:flex justify-center items-center">
            <motion.div animate={floatAnimation} className="relative">
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
  );
};