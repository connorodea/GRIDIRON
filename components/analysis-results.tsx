"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

interface PlayAnalysis {
  offensive_team: string | null;
  defensive_team: string | null;
  _quarter: string;
  _clock: string | null;
  score_differential: number | null;
  _drive: number | null;
  drive_play: number | null;
  field_position: string | null;
  _down: number | null;
  _distance: number | null;
  hash_offense: string | null;
  hash_defense: string | null;
  QB_location: string;
  number_of_BACKs: string;
  number_of_TEs: string;
  number_of_WRs: string;
  offensive_personnel: string;
}

export function AnalysisResults() {
  const [results, setResults] = useState<PlayAnalysis[]>([])
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const eventSource = new EventSource("/api/analysis-progress")
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.progress) {
        setProgress(data.progress)
      }
      if (data.results) {
        setResults(data.results)
        eventSource.close()
        toast({
          title: "Analysis Complete",
          description: `Analyzed ${data.results.length} plays successfully.`,
        })
      }
      if (data.error) {
        eventSource.close()
        toast({
          variant: "destructive",
          title: "Analysis Error",
          description: data.error,
        })
      }
    }
    eventSource.onerror = () => {
      eventSource.close()
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Lost connection to the server. Please try again.",
      })
    }
    return () => eventSource.close()
  }, [toast])

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-2xl font-semibold text-primary">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        {progress < 100 && (
          <div className="mb-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Analyzing... {progress.toFixed(0)}% complete</p>
          </div>
        )}
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow>
                  <TableHead>Offensive Team</TableHead>
                  <TableHead>Defensive Team</TableHead>
                  <TableHead>Quarter</TableHead>
                  <TableHead>Clock</TableHead>
                  <TableHead>Score Differential</TableHead>
                  <TableHead>Drive</TableHead>
                  <TableHead>Drive Play</TableHead>
                  <TableHead>Field Position</TableHead>
                  <TableHead>Down</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Hash (Offense)</TableHead>
                  <TableHead>Hash (Defense)</TableHead>
                  <TableHead>QB Location</TableHead>
                  <TableHead>Number of BACKs</TableHead>
                  <TableHead>Number of TEs</TableHead>
                  <TableHead>Number of WRs</TableHead>
                  <TableHead>Offensive Personnel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <TableCell>{result.offensive_team}</TableCell>
                    <TableCell>{result.defensive_team}</TableCell>
                    <TableCell>{result._quarter}</TableCell>
                    <TableCell>{result._clock}</TableCell>
                    <TableCell>{result.score_differential}</TableCell>
                    <TableCell>{result._drive}</TableCell>
                    <TableCell>{result.drive_play}</TableCell>
                    <TableCell>{result.field_position}</TableCell>
                    <TableCell>{result._down}</TableCell>
                    <TableCell>{result._distance}</TableCell>
                    <TableCell>{result.hash_offense}</TableCell>
                    <TableCell>{result.hash_defense}</TableCell>
                    <TableCell>{result.QB_location}</TableCell>
                    <TableCell>{result.number_of_BACKs}</TableCell>
                    <TableCell>{result.number_of_TEs}</TableCell>
                    <TableCell>{result.number_of_WRs}</TableCell>
                    <TableCell>{result.offensive_personnel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center">No results available yet. Upload and analyze GIFs to see results here.</p>
        )}
      </CardContent>
    </Card>
  )
}

