"use client"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FileText, Tag, Users, Eye, MessageSquare, TrendingUp, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    users: 0,
    views: 0,
    comments: 0,
  })
  const [recentArticles, setRecentArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(true)

  // Verificar si las variables de entorno están disponibles
  const isMissingEnvVars =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "undefined" ||
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "undefined"

  // Solo crear el cliente si las variables de entorno están disponibles
  const supabase = !isMissingEnvVars ? createClientComponentClient() : null

  useEffect(() => {
    if (isMissingEnvVars) {
      setIsConfigured(false)
      setIsLoading(false)
      return
    }

    async function fetchDashboardData() {
      setIsLoading(true)
      try {
        // Fetch article count
        const { count: articlesCount, error: articlesError } = await supabase!
          .from("articles")
          .select("*", { count: "exact", head: true })

        if (articlesError) {
          // Si hay un error al consultar la tabla, probablemente no está configurada
          setIsConfigured(false)
          return
        }

        // Fetch category count
        const { count: categoriesCount } = await supabase!
          .from("categories")
          .select("*", { count: "exact", head: true })

        // Fetch recent articles
        const { data: articles } = await supabase!
          .from("articles")
          .select("id, title, created_at, views, status")
          .order("created_at", { ascending: false })
          .limit(5)

        // Update stats
        setStats({
          articles: articlesCount || 0,
          categories: categoriesCount || 0,
          users: 3, // Placeholder
          views: 12500, // Placeholder
          comments: 342, // Placeholder
        })

        setRecentArticles(articles || [])
        setIsConfigured(true)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setIsConfigured(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase, isMissingEnvVars])

  // Resto del código sin cambios...

  // Placeholder data for charts
  const weeklyViews = [1200, 1900, 1500, 2100, 1800, 2400, 2200]
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/admin/articles/new"
          className="bg-[#9d8462] hover:bg-[#8d7452] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Articles</p>
              <h3 className="text-2xl font-bold text-white mt-1">{isLoading ? "..." : stats.articles}</h3>
            </div>
            <div className="bg-[#9d8462]/20 p-3 rounded-full">
              <FileText className="h-5 w-5 text-[#9d8462]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
            <span className="text-green-400">12%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Categories</p>
              <h3 className="text-2xl font-bold text-white mt-1">{isLoading ? "..." : stats.categories}</h3>
            </div>
            <div className="bg-[#0673b8]/20 p-3 rounded-full">
              <Tag className="h-5 w-5 text-[#0673b8]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
            <span className="text-green-400">4%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Users</p>
              <h3 className="text-2xl font-bold text-white mt-1">{isLoading ? "..." : stats.users}</h3>
            </div>
            <div className="bg-[#c11574]/20 p-3 rounded-full">
              <Users className="h-5 w-5 text-[#c11574]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
            <span className="text-green-400">7%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <h3 className="text-2xl font-bold text-white mt-1">{isLoading ? "..." : stats.views.toLocaleString()}</h3>
            </div>
            <div className="bg-[#8fc9ff]/20 p-3 rounded-full">
              <Eye className="h-5 w-5 text-[#8fc9ff]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
            <span className="text-green-400">18%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Comments</p>
              <h3 className="text-2xl font-bold text-white mt-1">{isLoading ? "..." : stats.comments}</h3>
            </div>
            <div className="bg-[#ff6b35]/20 p-3 rounded-full">
              <MessageSquare className="h-5 w-5 text-[#ff6b35]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
            <span className="text-green-400">24%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Views Chart */}
        <div className="lg:col-span-2 bg-[#1a1a2e] rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Weekly Views</h3>
            <select className="bg-[#0a0a14] text-gray-300 border border-gray-700 rounded-md px-3 py-1 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          <div className="h-64 flex items-end justify-between">
            {weeklyViews.map((views, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-12 bg-gradient-to-t from-[#9d8462] to-[#ff6b35] rounded-t-sm"
                  style={{ height: `${(views / Math.max(...weeklyViews)) * 200}px` }}
                ></div>
                <p className="text-xs text-gray-400 mt-2">{weekDays[index]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Recent Articles</h3>
            <Link href="/admin/articles" className="text-[#9d8462] hover:text-[#ff6b35] text-sm flex items-center">
              View all <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4 opacity-50"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentArticles.length > 0 ? (
                recentArticles.map((article: any) => (
                  <div key={article.id} className="border-b border-gray-800 pb-3 last:border-0">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-white hover:text-[#9d8462] font-medium block truncate"
                    >
                      {article.title}
                    </Link>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">{new Date(article.created_at).toLocaleDateString()}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          article.status === "published"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-yellow-900/30 text-yellow-400"
                        }`}
                      >
                        {article.status || "draft"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No articles found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
