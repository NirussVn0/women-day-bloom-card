"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Placeholder from '@tiptap/extension-placeholder'
import * as Y from 'yjs'
import { LiveblocksYjsProvider } from "@liveblocks/yjs"
import { useRoom, useSelf } from "@/lib/liveblocks"
import { useEffect, useState } from 'react'

export function CollaborativeEditor({ readOnly = false }: { readOnly?: boolean }) {
  const room = useRoom()
  const currentUser = useSelf()
  const [doc, setDoc] = useState<Y.Doc>()
  const [provider, setProvider] = useState<any>()

  useEffect(() => {
    const yDoc = new Y.Doc()
    const yProvider = new LiveblocksYjsProvider(room, yDoc)
    
    setDoc(yDoc)
    setProvider(yProvider)

    return () => {
      yDoc.destroy()
      yProvider.destroy()
    }
  }, [room])

  if (!doc || !provider) {
    return <div className="animate-pulse space-y-4 max-w-2xl mx-auto pt-10">
      <div className="h-8 bg-stone-100 rounded w-1/3"></div>
      <div className="h-4 bg-stone-100 rounded w-full"></div>
      <div className="h-4 bg-stone-100 rounded w-5/6"></div>
      <div className="h-4 bg-stone-100 rounded w-4/6"></div>
    </div>
  }

  return <TiptapEditor doc={doc} provider={provider} currentUser={currentUser} readOnly={readOnly} />
}

function TiptapEditor({ doc, provider, currentUser, readOnly }: { doc: Y.Doc, provider: any, currentUser: any, readOnly: boolean }) {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit.configure({
        // @ts-expect-error Tiptap typings exclude history, but we need to disable the underlying prosemirror history plugin explicitly
        history: false
      }),
      Placeholder.configure({
        placeholder: "Write your greeting or add a beautiful note...",
      }),
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: currentUser?.info?.name || "Anonymous",
          color: currentUser?.info?.color || "#f43f5e",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-stone prose-lg max-w-none focus:outline-none min-h-[500px]',
      },
    },
  })

  return (
    <div className="w-full max-w-3xl mx-auto pt-10 pb-24 px-4 sm:px-8">
       {/* Editor Toolbar placeholder (will implement if needed, Tiptap handles markdown shortcuts by default) */}
      <EditorContent editor={editor} className="mt-8 tiptap-editor" />
    </div>
  )
}
