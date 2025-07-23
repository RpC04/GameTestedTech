"use client"
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button" 

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

interface TeamMembersTabProps {
  teamMembers: TeamMember[]
  onSave: (member: Partial<TeamMember>) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, status: boolean) => void
}

export function TeamMembersTab({ 
  teamMembers, 
  onSave, 
  onDelete, 
  onToggleActive 
}: TeamMembersTabProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  
  const supabase = createClientComponentClient()

  // Función para extraer el path de la imagen desde la URL
  const getImagePathFromUrl = (imageUrl: string): string | null => {
    if (!imageUrl) return null
    
    try {
      // Extraer el path después de '/storage/v1/object/public/imagesweb/'
      const urlParts = imageUrl.split('/storage/v1/object/public/imagesweb/')
      if (urlParts.length > 1) {
        return urlParts[1]
      }
      return null
    } catch (error) {
      console.error('Error extracting image path:', error)
      return null
    }
  }

  // Función para borrar imagen del bucket
  const deleteImageFromBucket = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) return

    try {
      const imagePath = getImagePathFromUrl(imageUrl)
      if (imagePath) {
        const { error } = await supabase.storage
          .from("imagesweb")
          .remove([imagePath])

        if (error) {
          console.error('Error deleting image from bucket:', error)
        } else {
          console.log('Image deleted successfully:', imagePath)
        }
      }
    } catch (error) {
      console.error('Error in deleteImageFromBucket:', error)
    }
  }

  // Función para subir imagen
  const uploadImage = async (file: File, memberId?: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `team-${memberId || Date.now()}-${Date.now()}.${fileExt}`
      const filePath = `aboutPage/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("imagesweb")
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from("imagesweb")
        .getPublicUrl(filePath)

      return publicUrlData?.publicUrl || null
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    let imageUrl = editingMember?.image_url || null
    
    // Handle image upload if a file was selected
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
      setIsUploadingImage(true)
      
      try {
        // Si estamos editando y ya hay una imagen, borrar la anterior
        if (editingMember?.image_url) {
          await deleteImageFromBucket(editingMember.image_url)
        }

        // Subir nueva imagen
        const newImageUrl = await uploadImage(imageFile, editingMember?.id)
        imageUrl = newImageUrl

      } catch (error: any) {
        console.error('Error handling image:', error)
        alert('Error uploading image: ' + (error.message || 'Unknown error'))
        setIsUploadingImage(false)
        return
      } finally {
        setIsUploadingImage(false)
      }
    }

    const member = {
      id: editingMember?.id,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      bio: formData.get('bio') as string,
      image_url: imageUrl,
      twitter_url: formData.get('twitter_url') as string || null,
      linkedin_url: formData.get('linkedin_url') as string || null,
      instagram_url: formData.get('instagram_url') as string || null,
      is_active: true
    }
    
    onSave(member)
    setShowForm(false)
    setEditingMember(null)
  }

  // Función para borrar miembro (incluyendo su imagen)
  const handleDelete = async (member: TeamMember) => {
    if (confirm(`Are you sure you want to delete ${member.name}?`)) {
      try {
        // Borrar imagen del bucket primero
        if (member.image_url) {
          await deleteImageFromBucket(member.image_url)
        }
        
        // Luego borrar el miembro de la base de datos
        onDelete(member.id)
      } catch (error) {
        console.error('Error deleting member:', error)
        alert('Error deleting member. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Team Members</h3>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-[#9d8462] hover:bg-[#8d7452] text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md border border-gray-700">
          <h4 className="text-lg font-medium text-white mb-4">
            {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingMember?.name || ""}
                  required
                  className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  defaultValue={editingMember?.role || ""}
                  required
                  className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                disabled={isUploadingImage}
                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] disabled:opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG or GIF. Max 5MB. Images will be stored in aboutPage folder.
              </p>
              
              {/* Current image preview */}
              {editingMember?.image_url && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Current image:</p>
                  <img 
                    src={editingMember.image_url} 
                    alt="Current" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  />
                </div>
              )}

              {/* Upload status */}
              {isUploadingImage && (
                <div className="mt-2 flex items-center gap-2 text-sm text-yellow-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-400"></div>
                  Uploading image...
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                name="bio"
                defaultValue={editingMember?.bio || ""}
                rows={4}
                className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                placeholder="Brief description about this team member..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Twitter URL</label>
                <input
                  type="url"
                  name="twitter_url"
                  defaultValue={editingMember?.twitter_url || ""}
                  className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin_url"
                  defaultValue={editingMember?.linkedin_url || ""}
                  className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram URL</label>
                <input
                  type="url"
                  name="instagram_url"
                  defaultValue={editingMember?.instagram_url || ""}
                  className="w-full bg-[#0a0a14] border border-gray-700 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462]"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingMember(null)
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white"
                disabled={isUploadingImage}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#9d8462] hover:bg-[#8d7452] text-white"
                disabled={isUploadingImage}
              >
                {isUploadingImage ? "Uploading..." : "Save Member"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-[#1a1a2e] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {member.image_url ? (
                  <img 
                    src={member.image_url} 
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-lg font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-white font-medium">{member.name}</h4>
                  <p className="text-[#9d8462] text-sm">{member.role}</p>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  onClick={() => onToggleActive(member.id, member.is_active)}
                  className={`p-1 ${member.is_active ? 'bg-green-600' : 'bg-gray-600'}`}
                  title={member.is_active ? 'Hide member' : 'Show member'}
                >
                  {member.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                
                <Button
                  onClick={() => {
                    setEditingMember(member)
                    setShowForm(true)
                  }}
                  className="p-1 bg-blue-600 hover:bg-blue-700"
                  title="Edit member"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                
                <Button
                  onClick={() => handleDelete(member)}
                  className="p-1 bg-red-600 hover:bg-red-700"
                  title="Delete member"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {member.bio && (
              <p className="text-gray-400 text-sm mb-3">
                {member.bio.length > 100 ? `${member.bio.substring(0, 100)}...` : member.bio}
              </p>
            )}
            
            <div className="flex gap-2 flex-wrap">
              {member.twitter_url && (
                <span className="text-xs bg-blue-600 px-2 py-1 rounded">Twitter</span>
              )}
              {member.linkedin_url && (
                <span className="text-xs bg-blue-800 px-2 py-1 rounded">LinkedIn</span>
              )}
              {member.instagram_url && (
                <span className="text-xs bg-pink-600 px-2 py-1 rounded">Instagram</span>
              )}
            </div>
          </div>
        ))}
        
        {teamMembers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400">
            No team members added yet. Click "Add Team Member" to get started.
          </div>
        )}
      </div>
    </div>
  )
}