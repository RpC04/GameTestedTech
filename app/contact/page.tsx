"use client"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  MessageSquare,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState("")

  // Referencias para animaciones basadas en scroll
  const formRef = useRef(null)
  const infoRef = useRef(null)
  const faqRef = useRef(null)

  const formInView = useInView(formRef, { once: true, amount: 0.3 })
  const infoInView = useInView(infoRef, { once: true, amount: 0.3 })
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica
    if (!formState.name || !formState.email || !formState.message) {
      setFormError("Please fill in all required fields")
      return
    }

    if (!formState.email.includes("@")) {
      setFormError("Please enter a valid email address")
      return
    }

    setFormError("")
    setIsSubmitting(true)

    // Simulación de envío de formulario
    try {
      // En una aplicación real, aquí enviarías los datos a tu backend
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setFormError("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  // Animación de flotación para la imagen del controlador
  const floatAnimation = {
    y: [0, -15, 0],
    rotate: [0, 2, 0, -2, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-200 flex flex-col">
      <Header />

      {/* Hero Section con diseño mejorado */}
      <div className="relative w-full bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#ff6b35] blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#8fc9ff] blur-3xl"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left max-w-3xl mx-auto md:mx-0">
              <div className="inline-block mb-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#ff6b35]/10 mx-auto md:mx-0">
                  <MessageSquare className="h-8 w-8 text-[#ff6b35]" />
                </div>
              </div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Get In Touch
              </motion.h1>

              <motion.div
                className="text-gray-300 text-lg space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p>
                  For inquiries with Game Tested Tech, please direct your correspondence to the appropriate email
                  address below. We welcome user feedback and are committed to correcting any typographical errors or
                  factual inaccuracies.
                </p>
                <p>
                  For marketing-related matters, including direct marketing and advertising, please use the designated
                  email. For sponsorships or review partnership opportunities, please contact us via the partnerships
                  email.
                </p>
              </motion.div>

              <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white px-6 py-3 rounded-md transition-all transform hover:scale-105"
                >
                  Contact Form <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact-info"
                  className="inline-flex items-center gap-2 bg-transparent border border-gray-600 hover:border-white text-white px-6 py-3 rounded-md transition-all transform hover:scale-105"
                >
                  Contact Info <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Imagen del controlador con animación de flotación */}
            <div className="hidden md:flex justify-center items-center">
              <motion.div animate={floatAnimation} className="relative z-10">
                <Image
                  src="/images/game-controller-logo.png"
                  alt="Game Controller Logo"
                  width={300}
                  height={300}
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0a0a14] to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#0a0a14] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a1a2e] rounded-xl p-6 text-center transform transition-all hover:translate-y-[-5px] hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#ff6b35]/10 mb-4">
                <Clock className="h-6 w-6 text-[#ff6b35]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">24-48 Hours</h3>
              <p className="text-gray-400">Average Response Time</p>
            </div>

            <div className="bg-[#1a1a2e] rounded-xl p-6 text-center transform transition-all hover:translate-y-[-5px] hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#ff6b35]/10 mb-4">
                <Users className="h-6 w-6 text-[#ff6b35]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">10+ Team Members</h3>
              <p className="text-gray-400">Ready to Assist You</p>
            </div>

            <div className="bg-[#1a1a2e] rounded-xl p-6 text-center transform transition-all hover:translate-y-[-5px] hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#ff6b35]/10 mb-4">
                <MessageSquare className="h-6 w-6 text-[#ff6b35]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">1000+ Inquiries</h3>
              <p className="text-gray-400">Successfully Handled</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form with improved design */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 50 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
            className="relative"
            id="contact-form"
          >
            <div className="bg-[#0f0f23] rounded-xl overflow-hidden shadow-2xl relative z-10 border border-gray-800">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8fc9ff] via-[#ff6b35] to-[#8fc9ff]"></div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35]/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-[#ff6b35]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
                    <p className="text-gray-400">We'd love to hear from you</p>
                  </div>
                </div>

                {isSubmitted ? (
                  <motion.div
                    className="bg-[#1a2e1a] text-green-200 p-8 rounded-lg text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                      <svg className="h-8 w-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                    <p className="mb-4">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                    <Button
                      className="mt-4 bg-green-700 hover:bg-green-600 text-white"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <motion.div
                        className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formError}
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <Label
                          htmlFor="name"
                          className="block text-gray-300 mb-2 font-medium text-sm group-hover:text-white transition-colors"
                        >
                          YOUR NAME <span className="text-[#ff6b35]">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a2e] border-gray-700 text-white focus:ring-[#ff6b35] focus:border-[#ff6b35] rounded-md pl-10 h-12"
                            required
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-[#ff6b35] transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <Label
                          htmlFor="email"
                          className="block text-gray-300 mb-2 font-medium text-sm group-hover:text-white transition-colors"
                        >
                          EMAIL ADDRESS <span className="text-[#ff6b35]">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a2e] border-gray-700 text-white focus:ring-[#ff6b35] focus:border-[#ff6b35] rounded-md pl-10 h-12"
                            required
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-[#ff6b35] transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <Label
                        htmlFor="subject"
                        className="block text-gray-300 mb-2 font-medium text-sm group-hover:text-white transition-colors"
                      >
                        SUBJECT
                      </Label>
                      <div className="relative">
                        <Input
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          className="w-full bg-[#1a1a2e] border-gray-700 text-white focus:ring-[#ff6b35] focus:border-[#ff6b35] rounded-md pl-10 h-12"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-[#ff6b35] transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <Label
                        htmlFor="message"
                        className="block text-gray-300 mb-2 font-medium text-sm group-hover:text-white transition-colors"
                      >
                        YOUR MESSAGE <span className="text-[#ff6b35]">*</span>
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          rows={6}
                          className="w-full bg-[#1a1a2e] border-gray-700 text-white focus:ring-[#ff6b35] focus:border-[#ff6b35] rounded-md pl-10 resize-none"
                          required
                        />
                        <div className="absolute left-3 top-6 text-gray-500 group-hover:text-[#ff6b35] transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-gray-400">
                        <span className="text-[#ff6b35]">*</span> Required fields
                      </div>
                      <Button
                        type="submit"
                        className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white px-8 py-3 rounded-md transition-all transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#ff6b35]/20 flex items-center gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              <div className="bg-[#1a1a2e] p-4 border-t border-gray-800 flex items-center justify-between">
                <div className="text-gray-400 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Response time: 24-48 hours</span>
                </div>
                <div className="flex gap-3">
                  <a
                    href="mailto:contact@gametestedtech.com"
                    className="text-[#ff6b35] hover:text-white transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <a href="tel:+15551234567" className="text-[#ff6b35] hover:text-white transition-colors">
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information with improved design */}
          <motion.div
            ref={infoRef}
            initial={{ opacity: 0, y: 50 }}
            animate={infoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
            id="contact-info"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-1 bg-[#ff6b35] rounded-full"></span>
                Contact Information
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                We're here to help with any questions about gaming technology, reviews, or collaboration opportunities.
                Reach out through the form or use our contact details below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 transform transition-all hover:translate-y-[-5px] hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ff6b35]/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#ff6b35]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-2">Email</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">General Inquiries:</span>
                        <a
                          href="mailto:contact@gametestedtech.com"
                          className="text-gray-200 hover:text-[#ff6b35] transition-colors"
                        >
                          contact@gametestedtech.com
                        </a>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Marketing & Advertising:</span>
                        <a
                          href="mailto:marketing@gametestedtech.com"
                          className="text-gray-200 hover:text-[#ff6b35] transition-colors"
                        >
                          marketing@gametestedtech.com
                        </a>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Partnerships & Reviews:</span>
                        <a
                          href="mailto:partnerships@gametestedtech.com"
                          className="text-gray-200 hover:text-[#ff6b35] transition-colors"
                        >
                          partnerships@gametestedtech.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 transform transition-all hover:translate-y-[-5px] hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ff6b35]/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#ff6b35]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Phone</h3>
                    <a href="tel:+15551234567" className="text-gray-200 text-lg hover:text-[#ff6b35] transition-colors">
                      +1 (555) 123-4567
                    </a>
                    <p className="text-gray-400 mt-1">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 transform transition-all hover:translate-y-[-5px] hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ff6b35]/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#ff6b35]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Location</h3>
                    <p className="text-gray-200">123 Gaming Street</p>
                    <p className="text-gray-200">Tech City, TC 10101</p>
                    <p className="text-gray-400 mt-1">United States</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="bg-[#1a1a2e] p-4 rounded-full border border-gray-700 hover:border-[#ff6b35] hover:bg-[#ff6b35]/10 transition-all transform hover:scale-110"
                >
                  <Twitter className="h-5 w-5 text-gray-200 hover:text-[#ff6b35]" />
                </Link>
                <Link
                  href="#"
                  className="bg-[#1a1a2e] p-4 rounded-full border border-gray-700 hover:border-[#ff6b35] hover:bg-[#ff6b35]/10 transition-all transform hover:scale-110"
                >
                  <Instagram className="h-5 w-5 text-gray-200 hover:text-[#ff6b35]" />
                </Link>
                <Link
                  href="#"
                  className="bg-[#1a1a2e] p-4 rounded-full border border-gray-700 hover:border-[#ff6b35] hover:bg-[#ff6b35]/10 transition-all transform hover:scale-110"
                >
                  <Linkedin className="h-5 w-5 text-gray-200 hover:text-[#ff6b35]" />
                </Link>
                <Link
                  href="#"
                  className="bg-[#1a1a2e] p-4 rounded-full border border-gray-700 hover:border-[#ff6b35] hover:bg-[#ff6b35]/10 transition-all transform hover:scale-110"
                >
                  <Github className="h-5 w-5 text-gray-200 hover:text-[#ff6b35]" />
                </Link>
              </div>
            </div>

            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Business Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">Monday - Friday</span>
                  <span className="text-white font-medium bg-[#ff6b35]/10 px-3 py-1 rounded-full text-sm">
                    9:00 AM - 5:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">Saturday</span>
                  <span className="text-white font-medium bg-[#ff6b35]/10 px-3 py-1 rounded-full text-sm">
                    10:00 AM - 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Sunday</span>
                  <span className="text-white font-medium bg-gray-700/30 px-3 py-1 rounded-full text-sm">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section with improved design */}
        <motion.div
          ref={faqRef}
          initial={{ opacity: 0, y: 50 }}
          animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our services, response times, and collaboration opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#1f1f3a] rounded-xl p-6 border border-gray-800 shadow-lg transform transition-all hover:translate-y-[-5px]">
              <div className="flex items-start gap-3">
                <div className="bg-[#ff6b35]/10 p-2 rounded-full mt-1">
                  <ChevronRight className="h-4 w-4 text-[#ff6b35]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">How quickly do you respond to inquiries?</h3>
                  <p className="text-gray-300">
                    We aim to respond to all inquiries within 24-48 business hours. For urgent matters, please indicate
                    this in your subject line.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#1f1f3a] rounded-xl p-6 border border-gray-800 shadow-lg transform transition-all hover:translate-y-[-5px]">
              <div className="flex items-start gap-3">
                <div className="bg-[#ff6b35]/10 p-2 rounded-full mt-1">
                  <ChevronRight className="h-4 w-4 text-[#ff6b35]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Do you accept guest posts or contributions?</h3>
                  <p className="text-gray-300">
                    Yes! We welcome high-quality contributions from gaming enthusiasts and tech experts. Please contact
                    us with your proposal and writing samples.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#1f1f3a] rounded-xl p-6 border border-gray-800 shadow-lg transform transition-all hover:translate-y-[-5px]">
              <div className="flex items-start gap-3">
                <div className="bg-[#ff6b35]/10 p-2 rounded-full mt-1">
                  <ChevronRight className="h-4 w-4 text-[#ff6b35]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">How can I advertise on your website?</h3>
                  <p className="text-gray-300">
                    Please contact our marketing team at marketing@gametestedtech.com for advertising opportunities. We
                    offer various packages tailored to different needs and budgets.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#1f1f3a] rounded-xl p-6 border border-gray-800 shadow-lg transform transition-all hover:translate-y-[-5px]">
              <div className="flex items-start gap-3">
                <div className="bg-[#ff6b35]/10 p-2 rounded-full mt-1">
                  <ChevronRight className="h-4 w-4 text-[#ff6b35]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Can I request a specific product review?</h3>
                  <p className="text-gray-300">
                    We consider all review requests, though we cannot guarantee coverage of every product. Please
                    contact our partnerships team with details about your product.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Connect?</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            We're always looking to connect with gaming enthusiasts, industry partners, and tech reviewers. Reach out
            today and let's start a conversation!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact-form"
              className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white px-8 py-3 rounded-md transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              Send a Message
            </a>
            <a
              href="mailto:contact@gametestedtech.com"
              className="bg-transparent border border-gray-600 hover:border-white text-white px-8 py-3 rounded-md transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Mail className="h-5 w-5" />
              Email Us Directly
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-game-dark py-8 mt-auto border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
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
              <div className="flex items-center gap-2 pt-4">
                <span className="text-gray-400">✉</span>
                <a
                  href="mailto:contact@gametestedtech.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  contact@gametestedtech.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📞</span>
                <a href="tel:+11223456789" className="text-gray-400 hover:text-white transition-colors">
                  +1-1223-456-7890
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/articles" className="block text-gray-400 hover:text-white transition-colors">
                Articles
              </Link>
              <Link href="/categories" className="block text-gray-400 hover:text-white transition-colors">
                Categories
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-white font-bold mb-4">Follow Us</h3>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Youtube
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Discord
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Game Tested Tech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
