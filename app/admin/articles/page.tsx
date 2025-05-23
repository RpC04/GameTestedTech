"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Article = {
  id: number
  title: string
  status: string
  category_id: number | null
  author_id: number | null
  created_at: string
  updated_at: string
  views: number
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedArticles, setSelectedArticles] = useState<number[]>([])
  const [isDeleting, setIsDeleting] = useState(false) 

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchArticles()
  }, [statusFilter, sortField, sortDirection])

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from("articles")
        .select("id, title, status, category_id, author_id, created_at, updated_at, views")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data, error } = await query

      if (error) throw error

      setArticles(data || [])
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter articles client-side for simplicity
    // In a real app, you might want to do this server-side
    fetchArticles()
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const toggleSelectArticle = (id: number) => {
    setSelectedArticles((prev) => (prev.includes(id) ? prev.filter((articleId) => articleId !== id) : [...prev, id]))
  }

  const selectAllArticles = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([])
    } else {
      setSelectedArticles(articles.map((article: any) => article.id))
    }
  }

  const deleteSelectedArticles = async () => {
    if (!selectedArticles.length) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("articles").delete().in("id", selectedArticles)

      if (error) throw error

      // Refresh the list
      fetchArticles()
      setSelectedArticles([])
    } catch (error) {
      console.error("Error deleting articles:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredArticles = articles.filter((article: any) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="bg-[#9d8462] hover:bg-[#8d7452] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="bg-[#1a1a2e] rounded-md flex items-center">
            <div className="px-3 py-2 border-r border-gray-800">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="bg-transparent text-gray-300 px-3 py-2 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {selectedArticles.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
              onClick={deleteSelectedArticles}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              Delete {selectedArticles.length} selected
            </Button>
          )}
        </div>

        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="bg-[#1a1a2e] border border-gray-800 rounded-md py-2 pl-10 pr-4 w-full md:w-64 text-white focus:outline-none focus:ring-1 focus:ring-[#9d8462]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </form>
      </div>

      {/* Articles Table */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1f1f3a] text-gray-300 text-left">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    className="rounded bg-[#0a0a14] border-gray-700 text-[#9d8462] focus:ring-[#9d8462]"
                    checked={selectedArticles.length === articles.length && articles.length > 0}
                    onChange={selectAllArticles}
                  />
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("title")}>
                  <div className="flex items-center gap-1">
                    Title
                    {sortField === "title" && <ArrowUpDown className="h-3 w-3" />}
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === "status" && <ArrowUpDown className="h-3 w-3" />}
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("created_at")}>
                  <div className="flex items-center gap-1">
                    Date
                    {sortField === "created_at" && <ArrowUpDown className="h-3 w-3" />}
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("views")}>
                  <div className="flex items-center gap-1">
                    Views
                    {sortField === "views" && <ArrowUpDown className="h-3 w-3" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index} className="border-t border-gray-800 animate-pulse">
                      <td className="px-4 py-3">
                        <div className="h-4 w-4 bg-gray-700 rounded"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded w-12"></div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="h-4 bg-gray-700 rounded w-20 ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article: any) => (
                  <tr key={article.id} className="border-t border-gray-800 hover:bg-[#1f1f3a]">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded bg-[#0a0a14] border-gray-700 text-[#9d8462] focus:ring-[#9d8462]"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => toggleSelectArticle(article.id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{article.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === "published"
                            ? "bg-green-900/30 text-green-400"
                            : article.status === "draft"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-gray-900/30 text-gray-400"
                        }`}
                      >
                        {article.status === "published" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {article.status === "draft" && <XCircle className="mr-1 h-3 w-3" />}
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(article.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-400">{article.views?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blog/${article.id}`} className="text-gray-400 hover:text-white p-1" title="View">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="text-gray-400 hover:text-white p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Delete"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this article?")) {
                              setSelectedArticles([article.id])
                              deleteSelectedArticles()
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-white p-1">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    {searchQuery
                      ? "No articles found matching your search criteria"
                      : "No articles found. Create your first article!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-[#1a1a2e] hover:bg-[#2a2a4a]">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-[#1a1a2e] hover:bg-[#2a2a4a]">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
                <span className="font-medium">8</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-[#1a1a2e] text-sm font-medium text-gray-400 hover:bg-[#2a2a4a]">
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-[#2a2a4a] text-sm font-medium text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-[#1a1a2e] text-sm font-medium text-gray-400 hover:bg-[#2a2a4a]">
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
