'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface MediaUploadProps {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  accept?: string;
}

export default function MediaUpload({ label, value, onChange, accept = "image/*,video/*" }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // data.lookupId is what SharePoint needs for the lookup column
      if (data.lookupId) {
        onChange(data.lookupId);
      } else {
        throw new Error('Upload succeeded but no lookup ID returned');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const hasValue = value !== '' && value !== null && value !== undefined;
  // Determine display text (either the ID or the URL if they pasted one manually)
  const displayText = hasValue ? (isNaN(Number(value)) ? value : `Uploaded (ID: ${value})`) : '';

  return (
    <div className="w-full">
      <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">
        {label}
      </label>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Paste URL or upload file"
            className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-[#007AFF] outline-none" 
            disabled={uploading}
          />
        </div>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg flex items-center gap-2 transition-colors border border-white/10 whitespace-nowrap"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#007AFF]" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 text-[#007AFF]" />
              <span>Upload File</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-xs text-[#FF2D55] flex items-center gap-1">
          <XCircle className="w-3 h-3" /> {error}
        </div>
      )}
      
      {!error && hasValue && typeof value === 'number' && (
        <div className="mt-2 text-xs text-[#30D158] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Successfully linked to SharePoint file
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept={accept}
      />
    </div>
  );
}
