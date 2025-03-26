"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { streamAIResponse, generateAIResponse } from "@/lib/ai"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your gaming assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // Start loading state
    setIsLoading(true)

    try {
      // Add empty assistant message that will be streamed into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      // Try to use streaming first
      try {
        await streamAIResponse(userMessage, (chunk) => {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage.role === "assistant") {
              return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + chunk }]
            }
            return prev
          })
        })
      } catch (streamError) {
        console.error("Streaming failed, falling back to non-streaming:", streamError)

        // If streaming fails, fall back to non-streaming
        const response = await generateAIResponse(userMessage)

        if (response.success) {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage.role === "assistant") {
              return [...prev.slice(0, -1), { ...lastMessage, content: response.text }]
            }
            return prev
          })
        } else {
          throw new Error(response.error || "Failed to generate response")
        }
      }
    } catch (error) {
      console.error("Error in AI chat:", error)
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage.role === "assistant") {
          return [...prev.slice(0, -1), { ...lastMessage, content: "Sorry, I encountered an error. Please try again." }]
        }
        return prev
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Gaming Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-muted p-3 rounded-lg"
                    : "bg-primary text-primary-foreground p-3 rounded-lg"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                ) : (
                  <User className="h-5 w-5 mt-1 flex-shrink-0" />
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea
            placeholder="Ask me about games, recommendations, or gaming tips..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

