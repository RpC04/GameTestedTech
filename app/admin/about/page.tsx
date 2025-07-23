"use client"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
    Plus,
    Edit3,
    Trash2,
    Save,
    AlertCircle,
    CheckCircle,
    Move,
    Eye,
    EyeOff,
    Camera,
    Users,
    HelpCircle,
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TeamMembersTab } from "@/components/admin/about/TeamMembersTab"

type AboutPage = {
    id: string
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
    updated_at: string
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

    // Estados para modales/formularios
    const [editingValue, setEditingValue] = useState<CoreValue | null>(null)
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
    const [showValueForm, setShowValueForm] = useState(false)
    const [showMemberForm, setShowMemberForm] = useState(false)
    const [showFaqForm, setShowFaqForm] = useState(false)

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

    // Función para guardar información general
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

    // Función para guardar/actualizar core value
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

    // Función para guardar/actualizar team member 
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
    // Función para guardar/actualizar FAQ
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

// Componente para la información general
function GeneralInfoTab({
    aboutPage,
    setAboutPage,
    onSave,
    isSaving
}: {
    aboutPage: AboutPage | null
    setAboutPage: (page: AboutPage) => void
    onSave: () => void
    isSaving: boolean
}) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (aboutPage) {
            setAboutPage({ ...aboutPage, [name]: value })
        }
    }

    if (!aboutPage) return null

    return (
        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-white mb-6">General Page Information</h3>

            <div className="space-y-6">
                {/* Hero Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hero Title
                        </label>
                        <input
                            type="text"
                            name="hero_title"
                            value={aboutPage.hero_title || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hero Subtitle
                        </label>
                        <input
                            type="text"
                            name="hero_subtitle"
                            value={aboutPage.hero_subtitle || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                    </div>
                </div>

                {/* Mission Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mission Title
                    </label>
                    <input
                        type="text"
                        name="mission_title"
                        value={aboutPage.mission_title || ""}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mission Content
                    </label>
                    <textarea
                        name="mission_content"
                        value={aboutPage.mission_content || ""}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                    />
                </div>

                {/* Values Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Values Title
                        </label>
                        <input
                            type="text"
                            name="values_title"
                            value={aboutPage.values_title || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Values Subtitle
                        </label>
                        <input
                            type="text"
                            name="values_subtitle"
                            value={aboutPage.values_subtitle || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                    </div>
                </div>

                {/* Team Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Team Title
                        </label>
                        <input
                            type="text"
                            name="team_title"
                            value={aboutPage.team_title || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Team Subtitle
                        </label>
                        <input
                            type="text"
                            name="team_subtitle"
                            value={aboutPage.team_subtitle || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            FAQ Title
                        </label>
                        <input
                            type="text"
                            name="faq_title"
                            value={aboutPage.faq_title || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            FAQ Subtitle
                        </label>
                        <input
                            type="text"
                            name="faq_subtitle"
                            value={aboutPage.faq_subtitle || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={onSave}
                        disabled={isSaving}
                        className="bg-[#9d8462] hover:bg-[#8d7452] text-white px-6 py-2 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Componente para Core Values
function CoreValuesTab({
    coreValues,
    onSave,
    onDelete,
    onToggleActive
}: {
    coreValues: CoreValue[]
    onSave: (value: Partial<CoreValue>) => void
    onDelete: (id: string) => void
    onToggleActive: (id: string, status: boolean) => void
}) {
    const [showForm, setShowForm] = useState(false)
    const [editingValue, setEditingValue] = useState<CoreValue | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const value = {
            id: editingValue?.id,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            icon_name: formData.get('icon_name') as string,
            color: formData.get('color') as string,
            is_active: true
        }
        onSave(value)
        setShowForm(false)
        setEditingValue(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Core Values</h3>
                <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add New Value
                </Button>
            </div>
            <h6 className="text-lg font-medium text-white">
                Remember that if you want to add valid icons visit:
                <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-[#9d8462] underline">Lucide React Icons</a>
            </h6>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md border border-gray-700">
                    <h4 className="text-lg font-medium text-white mb-4">
                        {editingValue ? 'Edit Core Value' : 'Add New Core Value'}
                    </h4>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={editingValue?.title || ""}
                                    required
                                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                    placeholder="e.g., Integrity"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Icon Name</label>
                                <input
                                    type="text"
                                    name="icon_name"
                                    defaultValue={editingValue?.icon_name || ""}
                                    className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                    placeholder="e.g., shield, lightbulb"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                            <input
                                type="text"
                                name="color"
                                defaultValue={editingValue?.color || "#9d8462"}
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                placeholder="#9d8462"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                defaultValue={editingValue?.description || ""}
                                required
                                rows={4}
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                placeholder="Describe this core value..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setEditingValue(null)
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#9d8462] hover:bg-[#8d7452] text-white">
                                Save Value
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Values List */}
            <div className="space-y-3">
                {coreValues.map((value, index) => (
                    <div
                        key={value.id}
                        className="bg-[#1a1a2e] rounded-lg p-4 flex items-center justify-between"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-2xl">{index + 1}</div>
                            <div>
                                <h4 className="text-white font-medium">{value.title}</h4>
                                <p className="text-gray-400 text-sm mt-1 max-w-md">{value.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500">Icon: {value.icon_name}</span>
                                    <span className="text-xs text-gray-500">Color: {value.color}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => onToggleActive(value.id, value.is_active)}
                                className={`p-2 ${value.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                            >
                                {value.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>

                            <Button
                                onClick={() => {
                                    setEditingValue(value)
                                    setShowForm(true)
                                }}
                                className="p-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <Edit3 className="h-4 w-4" />
                            </Button>

                            <Button
                                onClick={() => onDelete(value.id)}
                                className="p-2 bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {coreValues.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No core values added yet. Click "Add New Value" to get started.
                    </div>
                )}
            </div>
        </div>
    )
}

// Componente para FAQ
function FaqTab({
    faqs,
    onSave,
    onDelete,
    onToggleActive
}: {
    faqs: FAQ[]
    onSave: (faq: Partial<FAQ>) => void
    onDelete: (id: string) => void
    onToggleActive: (id: string, status: boolean) => void
}) {
    const [showForm, setShowForm] = useState(false)
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)

        const faq = {
            id: editingFaq?.id,
            question: formData.get('question') as string,
            answer: formData.get('answer') as string,
            is_active: true
        }

        onSave(faq)
        setShowForm(false)
        setEditingFaq(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Frequently Asked Questions</h3>
                <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add FAQ
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md border border-gray-700">
                    <h4 className="text-lg font-medium text-white mb-4">
                        {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                    </h4>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
                            <input
                                type="text"
                                name="question"
                                defaultValue={editingFaq?.question || ""}
                                required
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                placeholder="What is your question?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Answer</label>
                            <textarea
                                name="answer"
                                defaultValue={editingFaq?.answer || ""}
                                required
                                rows={6}
                                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                                placeholder="Provide a detailed answer..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setEditingFaq(null)
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#9d8462] hover:bg-[#8d7452] text-white">
                                Save FAQ
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* FAQ List */}
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <div
                        key={faq.id}
                        className="bg-[#1a1a2e] rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm bg-[#9d8462] text-white px-2 py-1 rounded">Q{index + 1}</span>
                                    {!faq.is_active && <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">Hidden</span>}
                                </div>
                                <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                                <p className="text-gray-400 text-sm">{faq.answer.substring(0, 200)}...</p>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    onClick={() => onToggleActive(faq.id, faq.is_active)}
                                    className={`p-2 ${faq.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                                >
                                    {faq.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>

                                <Button
                                    onClick={() => {
                                        setEditingFaq(faq)
                                        setShowForm(true)
                                    }}
                                    className="p-2 bg-blue-600 hover:bg-blue-700"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </Button>

                                <Button
                                    onClick={() => onDelete(faq.id)}
                                    className="p-2 bg-red-600 hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No FAQs added yet. Click "Add FAQ" to get started.
                    </div>
                )}
            </div>
        </div>
    )
}