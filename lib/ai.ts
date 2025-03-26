// Use our own API routes instead of direct xAI API calls
export async function generateAIResponse(prompt: string) {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error generating AI response:", error)
    return {
      text: "Sorry, I couldn't process your request at the moment.",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Stream implementation using our API route
export async function streamAIResponse(prompt: string, onChunk: (chunk: string) => void) {
  try {
    const response = await fetch("/api/ai/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("Response body is not readable")
    }

    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Process complete lines
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (line.trim() === "") continue
        if (line.trim() === "data: [DONE]") continue

        try {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.replace(/^data: /, ""))
            if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
              onChunk(data.choices[0].delta.content)
            }
          }
        } catch (e) {
          console.error("Error parsing stream data:", e)
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error streaming AI response:", error)
    throw error
  }
}

