"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export function UploadForm() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(file => {
        if (file.type !== "image/gif") {
          toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: `${file.name} is not a GIF file.`,
          })
          return false
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            variant: "destructive",
            title: "File Too Large",
            description: `${file.name} exceeds the 10MB size limit.`,
          })
          return false
        }
        return true
      })
      setFiles(validFiles.length > 0 ? validFiles as unknown as FileList : null)
    } else {
      setFiles(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!files) return

    setIsUploading(true)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }
      
      toast({
        title: "Analysis Started",
        description: data.message || "Your football plays are being analyzed. Results will appear soon.",
      })
    } catch (error) {
      console.error("Error during analysis:", error)
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during analysis. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="mb-8 overflow-hidden border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-2xl font-semibold text-primary">Upload Football Play GIFs</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            accept=".gif"
            multiple
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <Button type="submit" disabled={!files || isUploading} className="w-full bg-primary hover:bg-primary/90 text-white">
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" /> Analyze Plays
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

