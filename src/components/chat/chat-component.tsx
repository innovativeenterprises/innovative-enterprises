'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Square, Bot, User, Volume2, Link as LinkIcon, CheckCircle, ShoppingCart } from 'lucide-react';
import type { LucideIcon } from "lucide-react";
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { store } from '@/lib/global-store';
import { type Product } from '@/lib/products.schema';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';
import { useSettings } from '../layout/settings-provider';

interface Message {
  role: 'user' | 'bot';
  content: string;
  imageUrl?: string;
  meetingUrl?: string;
  contactOptions?: {
      email?: string;
      whatsapp?: string;
  };
  itemAddedToCart?: Product;
  suggestedReplies?: string[];
}

const FormSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});
type FormValues = z.infer<typeof FormSchema>;

interface ChatComponentProps {
    agentName: string;
    agentIcon: LucideIcon;
    agentDescription: string;
    welcomeMessage: string;
    placeholder: string;
    aiFlow: (input: { [key: string]: any }) => Promise<any>;
    suggestedReplies?: string[];
}

export const ChatComponent = ({
    agentName,
    agentIcon: AgentIcon,
    agentDescription,
    welcomeMessage,
    placeholder,
    aiFlow,
    suggestedReplies: initialSuggestedReplies,
}: ChatComponentProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { settings } = useSettings();

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
        audioRef.current = null;
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
    setMessages([{ role: 'bot', content: welcomeMessage, suggestedReplies: initialSuggestedReplies || ["What services do you offer?", "Tell me about your products", "How can I become a partner?"] }]);
    
    // Cleanup function to stop audio when the component unmounts
    return () => {
      stopAudio();
    };
  }, [welcomeMessage, initialSuggestedReplies, stopAudio]);

  const handleTextToSpeech = async (text: string) => {
      stopAudio();
      setIsPlaying(true);
      try {
          const response = await textToSpeech({ textToSpeak: text, voice: 'onyx' });
          if(response.audioUrl) {
            const audio = new Audio(response.audioUrl);
            audioRef.current = audio;
            audio.play();
            audio.onended = () => {
                setIsPlaying(false);
                audioRef.current = null;
            };
          }
      } catch (error) {
          console.error("TTS Error:", error);
          toast({ title: 'Audio Error', description: 'Could not play audio response.', variant: 'destructive'});
          setIsPlaying(false);
      }
  }

  const submitMessage = async (message: string) => {
    if (!message.trim()) return;
    
    stopAudio();
    setIsLoading(true);
    setShowSuggestions(false);
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    form.reset();

    try {
      // The AI flow can return 'answer' (from FAQ) or 'response' (from other agents)
      const result = await aiFlow({ question: message, message: message, query: message });
      const botMessage: Message = { 
          role: 'bot', 
          content: result.answer || result.response,
          meetingUrl: result.meetingUrl,
          contactOptions: result.contactOptions,
          imageUrl: result.imageUrl,
          itemAddedToCart: result.itemAddedToCart,
          suggestedReplies: result.suggestedReplies,
      };
      setMessages(prev => [...prev, botMessage]);

      if (botMessage.itemAddedToCart) {
          const product = botMessage.itemAddedToCart;
          store.set(state => {
            const existingItem = state.cart.find(item => item.id === product.id);
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                }
            }
            return {
                ...state,
                cart: [...state.cart, { ...product, quantity: 1 }]
            }
        });
      }

      setShowSuggestions(true);
      
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
      setTimeout(scrollToBottom, 100);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    submitMessage(data.message);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    form.setValue('message', suggestion);
    submitMessage(suggestion);
  }

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  return (
    <Card className="w-full h-full flex flex-col border-0 shadow-none rounded-none">
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
                                    <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-full" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\\n/g, '<br />') }} />
                                     {msg.itemAddedToCart && (
                                        <div className="mt-3 pt-3 border-t border-muted-foreground/20 flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                                <Image src={msg.itemAddedToCart.image!} alt={msg.itemAddedToCart.name} fill className="object-cover"/>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{msg.itemAddedToCart.name}</p>
                                                <p className="text-xs text-muted-foreground">1 x OMR {msg.itemAddedToCart.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )}
                                    {msg.meetingUrl && (
                                        <Button asChild variant="secondary" size="sm" className="mt-3 w-full">
                                            <Link href={msg.meetingUrl} target="_blank">Book a Meeting</Link>
                                        </Button>
                                    )}
                                    {msg.contactOptions && (
                                        <div className="mt-3 pt-3 border-t border-muted-foreground/20 flex gap-2">
                                            {msg.contactOptions.email && <Button asChild variant="outline" size="sm"><a href={`mailto:${"'" + msg.contactOptions.email + "'"}`}>Email</a></Button>}
                                            {msg.contactOptions.whatsapp && <Button asChild variant="outline" size="sm"><a href={`https://wa.me/${msg.contactOptions.whatsapp}`} target="_blank">WhatsApp</a></Button>}
                                        </div>
                                    )}
                                    {msg.imageUrl && (
                                         <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-md border">
                                            <Image src={msg.imageUrl} alt="Generated for social media post" fill className="object-cover"/>
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
                        <Button type="button" size="icon" variant="outline" onClick={() => handleTextToSpeech(lastMessage!.content)} disabled={isLoading || !lastMessage || lastMessage.role !== 'bot' || !lastMessage.content}>
                            <Volume2 className="h-5 w-5"/>
                        </Button>
                    )}
                    </>
                    )}
                     <div className="relative w-full">
                        <VoiceEnabledTextarea
                            placeholder={placeholder}
                            className="pr-12"
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
                            <Button type="submit" size="icon" disabled={isLoading} variant="ghost"><Send className="h-5 w-5" /></Button>
                         </div>
                    </div>
                </form>
            </Form>
        </div>
    </Card>
  );
};
