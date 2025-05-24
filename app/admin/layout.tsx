"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { LayoutDashboard, Tags, FileText, Tag, Inbox, Users, Settings, LogOut, Menu, X, AlertCircle } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar si las variables de entorno están disponibles
  const isMissingEnvVars =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "undefined" ||
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "undefined"

  // Solo crear el cliente si las variables de entorno están disponibles
  const supabase = !isMissingEnvVars ? createClientComponentClient() : null

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true)

      // Si faltan variables de entorno, mostrar error
      if (isMissingEnvVars) {
        setError(
          "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        )
        setIsLoading(false)
        return
      }

      try {
        const {
          data: { session },
        } = await supabase!.auth.getSession()

        if (!session) {
          // If not on login page, redirect to login
          if (pathname !== "/admin/login") {
            router.push("/admin/login")
          }
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(true)
          // If on login page, redirect to dashboard
          if (pathname === "/admin/login") {
            router.push("/admin/articles")
          }
        }
      } catch (err) {
        console.error("Auth check error:", err)
        setError("Authentication error. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (!isMissingEnvVars) {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [pathname, router, supabase, isMissingEnvVars])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      router.push("/admin/login")
    }
  }

  // Si hay un error con las variables de entorno, mostrar mensaje
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a14] text-gray-200 flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-3 text-red-400 mb-4">
            <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg mb-2">Configuration Error</h3>
              <p className="text-gray-300">{error}</p>
            </div>
          </div>
          <div className="bg-[#0a0a14] p-4 rounded-md text-sm font-mono mt-4">
            <p className="mb-2">Add these to your .env.local file:</p>
            <pre className="text-green-400">
              NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
              <br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
            </pre>
          </div>
          <p className="mt-4 text-sm text-gray-400">Get these values from your Supabase project settings.</p>
        </div>
      </div>
    )
  }

  // If loading or on login page, just render children
  if (isLoading || pathname === "/admin/login") {
    return <>{children}</>
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null
  }
{/* { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> }, */}
  const navItems = [
    
    { name: "Articles", href: "/admin/articles", icon: <FileText className="h-5 w-5" /> },
    { name: "Categories", href: "/admin/categories", icon: <Tag className="h-5 w-5" /> }, 
    { name: "Contact", href: "/admin/contact", icon: <Inbox className="h-5 w-5" /> },
    { name: "Tags", href: "/admin/tags", icon: <Tags className="h-5 w-5" /> }, 
  ]

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-200 flex">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1a1a2e] p-2 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition duration-200 ease-in-out md:relative md:flex z-40`}
      >
        <div className="w-64 bg-[#1a1a2e] h-full flex flex-col shadow-lg">
          <div className="p-4 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Game Tested Tech Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-game-white text-sm font-bold">
                GAME
                <br />
                TESTED TECH
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  pathname === item.href
                    ? "bg-[#9d8462]/20 text-white"
                    : "text-gray-400 hover:bg-[#1f1f3a] hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-gray-400 hover:bg-[#1f1f3a] hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
