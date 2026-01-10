"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaItalic } from "react-icons/fa";
import { HiBold } from "react-icons/hi2";
import { RiListUnordered } from "react-icons/ri";
import { LuListOrdered } from "react-icons/lu";
import { MdOutlineFormatUnderlined } from "react-icons/md";
import { useEffect } from "react";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

export default function BlogEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Enter blog description and share your insights...",
        emptyEditorClass: "is-editor-empty",
        includeChildren: true,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="bg-white/10 border border-white/30 focus:outline-none focus-within:border-emerald-500 rounded-xl text-white transition-all">
      {/* Toolbar */}
      <div className="flex justify-center gap-3 py-2 px-5 w-full rounded-tl-xl rounded-tr-xl backdrop-blur-sm bg-emerald-700/30 border-b border-emerald-400 transition-all duration-300">
        <button
          type="button"
          className={`px-2 py-0.5 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("bold")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <HiBold className="text-sm" />
        </button>
        <button
          type="button"
          className={`px-2 py-0.5 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("italic")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FaItalic className="text-xs" />
        </button>
        <button
          type="button"
          className={`px-2 py-0.5 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("underline")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <MdOutlineFormatUnderlined className="text-base" />
        </button>
        <button
          type="button"
          className={`px-2 py-0.5 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("bulletList")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <RiListUnordered className="text-base" />
        </button>
        <button
          type="button"
          className={`px-2 py-0.5 rounded-sm cursor-pointer transition-all duration-200 ease-in-out font-semibold text-sm ${
            editor.isActive("orderedList")
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <LuListOrdered className="text-lg" />
        </button>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="textarea-scrollbar overflow-y-auto h-[150px] px-4 py-2 text-sm focus:outline-none text-white bg-transparent [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:m-0 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-4 [&_.ProseMirror]:min-h-[130px] [&_.ProseMirror.is-editor-empty:before]:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
