import { motion } from "framer-motion"
import Image from "next/image"

interface MissionSectionProps {
  title: string
  content: string
}

export function MissionSection({ title, content }: MissionSectionProps) {
  return (
    <section className="py-16 bg-[#0f0f23]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
            <div className="space-y-4 text-gray-300">
              {content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="aspect-video relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/game-controller-logo.png"
                alt="Gaming setup being tested"
                fill
                className="object-contain max-w-[500px] max-h-[600px] m-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#9d8462]/20 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#0673b8]/20 rounded-full blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}