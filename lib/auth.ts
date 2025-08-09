import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const isAdmin = async (): Promise<boolean> => {
  try {
    const supabase = createClientComponentClient()
    const { data: { session } } = await supabase.auth.getSession()

    // If authenticated = in table = is admin
    return !!session?.user?.id
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export const requireAdmin = async (): Promise<boolean> => {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    throw new Error('Unauthorized: Admin access required')
  }
  return true
}