"use client"
import { useEffect } from 'react'

// Declarar el tipo global para gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void
    dataLayer: any[]
  }
}

export const useAnalytics = () => {
  // Función para trackear eventos personalizados
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  // Función para trackear páginas vistas
  const trackPageView = (url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-1T725ZRJ6N', {
        page_path: url,
        page_title: title,
      })
    }
  }

  // Función para trackear conversiones (artículos leídos, etc.)
  const trackConversion = (eventName: string, parameters?: object) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        send_to: 'G-1T725ZRJ6N'
      })
    }
  }

  return { trackEvent, trackPageView, trackConversion }
}

// Hook para trackear automáticamente cuando cambia la ruta
export const usePageTracking = () => {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    // Track la página inicial
    trackPageView(window.location.pathname, document.title)
  }, [trackPageView])
}