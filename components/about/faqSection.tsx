import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { FAQ } from "@/types/about/about"

interface FAQSectionProps {
  title: string
  subtitle: string
  faqs: FAQ[]
}

export function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

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
    <section className="py-16 bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
            <p className="text-gray-300 mb-8">
              {subtitle}
            </p>
            <div className="hidden lg:block">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white px-6 py-3 rounded-md transition-all transform hover:scale-105"
              >
                Have more questions? <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-2 space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                className="bg-[#1a1a2e] rounded-lg overflow-hidden"
                variants={itemVariants}
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div
                  className={`px-6 pb-6 transition-all duration-300 ease-in-out ${
                    openFaq === index ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="lg:hidden col-span-1 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white px-6 py-3 rounded-md transition-all duration-300 border-0 transform hover:scale-105"
            >
              Have more questions? <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}