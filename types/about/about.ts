export type AboutPage = {
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

export type CoreValue = {
  id: string
  title: string
  description: string
  icon_name: string
  color: string
  order_position: number
  is_active: boolean
}

export type TeamMember = {
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

export type FAQ = {
  id: string
  question: string
  answer: string
  order_position: number
  is_active: boolean
}