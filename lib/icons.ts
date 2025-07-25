import * as LucideIcons from "lucide-react"

export const getIconComponent = (iconName: string) => {
  const iconComponentName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  const IconComponent = (LucideIcons as any)[iconComponentName]
  return IconComponent || LucideIcons.Shield
}