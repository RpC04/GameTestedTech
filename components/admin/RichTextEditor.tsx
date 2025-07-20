"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { useState } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  ImageIcon,
  LinkIcon,
  Quote,
  Undo,
  Redo,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { RichTextEditorProps } from "@/types/article"

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-2",
      },
    },
  })

  if (!editor) return null

  const addImage = () => {
    if (!imageUrl.trim()) return
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run()
    setImageUrl("")
    setShowImageMenu(false)
  }

  const setLink = () => {
    if (!linkUrl.trim()) return
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run()
    setLinkUrl("")
    setShowLinkMenu(false)
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setShowLinkMenu(false)
  }

  return (
    <div className="relative border border-gray-700 rounded-md bg-slate-950">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-800 bg-slate-900">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("bold") && "bg-slate-800 text-white",
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("italic") && "bg-slate-800 text-white",
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("heading", { level: 1 }) && "bg-slate-800 text-white",
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("heading", { level: 2 }) && "bg-slate-800 text-white",
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("bulletList") && "bg-slate-800 text-white",
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("orderedList") && "bg-slate-800 text-white",
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("blockquote") && "bg-slate-800 text-white",
          )}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("codeBlock") && "bg-slate-800 text-white",
          )}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            if (editor.isActive("link")) {
              const href = editor.getAttributes("link").href
              setLinkUrl(href || "")
            }
            setShowLinkMenu(!showLinkMenu)
            setShowImageMenu(false)
          }}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            (editor.isActive("link") || showLinkMenu) && "bg-slate-800 text-white",
          )}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowImageMenu(!showImageMenu)
            setShowLinkMenu(false)
          }}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            showImageMenu && "bg-slate-800 text-white",
          )}
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800 disabled:opacity-50"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800 disabled:opacity-50"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Link Menu */}
      {showLinkMenu && (
        <div className="bg-slate-900 border-t border-gray-700 p-3">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  setLink()
                } else if (e.key === "Escape") {
                  e.preventDefault()
                  setShowLinkMenu(false)
                  setLinkUrl("")
                }
              }}
              placeholder="https://example.com"
              className="flex-1 bg-slate-950 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={setLink}
              disabled={!linkUrl.trim()}
              className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-slate-800 disabled:opacity-50"
              title="Add Link"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowLinkMenu(false)
                setLinkUrl("")
              }}
              className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-slate-800"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {editor.isActive("link") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeLink}
              className="text-xs text-red-500 hover:text-red-400 hover:bg-slate-800 p-1"
            >
              Remove link
            </Button>
          )}
        </div>
      )}

      {/* Image Menu */}
      {showImageMenu && (
        <div className="bg-slate-900 border-t border-gray-700 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addImage()
                } else if (e.key === "Escape") {
                  e.preventDefault()
                  setShowImageMenu(false)
                  setImageUrl("")
                }
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-slate-950 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={addImage}
              disabled={!imageUrl.trim()}
              className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-slate-800 disabled:opacity-50"
              title="Add Image"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowImageMenu(false)
                setImageUrl("")
              }}
              className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-slate-800"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}