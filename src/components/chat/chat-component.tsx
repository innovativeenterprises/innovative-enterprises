
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Mic, Square, CornerDownLeft, Bot, User, Volume2, Link as LinkIcon, CheckCircle } from 'lucide-react';
import type { LucideIcon } from "lucide-react";
import type { AppSettings } from '@/lib/settings';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Message {
  role: 'user' | 'bot';
  content: string;
  imageUrl?: string;
  meetingUrl?: string;
  contactOptions?: {
      email?: string;
      whatsapp?: string;
  };
  suggestedReplies?: string[];
}

const FormSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});
type FormValues = z.infer<typeof FormSchema>;

export const ChatComponent = ({
    agentName,
    agentIcon: AgentIcon,
    agentDescription,
    welcomeMessage,
    placeholder,
    aiFlow,
    settings,
}: {
    agentName: string;
    agentIcon: LucideIcon;
    agentDescription: string;
    welcomeMessage: string;
    placeholder: string;
    aiFlow: (input: { [key: string]: any }) => Promise<any>;
    settings: AppSettings;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { message: '' },
  });

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
    }
  }, []);
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{ role: 'bot', content: welcomeMessage, suggestedReplies: ["What services do you offer?", "Tell me about your products", "How can I become a partner?"] }]);

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // This could be made dynamic

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        form.setValue('message', transcript);
        setIsRecording(false);
        toast({ title: "Voice input captured!", description: "Press send to submit."});
      };
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({ title: 'Voice Error', description: 'Could not recognize speech. Please try again.', variant: 'destructive'});
        setIsRecording(false);
      };
       recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      stopAudio();
    }
  }, [form, toast, welcomeMessage, stopAudio]);
  
  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleTextToSpeech = async (text: string) => {
      stopAudio();
      setIsPlaying(true);
      try {
          const response = await textToSpeech({ textToSpeak: text, voice: 'onyx' });
          if(response.audioUrl) {
            const audio = new Audio(response.audioUrl);
            audioRef.current = audio;
            audio.play();
            audio.onended = () => setIsPlaying(false);
          }
      } catch (error) {
          console.error("TTS Error:", error);
          toast({ title: 'Audio Error', description: 'Could not play audio response.', variant: 'destructive'});
          setIsPlaying(false);
      }
  }

  const submitMessage = async (message: string) => {
    stopAudio();
    setIsLoading(true);
    setShowSuggestions(false);
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await aiFlow({ message: message });
      const botMessage: Message = { 
          role: 'bot', 
          content: result.answer || result.response,
          meetingUrl: result.meetingUrl,
          contactOptions: result.contactOptions,
          imageUrl: result.imageUrl,
          suggestedReplies: result.suggestedReplies,
      };
      setMessages(prev => [...prev, botMessage]);
      setShowSuggestions(true);
      form.reset();

      if (settings.voiceInteractionEnabled && botMessage.content) {
          handleTextToSpeech(botMessage.content);
      }
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { role: 'bot', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the agent.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    submitMessage(data.message);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    submitMessage(suggestion);
  }

  return (
    <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
                <AvatarFallback><Bot /></AvatarFallback>
            </Avatar>
            <div>
                <CardTitle>{agentName}</CardTitle>
                <CardDescription>{agentDescription}</CardDescription>
            </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4" viewportRef={scrollAreaRef}>
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <div className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                                 {msg.role === 'bot' && <Avatar className="h-8 w-8"><AvatarFallback><AgentIcon className="h-5 w-5"/></AvatarFallback></Avatar>}
                                <div className={cn("max-w-xs md:max-w-md rounded-xl px-4 py-3", 
                                    msg.role === 'user' 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-muted'
                                )}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    {msg.meetingUrl && (
                                        <Button asChild variant="secondary" size="sm" className="mt-3 w-full">
                                            <Link href={msg.meetingUrl} target="_blank">Book a Meeting</Link>
                                        </Button>
                                    )}
                                    {msg.contactOptions && (
                                        <div className="mt-3 pt-3 border-t border-muted-foreground/20 flex gap-2">
                                            {msg.contactOptions.email && <Button asChild variant="outline" size="sm"><a href={`mailto:${msg.contactOptions.email}`}>Email</a></Button>}
                                            {msg.contactOptions.whatsapp && <Button asChild variant="outline" size="sm"><a href={`https://wa.me/${msg.contactOptions.whatsapp}`} target="_blank">WhatsApp</a></Button>}
                                        </div>
                                    )}
                                    {msg.imageUrl && (
                                         <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-md border">
                                            <img src={msg.imageUrl} alt="Generated for social media post" className="object-cover w-full h-full"/>
                                        </div>
                                    )}
                                </div>
                                {msg.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback><User className="h-5 w-5"/></AvatarFallback></Avatar>}
                            </div>
                            {msg.role === 'bot' && msg.suggestedReplies && msg.suggestedReplies.length > 0 && showSuggestions && index === messages.length - 1 && (
                                <div className="flex flex-wrap gap-2 mt-3 pl-12">
                                    {msg.suggestedReplies.map((reply, i) => (
                                        <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(reply)}>
                                            {reply}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback><AgentIcon className="h-5 w-5"/></AvatarFallback></Avatar>
                             <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm text-muted-foreground">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </CardContent>

        <div className="p-4 border-t">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                    {settings.voiceInteractionEnabled && (
                    <>
                    {isPlaying ? (
                        <Button type="button" size="icon" variant="destructive" onClick={stopAudio}><Square className="h-5 w-5"/></Button>
                    ): (
                        <Button type="button" size="icon" variant="outline" onClick={() => handleTextToSpeech(messages[messages.length-1].content)} disabled={isLoading || messages.length === 0 || messages[messages.length-1]?.role !== 'bot'}>
                            <Volume2 className="h-5 w-5"/>
                        </Button>
                    )}
                    </>
                    )}
                    <div className="relative w-full">
                        <Textarea
                            placeholder={placeholder}
                            className="pr-24"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                }
                            }}
                            {...form.register("message")}
                        />
                         <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                             {settings.voiceInteractionEnabled && recognitionRef.current && (
                                <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'ghost'} onClick={handleToggleRecording} disabled={isLoading}>
                                    <Mic className="h-5 w-5" />
                                </Button>
                             )}
                            <Button type="submit" size="icon" disabled={isLoading}><Send className="h-5 w-5" /></Button>
                         </div>
                    </div>
                </form>
            </Form>
        </div>
    </Card>
  );
};
