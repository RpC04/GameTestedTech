"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Youtube, Instagram, Twitter, DiscIcon as Discord, Facebook } from "lucide-react";
import { AiOutlineDiscord } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { useAnalytics } from '@/hooks/use-analytics';

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
    const { trackEvent } = useAnalytics();

    const handleLogoClick = () => {
        trackEvent('logo_click', 'navigation', 'footer');
    };

    const handleNavigationClick = (destination: string) => {
        trackEvent('navigation_click', 'footer', destination);
    };

    const handleSocialClick = (platform: string) => {
        trackEvent('social_click', 'footer', platform);
    };

    return (
        <motion.footer
            className="bg-[#0a0a14] py-8 mt-auto border-t border-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={itemVariants}>
                            <Link 
                                href="/" 
                                className="flex items-center gap-2 mb-4"
                                onClick={handleLogoClick}
                            >
                                <Image
                                    src="/images/KyleLogoNoText.png"
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
                    </motion.div>

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
                            <Link 
                                href="/" 
                                className="block text-gray-400 hover:text-white transition-colors"
                                onClick={() => handleNavigationClick('home')}
                            >
                                Home
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link 
                                href="/articles" 
                                className="block text-gray-400 hover:text-white transition-colors"
                                onClick={() => handleNavigationClick('articles')}
                            >
                                Articles
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link 
                                href="/about" 
                                className="block text-gray-400 hover:text-white transition-colors"
                                onClick={() => handleNavigationClick('about')}
                            >
                                About Us
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link 
                                href="/contact" 
                                className="block text-gray-400 hover:text-white transition-colors"
                                onClick={() => handleNavigationClick('contact')}
                            >
                                Contact
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link 
                                href="/legal" 
                                className="block text-gray-400 hover:text-white transition-colors"
                                onClick={() => handleNavigationClick('legal')}
                            >
                                Legal
                            </Link>
                        </motion.div>
                    </motion.div>

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
                            href="https://discord.gg/hgkdMseg9n"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                            onClick={() => handleSocialClick('discord')}
                        >
                            <AiOutlineDiscord className="h-5 w-5" />
                            <span>Discord</span>
                        </motion.a>
                        <motion.a
                            href="https://www.facebook.com/gametestedtech"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                            onClick={() => handleSocialClick('facebook')}
                        >
                            <Facebook className="h-5 w-5" />
                            <span>Facebook</span>
                        </motion.a>
                        <motion.a
                            href="https://www.instagram.com/gametestedtech"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                            onClick={() => handleSocialClick('instagram')}
                        >
                            <Instagram className="h-5 w-5" />
                            <span>Instagram</span>
                        </motion.a>
                        <motion.a
                            href="https://x.com/GameTestedTech"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                            onClick={() => handleSocialClick('twitter')}
                        >
                            <FaXTwitter className="h-5 w-5" />
                            <span>X</span>
                        </motion.a>
                        <motion.a
                            href="https://www.youtube.com/@gametestedtech"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            variants={itemVariants}
                            onClick={() => handleSocialClick('youtube')}
                        >
                            <Youtube className="h-5 w-5" />
                            <span>Youtube</span>
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