"use client"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useAboutData } from "@/hooks/useAboutData"
import { defaultAboutData } from "@/constants/about/about"
import { HeroSection } from "@/components/about/heroSection"
import { MissionSection } from "@/components/about/missionSection"
import { ValuesSection } from "@/components/about/valuesSection"
import { TeamSection } from "@/components/about/teamSection"
import { FAQSection } from "@/components/about/faqSection"

export default function AboutPage() {
  const { aboutData, coreValues, teamMembers, faqs, isLoading, error } = useAboutData()
  const pageData = aboutData || defaultAboutData

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Page</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-gray-200">
      <Header />
      
      <HeroSection title={pageData.hero_title} subtitle={pageData.hero_subtitle} />
      
      <MissionSection 
        title={pageData.mission_title} 
        content={pageData.mission_content} 
      />
      
      {coreValues.length > 0 && (
        <ValuesSection 
          title={pageData.values_title}
          subtitle={pageData.values_subtitle}
          values={coreValues}
        />
      )}
      
      {teamMembers.length > 0 && (
        <TeamSection 
          title={pageData.team_title}
          subtitle={pageData.team_subtitle}
          members={teamMembers}
        />
      )}
      
      {faqs.length > 0 && (
        <FAQSection 
          title={pageData.faq_title}
          subtitle={pageData.faq_subtitle}
          faqs={faqs}
        />
      )}
      
      {isLoading && <div>Loading...</div>}
      
      <Footer />
    </div>
  )
}