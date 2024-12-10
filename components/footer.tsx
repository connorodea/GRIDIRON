import { Github } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} GridironAI. All rights reserved.</p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Button variant="outline" size="sm" asChild>
            <a href="https://github.com/yourusername/gridironai" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}

