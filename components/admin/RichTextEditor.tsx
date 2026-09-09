'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// Quill requires the window object, so we must load it dynamically in Next.js
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <div className="h-48 w-full bg-white/5 animate-pulse rounded-lg border border-white/10 flex items-center justify-center text-white/40 text-sm">Loading Editor...</div> });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write something amazing...' }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  }), []);

  return (
    <div className="rich-text-container bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          background: rgba(255,255,255,0.02) !important;
          padding: 12px 20px !important;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(10px);
        }
        .ql-container.ql-snow {
          border: none !important;
          min-height: 500px;
          color: rgba(255,255,255,0.9);
          font-family: inherit;
          font-size: 1.05rem;
          line-height: 1.8;
        }
        .ql-editor {
          min-height: 500px;
          padding: 2rem;
        }
        .ql-editor.ql-blank::before {
          color: rgba(255,255,255,0.3);
          font-style: normal;
          left: 2rem;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: white;
          font-weight: 700;
        }
        .ql-editor p {
          margin-bottom: 1.25rem;
        }
        .ql-editor ul, .ql-editor ol {
          padding-left: 1rem;
          margin-bottom: 1.25rem;
        }
        .ql-snow .ql-stroke {
          stroke: rgba(255,255,255,0.6) !important;
        }
        .ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
          fill: rgba(255,255,255,0.6) !important;
        }
        .ql-snow .ql-picker {
          color: rgba(255,255,255,0.6) !important;
        }
        .ql-snow .ql-picker-options {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .ql-snow .ql-picker-item:hover {
          color: #007AFF !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #007AFF !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #007AFF !important;
        }
      `}} />
      <ReactQuill 
        theme="snow" 
        value={value || ''} 
        onChange={onChange} 
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
