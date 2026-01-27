'use client';
import { useState } from 'react';

type Props = { onUploaded?: (url: string) => void };

export default function ImageUploaderLocal({ onUploaded }: Props) {
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/uploads/local', {
        method: 'POST',
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setPreview(json.url);
      onUploaded?.(json.url);
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {preview && <img src={preview} alt="preview" style={{ maxWidth: 240 }} />}
    </div>
  );
}
