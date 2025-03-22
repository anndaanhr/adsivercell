"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, Check, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  folder?: string;
  className?: string;
  defaultImage?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  width?: number;
  height?: number;
}

export function ImageUpload({
  onUpload,
  folder = 'uploads',
  className,
  defaultImage,
  maxSizeMB = 4,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  width = 200,
  height = 200,
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`File type not supported. Please upload: ${allowedTypes.join(', ')}`);
      toast({
        title: 'Invalid file type',
        description: `Please upload: ${allowedTypes.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      toast({
        title: 'File too large',
        description: `Maximum size is ${maxSizeMB}MB.`,
        variant: 'destructive',
      });
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create a FormData instance
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Upload the file to the server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await response.json();

      // Update the UI
      setImage(url);

      // Notify the parent component
      onUpload(url);

      toast({
        title: 'Image uploaded',
        description: 'Your image has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');

      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <input
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      <div
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          image ? 'h-auto w-auto' : `h-[${height}px] w-[${width}px]`,
          isUploading && 'opacity-50'
        )}
      >
        {image ? (
          <div className="relative">
            <Image
              src={image}
              alt="Uploaded image"
              width={width}
              height={height}
              className="rounded-lg object-cover"
            />
            {!isUploading && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute -right-3 -top-3 h-7 w-7 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <>
            {isUploading ? (
              <Loader2 className="mb-2 h-12 w-12 animate-spin text-muted-foreground" />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2 rounded-full bg-primary/10 p-3">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="mb-1 text-sm font-medium">Click or drag and drop an image</p>
                <p className="text-xs text-muted-foreground">
                  Max file size: {maxSizeMB}MB
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center text-sm text-destructive">
          <AlertCircle className="mr-1 h-4 w-4" />
          {error}
        </div>
      )}

      {image && !isUploading && (
        <div className="flex items-center text-sm text-primary">
          <Check className="mr-1 h-4 w-4" />
          Image uploaded successfully
        </div>
      )}
    </div>
  );
}
