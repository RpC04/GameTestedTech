"use client"

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { useCallback, useState } from "react"
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

// Crear una instancia de lowlight con los lenguajes comunes
const lowlight = createLowlight(common)

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Comienza a escribir...",
}: RichTextEditorProps) {
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false,
      }),
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
      CodeBlockLowlight.configure({
        lowlight,
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

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return

    editor.chain().focus().setImage({ src: imageUrl }).run()
    setImageUrl("")
    setShowImageMenu(false)
  }, [editor, imageUrl])

  const setLink = useCallback(() => {
    if (!editor || !linkUrl) return

    // Update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()

    setLinkUrl("")
    setShowLinkMenu(false)
  }, [editor, linkUrl])

  const removeLink = useCallback(() => {
    if (!editor) return

    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setShowLinkMenu(false)
  }, [editor])

  if (!editor) return null

  return (
    <div className="relative border border-gray-700 rounded-md bg-slate-950">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-800 bg-slate-900">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("bold") && "bg-slate-800 text-white",
          )}
          title="Negrita (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("italic") && "bg-slate-800 text-white",
          )}
          title="Cursiva (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("heading", { level: 1 }) && "bg-slate-800 text-white",
          )}
          title="Encabezado 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("heading", { level: 2 }) && "bg-slate-800 text-white",
          )}
          title="Encabezado 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("bulletList") && "bg-slate-800 text-white",
          )}
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("orderedList") && "bg-slate-800 text-white",
          )}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("blockquote") && "bg-slate-800 text-white",
          )}
          title="Cita"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("codeBlock") && "bg-slate-800 text-white",
          )}
          title="Bloque de código"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowLinkMenu(true)}
          className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800",
            editor.isActive("link") && "bg-slate-800 text-white",
          )}
          title="Enlace"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowImageMenu(true)}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800"
          title="Imagen"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l border-gray-700 mx-1"></div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800"
          title="Deshacer"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800"
          title="Rehacer"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Link Menu */}
      {showLinkMenu && (
        <div className="absolute top-14 left-2 z-10 bg-slate-900 border border-gray-700 rounded-md p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="bg-slate-950 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={setLink}
              className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-slate-800"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLinkMenu(false)}
              className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {editor.isActive("link") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={removeLink}
              className="text-xs text-red-500 hover:text-red-400 hover:bg-slate-800 p-1"
            >
              Eliminar enlace
            </Button>
          )}
        </div>
      )}

      {/* Image Menu */}
      {showImageMenu && (
        <div className="absolute top-14 left-2 z-10 bg-slate-900 border border-gray-700 rounded-md p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="bg-slate-950 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={addImage}
              className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-slate-800"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowImageMenu(false)}
              className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-slate-900 border border-gray-700 rounded-md shadow-lg overflow-hidden flex"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800 rounded-none",
              editor.isActive("bold") && "bg-slate-800 text-white",
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800 rounded-none",
              editor.isActive("italic") && "bg-slate-800 text-white",
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLinkMenu(true)}
            className={cn(
              "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-800 rounded-none",
              editor.isActive("link") && "bg-slate-800 text-white",
            )}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      {/* Floating Menu */}
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-slate-900 border border-gray-700 rounded-md shadow-lg overflow-hidden"
        >
          <div className="p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="flex items-center gap-2 w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
            >
              <Heading1 className="h-4 w-4" />
              <span>Encabezado 1</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="flex items-center gap-2 w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
            >
              <Heading2 className="h-4 w-4" />
              <span>Encabezado 2</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="flex items-center gap-2 w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
            >
              <List className="h-4 w-4" />
              <span>Lista con viñetas</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="flex items-center gap-2 w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
            >
              <ListOrdered className="h-4 w-4" />
              <span>Lista numerada</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="flex items-center gap-2 w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
            >
              <Code className="h-4 w-4" />
              <span>Bloque de código</span>
            </Button>
          </div>
        </FloatingMenu>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}