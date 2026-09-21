'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/lib/storage/upload';
import { Camera, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface PhotoCaptureProps {
  bucket?: string;
  path?: string;
  onPhotoUploaded: (url: string, path: string) => void;
}

export function PhotoCapture({ bucket = 'photos', path = 'general', onPhotoUploaded }: PhotoCaptureProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setIsUploading(true);
    try {
      const result = await uploadFile(bucket, file, path);
      if (result) {
        onPhotoUploaded(result.url, result.path);
      }
    } catch (error) {
      console.error('Upload failed', error);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {preview ? (
        <div className="relative w-48 h-48 rounded-md overflow-hidden border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 rounded-full w-6 h-6"
            onClick={() => {
              setPreview(null);
              onPhotoUploaded('', '');
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" className="relative cursor-pointer">
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </Button>
          <Button variant="outline" className="relative cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </Button>
        </div>
      )}
      {isUploading && <p className="text-sm text-muted-foreground animate-pulse">Uploading...</p>}
    </div>
  );
}
