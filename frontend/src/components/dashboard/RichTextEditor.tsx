'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon
} from 'lucide-react';
import Image from '@tiptap/extension-image';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#1A1A1A] bg-[#F9FAFB]">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('underline') ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Underline"
      >
        <UnderlineIcon size={16} />
      </button>
      
      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Align Right"
      >
        <AlignRight size={16} />
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Blockquote"
      >
        <Quote size={16} />
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={addLink}
        className={`p-2 hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-[#1A1A1A]' : 'text-[#777777]'}`}
        title="Add Link"
      >
        <LinkIcon size={16} />
      </button>

      <button
        type="button"
        onClick={async () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*,video/*';
          input.onchange = async () => {
            if (input.files && input.files[0]) {
              const file = input.files[0];
              const formData = new FormData();
              formData.append('file', file);
              try {
                // We'll import apiFetch at the top of the file in the next replace
                // or we can pass it down. Better to just import it.
                const { apiFetch } = require('@/lib/api');
                const res = await apiFetch('/upload', { method: 'POST', body: formData });
                if (res.success) {
                  editor.chain().focus().setImage({ src: res.data.url }).run();
                }
              } catch (err) {
                alert('Upload failed');
              }
            }
          };
          input.click();
        }}
        className="p-2 hover:bg-gray-200 transition-colors text-[#777777]"
        title="Upload Image/Video"
      >
        <ImageIcon size={16} />
      </button>

      <div className="ml-auto flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 text-[#777777] hover:bg-gray-200 disabled:opacity-30 transition-colors"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 text-[#777777] hover:bg-gray-200 disabled:opacity-30 transition-colors"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your story...',
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto my-4',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[400px] px-4 py-6 font-light leading-relaxed text-[#1A1A1A]',
      },
    },
  });

  // Keep editor in sync with value prop (important for editing existing posts)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border border-[#1A1A1A] bg-white overflow-hidden focus-within:ring-1 focus-within:ring-[#1A1A1A] transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #A3A3A3;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none;
        }
        .ProseMirror h1 {
          font-family: inherit;
          font-size: 2.5rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .ProseMirror h2 {
          font-family: inherit;
          font-size: 1.875rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        .ProseMirror p {
          margin-bottom: 1.25rem;
          line-height: 1.75;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #1A1A1A;
          padding-left: 1.25rem;
          font-style: italic;
          margin: 1.5rem 0;
          color: #474747;
          font-size: 1.125rem;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
