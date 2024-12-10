import { NextRequest, NextResponse } from "next/server"
import { analyzeFootballPlay } from "@/lib/analysis"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    // Validate file types and sizes
    const invalidFiles = files.filter(file => 
      file.type !== "image/gif" || file.size > 10 * 1024 * 1024
    )

    if (invalidFiles.length > 0) {
      return NextResponse.json({ 
        error: "Invalid files detected. Please ensure all files are GIFs and under 10MB." 
      }, { status: 400 })
    }

    // Start the analysis process
    const analysisPromise = analyzeFootballPlay(files)

    // Store the promise in the global scope (this is a simplification, in a real app you'd use a proper state management solution)
    // @ts-ignore
    global.currentAnalysis = analysisPromise

    return NextResponse.json({ message: "Analysis started successfully" })
  } catch (error) {
    console.error("Error during analysis:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred during analysis" 
    }, { status: 500 })
  }
}

