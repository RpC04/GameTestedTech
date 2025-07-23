"use client"
import { useState, useEffect, JSX } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { TeamMembersTab } from "@/components/admin/about/TeamMembersTab"

// Types
type AboutPage = {
  hero_title: string
  hero_subtitle: string
  mission_title: string
  mission_content: string
  values_title: string
  values_subtitle: string
  team_title: string
  team_subtitle: string
  faq_title: string
  faq_subtitle: string
}

type CoreValue = {
  id: string
  title: string
  description: string
  icon_name: string
  color: string
  order_position: number
  is_active: boolean
}

type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  image_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  instagram_url: string | null
  order_position: number
  is_active: boolean
}

type FAQ = {
  id: string
  question: string
  answer: string
  order_position: number
  is_active: boolean
}

export default function AboutPage() {   
  
  // Estados de UI
  const [activeTab, setActiveTab] = useState<'general' | 'values' | 'team' | 'faq'>('general') 
  const [isSaving, setIsSaving] = useState(false) 
  const [success, setSuccess] = useState("")
  // Estados para los datos
  const [aboutData, setAboutData] = useState<AboutPage | null>(null)
  const [coreValues, setCoreValues] = useState<CoreValue[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Estado para controlar los acordeones de FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const supabase = createClientComponentClient()

  // Fetch todos los datos al cargar la página
  useEffect(() => {
    fetchAllData()
  }, [])

  const getIconComponent = (iconName: string) => {
    // Convertir el nombre a PascalCase (ej: "heart" -> "Heart", "user-plus" -> "UserPlus")
    const iconComponentName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    // Obtener el componente del ícono
    const IconComponent = (LucideIcons as any)[iconComponentName]

    // Si no existe, usar Shield como default
    return IconComponent || LucideIcons.Shield
  }

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      // Fetch about page general info
      const { data: aboutPageData, error: aboutError } = await supabase
        .from('about_page')
        .select('*')
        .single()

      if (aboutError && aboutError.code !== 'PGRST116') {
        console.error('About page error:', aboutError)
      } else {
        setAboutData(aboutPageData)
      }

      // Fetch core values (solo activos)
      const { data: valuesData, error: valuesError } = await supabase
        .from('core_values')
        .select('*')
        .eq('is_active', true)
        .order('order_position')

      if (valuesError) {
        console.error('Values error:', valuesError)
      } else {
        setCoreValues(valuesData || [])
      }

      // Fetch team members (solo activos)
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_position')

      if (teamError) {
        console.error('Team error:', teamError)
      } else {
        setTeamMembers(teamData || [])
      }

      // Fetch FAQs (solo activos)
      const { data: faqData, error: faqError } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_position')

      if (faqError) {
        console.error('FAQ error:', faqError)
      } else {
        setFaqs(faqData || [])
      }

    } catch (error: any) {
      console.error('Error fetching data:', error)
      setError('Failed to load page data')
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener ícono SVG por nombre
  const getIconSvg = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      shield: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      ),
      lightbulb: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      ),
      users: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      target: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
        />
      ),
      heart: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      )
    }

    return icons[iconName] || icons.shield
  }

  // Valores por defecto si no hay datos en la base de datos
  const defaultAboutData: AboutPage = {
    hero_title: "About Game Tested Tech",
    hero_subtitle: "Your trusted source for honest gaming hardware reviews, guides, and tech insights since 2025.",
    mission_title: "Our Mission",
    mission_content: "At Game Tested Tech, we believe that gamers deserve honest, thorough, and unbiased reviews of the technology that powers their passion. Our mission is to cut through marketing hype and provide real-world insights based on extensive testing in actual gaming scenarios.",
    values_title: "Our Core Values",
    values_subtitle: "These principles guide everything we do at Game Tested Tech",
    team_title: "Meet Our Team",
    team_subtitle: "The passionate gamers and tech experts behind Game Tested Tech",
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Find answers to common questions about our review process, team, and mission."
  }

  // Usar datos por defecto si no hay datos de la base de datos
  const pageData = aboutData || defaultAboutData

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

  // Función para guardar/actualizar team member (NO maneja imágenes, eso lo hace el componente)
  const saveTeamMember = async (member: Partial<TeamMember>) => {
    try {
      if (member.id) {
        // Update existing
        const { error } = await supabase
          .from('team_members')
          .update({
            ...member,
            updated_at: new Date().toISOString()
          })
          .eq('id', member.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('team_members')
          .insert([{
            ...member,
            order_position: teamMembers.length
          }])

        if (error) throw error
      }

      fetchAllData()
      setSuccess("Team member saved successfully!")

    } catch (error: any) {
      setError("Failed to save team member: " + error.message)
    }
  }

  // Función para eliminar elementos
  const deleteItem = async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchAllData()
      setSuccess("Item deleted successfully!")

    } catch (error: any) {
      setError("Failed to delete item: " + error.message)
    }
  }

  // Función para toggle active/inactive
  const toggleActive = async (table: string, id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchAllData()

    } catch (error: any) {
      setError("Failed to update status: " + error.message)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Page</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#9d8462] hover:bg-[#8d7452] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {pageData.hero_title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {pageData.hero_subtitle}
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
              <h2 className="text-3xl font-bold text-white mb-6">{pageData.mission_title}</h2>
              <div className="space-y-4 text-gray-300">
                {pageData.mission_content.split('\n').map((paragraph, index) => (
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

      {/* Our Values Section */}
      {coreValues.length > 0 && (
        <section className="py-16 bg-[#0a0a14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">{pageData.values_title}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {pageData.values_subtitle}
              </p>
            </motion.div>

            {/* Flex container que se mantiene centrado automáticamente */}
            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.id}
                  className="bg-[#1a1a2e] rounded-lg p-6 shadow-lg w-full sm:w-80 md:w-80 lg:w-80 flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${value.color}20` }}
                  >
                    {(() => {
                      const IconComponent = getIconComponent(value.icon_name)
                      return (
                        <IconComponent
                          className="h-6 w-6"
                          style={{ color: value.color }}
                        />
                      )
                    })()}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meet Our Team Section */}
      {activeTab === 'team' && (
        <TeamMembersTab
          teamMembers={teamMembers}
          onSave={saveTeamMember}
          onDelete={(id) => deleteItem('team_members', id)}
          onToggleActive={(id, status) => toggleActive('team_members', id, status)}
        />
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
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
                <h2 className="text-3xl font-bold text-white mb-6">{pageData.faq_title}</h2>
                <p className="text-gray-300 mb-8">
                  {pageData.faq_subtitle}
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
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="py-16 bg-[#0f0f23]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9d8462]"></div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}