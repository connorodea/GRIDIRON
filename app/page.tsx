import { Metadata } from 'next'
import { UploadForm } from "@/components/upload-form"
import { AnalysisResults } from "@/components/analysis-results"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundDecoration } from "@/components/background-decoration"

export const metadata: Metadata = {
  title: 'GridironAI - Football Play Analysis',
  description: 'AI-powered analysis of football plays using advanced image recognition',
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          AI-Powered Football Play Analysis
        </h1>
        <UploadForm />
        <AnalysisResults />
      </main>
      <Footer />
      <BackgroundDecoration />
    </div>
  )
}

