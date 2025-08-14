"use client"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button" 
import type { GeneralInfoTabProps } from "@/types/admin/about/types"

export function GeneralInfoTab({
    aboutPage,
    setAboutPage,
    onSave,
    isSaving
}: GeneralInfoTabProps) {
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