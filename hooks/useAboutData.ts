import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { AboutPage, CoreValue, TeamMember, FAQ } from '@/types/about/about'

export function useAboutData() {
    const [aboutData, setAboutData] = useState<AboutPage | null>(null)
    const [coreValues, setCoreValues] = useState<CoreValue[]>([])
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const supabase = createSupabaseBrowserClient()

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

    useEffect(() => {
        fetchAllData()
    }, [])

    return {
        aboutData,
        coreValues,
        teamMembers,
        faqs,
        isLoading,
        error
    }
}