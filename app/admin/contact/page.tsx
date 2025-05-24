"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

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

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) {
        setError(error.message)
      } else {
        setMessages(data)
      }
      setLoading(false)
    }
    fetchMessages()
  }, [])

  if (loading) return <div className="p-8">Loading messages...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      {messages.length === 0 ? (
        <div>No messages yet.</div>
      ) : (
        <table className="min-w-full bg-[#181826] rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr>
              <th className="p-3 text-left text-white">Name</th>
              <th className="p-3 text-left text-white">Email</th>
              <th className="p-3 text-left text-white">Subject</th>
              <th className="p-3 text-left text-white">Message</th>
              <th className="p-3 text-left text-white">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b border-[#232336] hover:bg-[#232336]/30">
                <td className="p-3">{msg.name}</td>
                <td className="p-3">{msg.email}</td>
                <td className="p-3">{msg.subject}</td>
                <td className="p-3">{msg.message}</td>
                <td className="p-3">{new Date(msg.created_at).toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
