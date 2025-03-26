"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText, Image, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onUploadComplete?: (url: string) => void
  folder?: string
  maxSizeMB?: number
  acceptedFileTypes?: string
}

export function FileUpload({
  onUploadComplete,
  folder = "uploads",
  maxSizeMB = 5,
  acceptedFileTypes = "image/*",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)

    if (!selectedFile) return

    // Check file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    setFile(selectedFile)
    setUploadedUrl(null)

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Create a FormData object
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 100)

      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      setProgress(100)
      setUploadedUrl(data.url)

      if (onUploadComplete) {
        onUploadComplete(data.url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setUploadedUrl(null)
    setPreview(null)
    setError(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload className="mr-2 h-4 w-4" />
          Select File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          className="hidden"
          disabled={uploading}
        />

        {file && !uploading && !uploadedUrl && (
          <Button type="button" onClick={handleUpload}>
            Upload
          </Button>
        )}

        {file && (
          <Button type="button" variant="ghost" size="icon" onClick={handleClear} disabled={uploading}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {file && (
        <div className="bg-muted rounded-md p-3 flex items-center gap-3">
          {file.type.startsWith("image/") ? (
            <Image className="h-5 w-5 text-muted-foreground" />
          ) : (
            <FileText className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          {uploadedUrl && <Check className="h-5 w-5 text-green-500" />}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{progress}%</p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="max-h-48 rounded-md object-contain bg-muted p-2"
          />
        </div>
      )}
    </div>
  )
}

