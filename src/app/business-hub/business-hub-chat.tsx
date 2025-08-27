
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { answerHubQuery } from '@/ai/flows/business-hub-agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, User, Bot, Building } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const FormSchema = z.object({
  question: z.string().min(3, 'Query must be at least 3 characters.'),
});
type FormValues = z.infer<typeof FormSchema>;

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const businessCategories = [
    "Printing & Publishing", "Perfumes & Cosmetics", "Bookshops & Stationery", 
    "Schools & Education", "Restaurants & Cafes", "Creative & Design", 
    "Tech & IT Services", "Consulting & Professional Services", "Automotive Services", 
    "Real Estate & Construction", "Health & Wellness", "Retail & E-commerce", 
    "Tourism & Hospitality", "Legal Services", "Financial & Banking", 
    "Events & Entertainment"
];

export default function BusinessHubChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
      { sender: 'bot', text: "Hello! I'm Hubert, your Business Hub coordinator. Tell me what you're looking for, and I'll help you find the right category." }
  ]);
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: '',
    },
  });

  useEffect(() => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({
            top: scrollViewportRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    const userMessage: Message = { sender: 'user', text: data.question };
    setMessages(prev => [...prev, userMessage]);
    form.reset();

    try {
      const result = await answerHubQuery({ query: data.question, businessCategories });
      const botMessage: Message = { 
        sender: 'bot', 
        text: result.response,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get an answer. Please try again.',
        variant: 'destructive',
      });
      const errorMessage: Message = { sender: 'bot', text: "I'm sorry, but I encountered an error. Please try asking again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2"><Bot /> Chat with Hubert</CardTitle>
            <CardDescription>Your AI guide to the Business Hub network.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] pr-0">
            <ScrollArea className="h-full pr-4" viewportRef={scrollViewportRef}>
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                            {message.sender === 'bot' && (
                                <div className="bg-primary text-primary-foreground rounded-full p-2 self-start">
                                    <Bot className="h-5 w-5" />
                                </div>
                            )}
                             <div className={`rounded-lg p-3 max-w-[80%] ${message.sender === 'user' ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                                <p className="text-sm" style={{whiteSpace: 'pre-wrap'}}>{message.text}</p>
                            </div>
                             {message.sender === 'user' && (
                                <div className="bg-accent text-accent-foreground rounded-full p-2 self-start">
                                    <User className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                             <div className="bg-primary text-primary-foreground rounded-full p-2 self-start">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="rounded-lg p-3 bg-muted">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </CardContent>
      <CardFooter>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="e.g., 'I need someone to build a website'" {...field} autoComplete="off" disabled={isLoading}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
      </CardFooter>
    </Card>
  );
}
