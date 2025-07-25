"use client"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AlertCircle, CheckCircle, Users, HelpCircle, FileText } from "lucide-react"
import { TeamMembersTab } from "@/components/admin/about/TeamMembersTab"
import { GeneralInfoTab } from "@/components/admin/about/GeneralInfoTab"
import { CoreValuesTab } from "@/components/admin/about/CoreValuesTab"
import { FaqTab } from "@/components/admin/about/FaqTab"
import type { AboutPage, CoreValue, TeamMember, FAQ } from "@/types/admin/about/types" 


export default function AboutPageSettings() {
    const [aboutPage, setAboutPage] = useState<AboutPage | null>(null)
    const [coreValues, setCoreValues] = useState<CoreValue[]>([])
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [faqs, setFaqs] = useState<FAQ[]>([])

    const [activeTab, setActiveTab] = useState<'general' | 'values' | 'team' | 'faq'>('general')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // States for modals/forms
    const [setEditingValue] = useState<CoreValue | null>(null) 
    const [setEditingFaq] = useState<FAQ | null>(null)
    const [setShowValueForm] = useState(false) 
    const [setShowFaqForm] = useState(false)

    const supabase = createClientComponentClient()

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        setIsLoading(true)
        try {
            // Fetch about page info
            const { data: aboutData, error: aboutError } = await supabase
                .from('about_page')
                .select('*')
                .single()

            if (aboutError && aboutError.code !== 'PGRST116') throw aboutError
            setAboutPage(aboutData)

            // Fetch core values
            const { data: valuesData, error: valuesError } = await supabase
                .from('core_values')
                .select('*')
                .order('order_position')

            if (valuesError) throw valuesError
            setCoreValues(valuesData || [])

            // Fetch team members
            const { data: teamData, error: teamError } = await supabase
                .from('team_members')
                .select('*')
                .order('order_position')

            if (teamError) throw teamError
            setTeamMembers(teamData || [])

            // Fetch FAQs
            const { data: faqData, error: faqError } = await supabase
                .from('faqs')
                .select('*')
                .order('order_position')

            if (faqError) throw faqError
            setFaqs(faqData || [])

        } catch (error: any) {
            console.error('Error fetching data:', error)
            setError('Failed to load data: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Function to save general information
    const saveGeneralInfo = async () => {
        if (!aboutPage) return

        setIsSaving(true)
        setError("")
        setSuccess("")

        try {
            const { error } = await supabase
                .from('about_page')
                .upsert({
                    ...aboutPage,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error
            setSuccess("General information updated successfully!")

        } catch (error: any) {
            setError("Failed to save: " + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    // Function to save/update core value
    const saveCoreValue = async (value: Partial<CoreValue>) => {
        try {
            if (value.id) {
                // Update existing
                const { error } = await supabase
                    .from('core_values')
                    .update({
                        ...value,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', value.id)

                if (error) throw error
            } else {
                // Create new
                const { error } = await supabase
                    .from('core_values')
                    .insert([{
                        ...value,
                        order_position: coreValues.length
                    }])

                if (error) throw error
            }

            fetchAllData()
            setShowValueForm(false)
            setEditingValue(null)
            setSuccess("Core value saved successfully!")

        } catch (error: any) {
            setError("Failed to save core value: " + error.message)
        }
    }

    // Function to save/update team member
    const saveTeamMember = async (member: Partial<TeamMember>) => {
        try {
            if (member.id) {
                // Update existing - mantener el ID existente
                const { error } = await supabase
                    .from('team_members')
                    .update({
                        name: member.name,
                        role: member.role,
                        bio: member.bio,
                        image_url: member.image_url,
                        twitter_url: member.twitter_url,
                        linkedin_url: member.linkedin_url,
                        instagram_url: member.instagram_url,
                        is_active: member.is_active,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', member.id)

                if (error) throw error
            } else {
                // Create new - NO incluir el campo id, que se genere automáticamente
                const { error } = await supabase
                    .from('team_members')
                    .insert([{
                        name: member.name,
                        role: member.role,
                        bio: member.bio,
                        image_url: member.image_url,
                        twitter_url: member.twitter_url,
                        linkedin_url: member.linkedin_url,
                        instagram_url: member.instagram_url,
                        is_active: member.is_active || true,
                        order_position: teamMembers.length
                        // NO incluir 'id' aquí - se genera automáticamente
                    }])

                if (error) throw error
            }

            fetchAllData()
            setSuccess("Team member saved successfully!")

        } catch (error: any) {
            setError("Failed to save team member: " + error.message)
        }
    }
    // Function to save/update FAQ
    const saveFaq = async (faq: Partial<FAQ>) => {
        try {
            if (faq.id) {
                // Update existing
                const { error } = await supabase
                    .from('faqs')
                    .update({
                        ...faq,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', faq.id)

                if (error) throw error
            } else {
                // Create new
                const { error } = await supabase
                    .from('faqs')
                    .insert([{
                        ...faq,
                        order_position: faqs.length
                    }])

                if (error) throw error
            }

            fetchAllData()
            setShowFaqForm(false)
            setEditingFaq(null)
            setSuccess("FAQ saved successfully!")

        } catch (error: any) {
            setError("Failed to save FAQ: " + error.message)
        }
    }

    // Function to delete items
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

    // Function to toggle active/inactive
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9d8462]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">About Page Settings</h1>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-900/30 border border-green-700 text-green-200 p-4 rounded-lg flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{success}</p>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="border-b border-gray-700">
                <nav className="flex space-x-8">
                    {[
                        { key: 'general', label: 'General Info', icon: FileText },
                        { key: 'values', label: 'Core Values', icon: HelpCircle },
                        { key: 'team', label: 'Team Members', icon: Users },
                        { key: 'faq', label: 'FAQ', icon: HelpCircle }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as any)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === key
                                ? 'border-[#9d8462] text-[#9d8462]'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'general' && (
                    <GeneralInfoTab
                        aboutPage={aboutPage}
                        setAboutPage={setAboutPage}
                        onSave={saveGeneralInfo}
                        isSaving={isSaving}
                    />
                )}

                {activeTab === 'values' && (
                    <CoreValuesTab
                        coreValues={coreValues}
                        onSave={saveCoreValue}
                        onDelete={(id) => deleteItem('core_values', id)}
                        onToggleActive={(id, status) => toggleActive('core_values', id, status)}
                    />
                )}

                {activeTab === 'team' && (
                    <TeamMembersTab
                        teamMembers={teamMembers}
                        onSave={saveTeamMember}
                        onDelete={(id) => deleteItem('team_members', id)}
                        onToggleActive={(id, status) => toggleActive('team_members', id, status)}
                    />
                )}

                {activeTab === 'faq' && (
                    <FaqTab
                        faqs={faqs}
                        onSave={saveFaq}
                        onDelete={(id) => deleteItem('faqs', id)}
                        onToggleActive={(id, status) => toggleActive('faqs', id, status)}
                    />
                )}
            </div>
        </div>
    )
}