import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  let progress = 0
  const interval = setInterval(async () => {
    progress += 10
    await writer.write(encoder.encode(`data: ${JSON.stringify({ progress })}\n\n`))
    
    // @ts-ignore
    if (global.currentAnalysis) {
      try {
        // @ts-ignore
        const results = await global.currentAnalysis
        clearInterval(interval)
        await writer.write(encoder.encode(`data: ${JSON.stringify({ results, progress: 100 })}\n\n`))
        await writer.close()
      } catch (error) {
        clearInterval(interval)
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Analysis failed", progress: 100 })}\n\n`))
        await writer.close()
      }
    } else if (progress >= 100) {
      clearInterval(interval)
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Analysis timed out", progress: 100 })}\n\n`))
      await writer.close()
    }
  }, 1000)

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}

