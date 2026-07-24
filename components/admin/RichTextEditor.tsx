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
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.02);
        }
        .ql-container.ql-snow {
          border: none;
          min-height: 200px;
          color: white;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 200px;
        }
        .ql-editor.ql-blank::before {
          color: rgba(255,255,255,0.3);
          font-style: normal;
        }
        .ql-snow .ql-stroke {
          stroke: rgba(255,255,255,0.7);
        }
        .ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
          fill: rgba(255,255,255,0.7);
        }
        .ql-snow .ql-picker {
          color: rgba(255,255,255,0.7);
        }
        .ql-snow .ql-picker-options {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ql-snow .ql-picker-item:hover {
          color: #007AFF;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke {
          stroke: #007AFF;
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
