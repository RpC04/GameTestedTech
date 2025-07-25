import { motion } from "framer-motion"

interface HeroSectionProps {
    title: string
    subtitle: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
    return (
        <div className="relative">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/80 to-[#0a0a14]"></div>
            </div>

            <div className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {title}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0a0a14] to-transparent"></div>
        </div>
    )
}