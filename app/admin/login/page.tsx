"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Mail, Lock, AlertCircle } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [configError, setConfigError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Verificar si las variables de entorno están disponibles
  const isMissingEnvVars =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "undefined" ||
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "undefined"

  // Solo crear el cliente si las variables de entorno están disponibles
  const supabase = !isMissingEnvVars ? createClientComponentClient() : null

  useEffect(() => {
    if (isMissingEnvVars) {
      setConfigError(
        "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      )
    }
  }, [isMissingEnvVars])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isMissingEnvVars || !supabase) {
      setError("Cannot login: Supabase configuration is missing")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push("/admin")
    } catch (error: any) {
      setError(error.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  // Si hay un error con las variables de entorno, mostrar mensaje
  if (configError) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-3 text-red-400 mb-4">
            <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg mb-2">Configuration Error</h3>
              <p className="text-gray-300">{configError}</p>
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

  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a2e] rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <Image
                src="/images/logo.png"
                alt="Game Tested Tech Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Dashboard</h1>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-[#0a0a14] text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-[#0a0a14] text-white focus:outline-none focus:ring-2 focus:ring-[#9d8462] focus:border-[#9d8462]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9d8462] hover:bg-[#8d7452] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9d8462] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>

          <div className="px-8 py-4 bg-[#1f1f3a] border-t border-gray-800 text-center">
            <p className="text-xs text-gray-400">This is a restricted area. Unauthorized access is prohibited.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
