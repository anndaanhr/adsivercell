"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, XCircle, Info, MessagesSquare, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import { SITE } from '@/lib/config';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AISupportChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi there! I'm the ${SITE.NAME} AI support assistant. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ message: string }>();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onSubmit = async (data: { message: string }) => {
    // Don't submit empty messages
    if (!data.message.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: data.message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Clear the input
    reset();

    // Set loading state
    setIsLoading(true);

    try {
      // Send the query to the API
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: data.message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI support');
      }

      const result = await response.json();

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI support response:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'm sorry, I couldn't process your request at the moment. Please try again or contact our support team at ${SITE.SUPPORT_EMAIL}.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Show toast notification
      toast({
        title: 'Support Error',
        description: 'Failed to get response from AI support. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Hi there! I'm the ${SITE.NAME} AI support assistant. How can I help you today?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessagesSquare className="h-6 w-6" />
          <span className="sr-only">Open Support Chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" />
            AI Support Chat
            <Badge variant="outline" className="ml-2">
              Beta
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <Card className="mt-4 flex h-[calc(100vh-10rem)] flex-col">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center text-base">
              <Info className="mr-2 h-4 w-4 text-muted-foreground" />
              Ask me anything about our digital products
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-4 pt-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`flex max-w-[80%] items-start rounded-lg px-4 py-2 ${
                        msg.role === 'assistant'
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <Bot className="mr-2 mt-1 h-4 w-4 shrink-0" />
                      )}
                      <div>
                        <div className="prose prose-sm">{msg.content}</div>
                        <div className="mt-1 text-right text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <User className="ml-2 mt-1 h-4 w-4 shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <Separator />

          <CardFooter className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full space-x-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-9 resize-none"
                  {...register('message', { required: true })}
                  disabled={isLoading}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" size="icon" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send message</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={clearChat}
                  disabled={isLoading || messages.length <= 1}
                >
                  <XCircle className="h-4 w-4" />
                  <span className="sr-only">Clear chat</span>
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
