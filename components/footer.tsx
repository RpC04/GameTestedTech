"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Youtube, Instagram, Twitter, DiscIcon as Discord, Facebook } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.13,
            delayChildren: 0.2,
            duration: 0.5,
            type: "spring",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, type: "spring" },
    },
};

export default function FooterAnimated() {
    return (
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
                        {/* Si deseas los contactos, descomenta aquí */}
                        {/*
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
            */}
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
                        <motion.a
                            href="#"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                        >
                            <Youtube className="h-5 w-5" />
                            <span>Youtube</span>
                        </motion.a>
                        <motion.a
                            href="#"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                        >
                            <Instagram className="h-5 w-5" />
                            <span>Instagram</span>
                        </motion.a>
                        <motion.a
                            href="#"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                        >
                            <Twitter className="h-5 w-5" />
                            <span>Twitter</span>
                        </motion.a>
                        <motion.a
                            href="#"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                        >
                            <Discord className="h-5 w-5" />
                            <span>Discord</span>
                        </motion.a>
                        <motion.a
                            href="#"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                        >
                            <Facebook className="h-5 w-5" />
                            <span>Facebook</span>
                        </motion.a>
                    </motion.div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Game Tested Tech. All rights reserved.</p>
                </div>
            </div>
        </motion.footer>
    );
}
