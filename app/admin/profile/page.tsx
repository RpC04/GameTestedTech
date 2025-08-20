"use client"
import { useState, useEffect } from "react"
import React, { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { User, Mail, FileText, Camera, Save, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type Author = {
    id: string
    name: string
    email: string
    avatar_url: string | null
    bio: string | null
    created_at: string
    updated_at: string
}

export default function ProfileSettings() {
    const [author, setAuthor] = useState<Author | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const supabase = createSupabaseBrowserClient()

    useEffect(() => {
        fetchAuthorProfile()
    }, [])

    const fetchAuthorProfile = async () => {
        setIsLoading(true)
        try {
            // Get authenticated user
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) throw new Error("No authenticated user found")

            // Find the corresponding author
            const { data, error } = await supabase
                .from("authors")
                .select("*")
                .limit(1)
                .single()

            if (error) throw error
            setAuthor(data)
        } catch (error) {
            console.error("Error fetching author profile:", error)
            setError("Failed to load profile data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setAuthor(prev => prev ? { ...prev, [name]: value } : null)
        setError("")
        setSuccess("")
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !author) return

        setIsUploadingImage(true)
        setError("")

        try {
            if (author.avatar_url) {
                try {
                    const urlParts = author.avatar_url.split('/storage/v1/object/public/imagesblog/')
                    if (urlParts.length > 1) {
                        const oldFilePath = urlParts[1]
                        await supabase.storage.from("imagesblog").remove([oldFilePath])
                    }
                } catch (error) {
                    console.log("No se pudo borrar imagen anterior:", error)
                }
            }

            const fileExt = file.name.split('.').pop()
            const fileName = `${author.id}-${Date.now()}.${fileExt}`
            const filePath = `profile/${fileName}`

            // Upload file to bucket
            const { error: uploadError } = await supabase.storage
                .from("imagesblog")
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from("imagesblog")
                .getPublicUrl(filePath)

            const newAvatarUrl = publicUrlData?.publicUrl

            // Update database
            const { error: updateError } = await supabase
                .from("authors")
                .update({
                    avatar_url: newAvatarUrl,
                    updated_at: new Date().toISOString()
                })
                .eq("id", author.id)

            if (updateError) throw updateError

            // Update local state
            setAuthor(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null)
            setPreviewImage(newAvatarUrl)
            setSuccess("Profile image updated successfully!")

        } catch (error: any) {
            console.error("Error uploading image:", error)
            setError("Failed to upload image: " + (error.message || "Unknown error"))
        } finally {
            setIsUploadingImage(false)
        }
    }

    const handleSaveProfile = async () => {
        if (!author) return

        if (!author.name.trim()) {
            setError("Name is required")
            return
        }

        if (!author.email.trim()) {
            setError("Email is required")
            return
        }

        setIsSaving(true)
        setError("")
        setSuccess("")

        try {
            const { error } = await supabase
                .from("authors")
                .update({
                    name: author.name.trim(),
                    email: author.email.trim(),
                    bio: author.bio?.trim() || null,
                    updated_at: new Date().toISOString()
                })
                .eq("id", author.id)

            if (error) throw error

            setSuccess("Profile updated successfully!")

            // Update local updated_at
            setAuthor(prev => prev ? {
                ...prev,
                updated_at: new Date().toISOString()
            } : null)

        } catch (error: any) {
            console.error("Error updating profile:", error)
            setError("Failed to update profile: " + (error.message || "Unknown error"))
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9d8462]"></div>
            </div>
        )
    }

    if (!author) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Profile Not Found</h2>
                <p className="text-gray-400">Unable to load your profile information.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <div className="text-sm text-gray-400">
                    Last updated: {new Date(author.updated_at).toLocaleDateString()}
                </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Image Section */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <Camera className="h-5 w-5 text-[#9d8462]" />
                            Profile Picture
                        </h3>

                        <div className="text-center space-y-4">
                            {/* Avatar Display */}
                            <div className="relative mx-auto w-32 h-32">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700">
                                    {previewImage || author.avatar_url ? (
                                        <img
                                            src={previewImage || author.avatar_url || ""}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=128"
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="h-12 w-12 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Upload overlay */}
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            {/* Upload Button */}
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="avatar-upload"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={isUploadingImage}
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`block w-full bg-[#9d8462] hover:bg-[#8d7452] text-white py-2 px-4 rounded-md cursor-pointer transition-colors text-center ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isUploadingImage ? "Uploading..." : "Change Photo"}
                                </label>
                                <p className="text-xs text-gray-400">
                                    JPG, PNG or GIF. Max 5MB.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-[#9d8462]" />
                            Personal Information
                        </h3>

                        <div className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={author.name || ""}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462] transition-colors"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={author.email || ""}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462] transition-colors"
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bio Field */}
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                                    Bio
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={author.bio || ""}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462] transition-colors resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Brief description about yourself that will be shown on your articles.
                                </p>
                            </div>

                            {/* Account Info */}
                            <div className="bg-[#0a0a14] rounded-md p-4 border border-gray-800">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Account Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400">
                                    <div>
                                        <span className="block font-medium">Account ID:</span>
                                        <span className="font-mono">{author.id}</span>
                                    </div>
                                    <div>
                                        <span className="block font-medium">Member since:</span>
                                        <span>{new Date(author.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="bg-[#9d8462] hover:bg-[#8d7452] text-white px-6 py-2 flex items-center gap-2 min-w-[120px]"
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
                </div>
            </div>
        </div>
    )
}