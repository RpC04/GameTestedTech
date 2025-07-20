"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Trash2, Download, FileText, FileSpreadsheet, AlertCircle, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id)

      if (error) throw error

      setMessages(prev => prev.filter(msg => msg.id !== id))
      setSelectedMessages(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })

      // Cerrar modal si el mensaje que se está viendo fue eliminado
      if (viewingMessage && viewingMessage.id === id) {
        setViewingMessage(null)
      }
    } catch (error: any) {
      setError(`Failed to delete message: ${error.message}`)
    }
  }

  const deleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedMessages.size} selected messages?`)) return

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .in("id", Array.from(selectedMessages))

      if (error) throw error

      setMessages(prev => prev.filter(msg => !selectedMessages.has(msg.id)))
      setSelectedMessages(new Set())

      // Cerrar modal si el mensaje que se está viendo fue eliminado
      if (viewingMessage && selectedMessages.has(viewingMessage.id)) {
        setViewingMessage(null)
      }
    } catch (error: any) {
      setError(`Failed to delete messages: ${error.message}`)
    }
  }

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set())
    } else {
      setSelectedMessages(new Set(messages.map(msg => msg.id)))
    }
  }

  const exportToExcel = () => {
    if (messages.length === 0) {
      alert("No messages to export")
      return
    }

    const exportData = messages.map(msg => ({
      Name: msg.name,
      Email: msg.email,
      Subject: msg.subject,
      Message: msg.message,
      Date: new Date(msg.created_at).toLocaleString()
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Messages")

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 30 }, // Subject
      { wch: 50 }, // Message
      { wch: 20 }  // Date
    ]
    worksheet['!cols'] = colWidths

    XLSX.writeFile(workbook, `contact-messages-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToPDF = () => {
    if (messages.length === 0) {
      alert("No messages to export")
      return
    }

    const doc = new jsPDF()

    // Título
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text('Contact Messages Report', 20, 20)

    // Fecha del reporte
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35)
    doc.text(`Total Messages: ${messages.length}`, 20, 45)

    // Línea separadora
    doc.setDrawColor(157, 132, 98)
    doc.line(20, 50, 190, 50)

    let yPosition = 65

    messages.forEach((msg, index) => {
      // Verificar si necesitamos una nueva página
      if (yPosition > 260) {
        doc.addPage()
        yPosition = 20
      }

      // Encabezado del mensaje
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(`Message #${index + 1}`, 20, yPosition)
      yPosition += 10

      // Información del mensaje
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      // Nombre
      doc.setFont("helvetica", "bold")
      doc.text('From:', 20, yPosition)
      doc.setFont("helvetica", "normal")
      doc.text(`${msg.name} (${msg.email})`, 40, yPosition)
      yPosition += 8

      // Asunto
      doc.setFont("helvetica", "bold")
      doc.text('Subject:', 20, yPosition)
      doc.setFont("helvetica", "normal")
      const subjectLines = doc.splitTextToSize(msg.subject, 150)
      doc.text(subjectLines, 45, yPosition)
      yPosition += (subjectLines.length * 5) + 3

      // Fecha
      doc.setFont("helvetica", "bold")
      doc.text('Date:', 20, yPosition)
      doc.setFont("helvetica", "normal")
      doc.text(new Date(msg.created_at).toLocaleDateString(), 40, yPosition)
      yPosition += 8

      // Mensaje
      doc.setFont("helvetica", "bold")
      doc.text('Message:', 20, yPosition)
      yPosition += 5
      doc.setFont("helvetica", "normal")
      const messageLines = doc.splitTextToSize(msg.message, 170)
      doc.text(messageLines, 20, yPosition)
      yPosition += (messageLines.length * 5) + 10

      // Línea separadora entre mensajes
      if (index < messages.length - 1) {
        doc.setDrawColor(200, 200, 200)
        doc.line(20, yPosition, 190, yPosition)
        yPosition += 10
      }
    })

    doc.save(`contact-messages-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const exportToCSV = () => {
    if (messages.length === 0) {
      alert("No messages to export")
      return
    }

    const csvContent = [
      ['Name', 'Email', 'Subject', 'Message', 'Date'],
      ...messages.map(msg => [
        msg.name,
        msg.email,
        msg.subject,
        msg.message.replace(/"/g, '""'), // Escape quotes
        new Date(msg.created_at).toLocaleString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `contact-messages-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <div className="flex flex-wrap items-center gap-3">
          {selectedMessages.size > 0 && (
            <Button
              onClick={deleteSelectedMessages}
              variant="destructive"
              className="flex items-center gap-2"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedMessages.size})
            </Button>
          )}
          <Button
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            size="sm"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            size="sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            size="sm"
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              className="text-red-300 hover:text-red-100 underline text-sm mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages Table */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1f1f3a] text-gray-300 text-left">
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedMessages.size === messages.length && messages.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#9d8462] focus:ring-[#9d8462]"
                    />
                  </th>
                  <th className="px-4 py-3 min-w-[150px]">Name</th>
                  <th className="px-4 py-3 min-w-[200px]">Email</th>
                  <th className="px-4 py-3 min-w-[200px]">Subject</th>
                  <th className="px-4 py-3 min-w-[300px]">Message</th>
                  <th className="px-4 py-3 min-w-[150px]">Date</th>
                  <th className="px-4 py-3 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id} className="border-t border-gray-800 hover:bg-[#1f1f3a] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedMessages.has(msg.id)}
                        onChange={() => toggleSelectMessage(msg.id)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#9d8462] focus:ring-[#9d8462]"
                      />
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{msg.name}</td>
                    <td className="px-4 py-3 text-gray-300">{msg.email}</td>
                    <td className="px-4 py-3 text-gray-300">{msg.subject}</td>
                    <td className="px-4 py-3 text-gray-300">
                      <div className="max-w-sm">
                        <div className="truncate">
                          {truncateMessage(msg.message, 150)}
                        </div>
                        {msg.message.length > 150 && (
                          <button
                            onClick={() => setViewingMessage(msg)}
                            className="text-[#9d8462] hover:text-[#8d7452] text-sm mt-1 underline"
                          >
                            Read more...
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(msg.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingMessage(msg)}
                          className="text-gray-400 hover:text-white p-2 rounded hover:bg-gray-700 transition-colors"
                          title="View full message"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-gray-700 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message View Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Message Details</h2>
              <button
                onClick={() => setViewingMessage(null)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">From:</label>
                <p className="text-white">{viewingMessage.name} ({viewingMessage.email})</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject:</label>
                <p className="text-white">{viewingMessage.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date:</label>
                <p className="text-gray-400">
                  {new Date(viewingMessage.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Message:</label>
                <div className="bg-[#0a0a14] border border-gray-700 rounded-md p-4 text-white whitespace-pre-wrap">
                  {viewingMessage.message}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
              <Button
                onClick={() => deleteMessage(viewingMessage.id)}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Message
              </Button>
              <Button
                onClick={() => setViewingMessage(null)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-gray-400 flex justify-between items-center">
        <span>
          Total messages: {messages.length}
          {selectedMessages.size > 0 && ` | Selected: ${selectedMessages.size}`}
        </span>
        {messages.length > 0 && (
          <span>
            Latest: {new Date(messages[0]?.created_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}