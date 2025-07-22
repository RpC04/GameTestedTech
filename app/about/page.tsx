"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Twitter, Linkedin, Instagram, Facebook, Youtube, DiscIcon as Discord } from "lucide-react"

export default function AboutPage() {
  // Estado para controlar los acordeones de FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Datos para las preguntas frecuentes
  const faqs = [
    {
      question: "What is Game Tested Tech?",
      answer:
        "Game Tested Tech is a premier gaming technology review platform dedicated to providing honest, in-depth analyses of gaming hardware, software, and peripherals. Our team of experienced gamers and tech enthusiasts tests products in real gaming scenarios to deliver authentic insights that help our community make informed purchasing decisions.",
    },
    {
      question: "How do we test products?",
      answer:
        "Our testing methodology involves rigorous real-world gaming scenarios across multiple titles and genres. We evaluate products based on performance, build quality, user experience, and value for money. Each review includes benchmarks, comparative analyses, and long-term durability assessments to provide a comprehensive overview of each product's strengths and limitations.",
    },
    {
      question: "Can I submit products for review?",
      answer:
        "Yes! We welcome submissions from manufacturers and developers. Please contact our partnerships team at partnerships@gametestedtech.com with details about your product. While we cannot guarantee coverage of every submission, we review all inquiries and select products based on relevance to our audience and innovation in the gaming space.",
    },
  ]

  // Datos para el equipo
  const teamMembers = [
    {
      name: "Alex Rodriguez",
      role: "Founder & Lead Hardware Reviewer",
      bio: "Gaming hardware enthusiast with over 15 years of experience in the industry. Previously worked as a hardware engineer at major gaming companies.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    }
  ]

  // Variantes de animación
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
    <div className="min-h-screen bg-[#0f0f23] text-gray-200">
      <Header />

      {/* Hero Section */}
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Game Tested Tech</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your trusted source for honest gaming hardware reviews, guides, and tech insights since 2025.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0a0a14] to-transparent"></div>
      </div>

      {/* Our Mission Section */}
      <section className="py-16 bg-[#0f0f23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  At Game Tested Tech, we believe that gamers deserve honest, thorough, and unbiased reviews of the
                  technology that powers their passion. Our mission is to cut through marketing hype and provide
                  real-world insights based on extensive testing in actual gaming scenarios.
                </p>
                <p>
                  We test every product in real gaming environments, pushing hardware to its limits to reveal its true
                  capabilities and limitations. Whether you're a casual player or a competitive esports athlete, our
                  goal is to help you make informed decisions about your gaming setup.
                </p>
                <p>
                  Beyond reviews, we're committed to educating our community through in-depth guides, tutorials, and
                  analysis of emerging technologies. We believe that knowledge is power, and we're here to empower
                  gamers worldwide.
                </p>
              </div>
              {/*  
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/articles">
                  <Button className="bg-[#9d8462] hover:bg-[#9d8462] text-white">Our Reviews</Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="bg-transparent hover:bg-transparent border-2 border-[#9d8462] hover:border-[#9d8462] text-white hover:text-white"
                  >
                    Join Our Team
                  </Button>
                </Link>
              </div>*/}
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

      {/* Our Values Section */}
      <section className="py-16 bg-[#0a0a14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do at Game Tested Tech
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
            <div className="hidden md:block"></div>
            <motion.div
              className="bg-[#1a1a2e] rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-[#9d8462]/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#9d8462]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Integrity</h3>
              <p className="text-gray-300">
                We maintain complete editorial independence and never compromise our reviews for financial gain. Our
                opinions are honest, unbiased, and based solely on thorough testing.
              </p>
            </motion.div>
            {/*
            <motion.div
              className="bg-[#1a1a2e] rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-[#0673b8]/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#0673b8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Thoroughness</h3>
              <p className="text-gray-300">
                We don't rush our reviews. Each product undergoes extensive testing in real gaming environments to
                ensure our assessments reflect the actual user experience.
              </p>
            </motion.div>
*/}
            <motion.div
              className="bg-[#1a1a2e] rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-[#ff8c5a]/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#ff8c5a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community</h3>
              <p className="text-gray-300">
                We value our community of gamers and tech enthusiasts. Your feedback shapes our content, and we're
                committed to creating resources that genuinely help our audience.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-16 bg-[#0f0f23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The passionate gamers and tech experts behind Game Tested Tech
            </p>
          </motion.div>
          {/* */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="hidden md:block"></div>
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a2e] rounded-lg overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-square">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name || "Team member"} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-[#9d8462] mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  <div className="flex gap-3">
                    <a
                      href={member.social?.twitter || "#"}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a
                      href={member.social?.linkedin || "#"}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="hidden md:block"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <p className="text-gray-300 mb-8">
                Find answers to common questions about our review process, team, and mission.
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
                <motion.div key={index} className="bg-[#1a1a2e] rounded-lg overflow-hidden" variants={itemVariants}>
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
                    className={`px-6 pb-6 transition-all duration-300 ease-in-out ${openFaq === index ? "block opacity-100" : "hidden opacity-0"
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

      {/* Contact Section 
      <section className="py-16 bg-[#0f0a1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
              <p className="text-gray-300 mb-8">
                Have questions, feedback, or partnership inquiries? We'd love to hear from you. Reach out to our team
                using the contact information below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#9d8462]/20 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#9d8462]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Email</h3>
                    <div className="space-y-1">
                      <p className="text-gray-300">General Inquiries:</p>
                      <a
                        href="mailto:contact@gametestedtech.com"
                        className="text-[#9d8462] hover:text-white transition-colors"
                      >
                        contact@gametestedtech.com
                      </a>
                    </div>
                    <div className="space-y-1 mt-3">
                      <p className="text-gray-300">Partnerships:</p>
                      <a
                        href="mailto:partnerships@gametestedtech.com"
                        className="text-[#9d8462] hover:text-white transition-colors"
                      >
                        partnerships@gametestedtech.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#9d8462]/20 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#9d8462]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Phone</h3>
                    <a href="tel:+11223456789" className="text-[#9d8462] hover:text-white transition-colors">
                      +1-1223-456-7890
                    </a>
                    <p className="text-gray-300 mt-1">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#9d8462]/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#9d8462]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Location</h3>
                    <p className="text-gray-300">123 Gaming Street</p>
                    <p className="text-gray-300">Tech City, TC 10101</p>
                    <p className="text-gray-300">United States</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#1a1a2e] rounded-lg p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462] resize-none"
                  ></textarea>
                </div>
                <Button className="w-full bg-[#9d8462] hover:bg-[#9d8462] text-white py-3">Send Message</Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
*/}
      {/* Footer */}
      <Footer />
    </div>
  )
}
