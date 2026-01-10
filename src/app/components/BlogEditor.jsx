"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function BlogEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-white/10 border border-white/30 focus:outline-none focus:border-emerald-500 rounded-xl text-white">
      {/* Toolbar */}
      <div className="flex gap-3 py-2 px-5 w-full rounded-tl-xl rounded-tr-xl backdrop-blur-sm bg-emerald-700/30 border-b border-emerald-400 transition-all duration-300">
        <button
          className={`px-2 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("bold")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          className={`px-2 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("italic")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          className={`px-2 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("bulletList")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          UL
        </button>
        <button
          className={`px-2 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("orderedList")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          OL
        </button>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="textarea-scrollbar overflow-y-auto h-[130px] px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white bg-transparent overflow-hidden [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:m-0"
      />
    </div>
  );
}
