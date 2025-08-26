
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, CheckCircle, Search, FileUp, ArrowLeft, Bot, MessageSquare } from 'lucide-react';
import { sanadServiceGroups } from '@/lib/sanad-services';
import { analyzeSanadTask, type SanadTaskAnalysisOutput } from '@/ai/flows/sanad-task-analysis';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { answerQuestion, type AnswerQuestionOutput } from '@/ai/flows/ai-powered-faq';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const ServiceSchema = z.object({
  serviceType: z.string().min(1, "Please select a service type."),
});
type ServiceValues = z.infer<typeof ServiceSchema>;

const DetailsSchema = z.object({
    taskDescription: z.string().min(20, "Please provide a more detailed description (at least 20 characters)."),
    documentFiles: z.any().optional(),
});
type DetailsValues = z.infer<typeof DetailsSchema>;


// --- Chatbot Component ---
const SanadChatbot = ({ onServiceSelect }: { onServiceSelect: (service: string) => void }) => {
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; }[]>([
        { sender: 'bot', text: "Hello! I'm Saif, your Sanad Hub assistant. How can I help you today? You can ask me to find a service for you." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        scrollViewportRef.current?.scrollTo({ top: scrollViewportRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // A simplified list of services for the chatbot to recognize
        const serviceKeywords = Object.values(sanadServiceGroups).flat().join(', ');

        try {
            const result = await answerQuestion({
                question: `Based on the following user query, which of these Sanad services is the best match? If you find a good match, respond with 'SERVICE_SELECTED: [Service Name]'. If not, just answer the question normally. User Query: "${input}". Available Services: ${serviceKeywords}.`,
            });
            
            const botResponseText = result.answer;
            let botMessage = { sender: 'bot' as const, text: botResponseText };
            
            if (botResponseText.startsWith('SERVICE_SELECTED:')) {
                const selectedService = botResponseText.replace('SERVICE_SELECTED:', '').trim();
                onServiceSelect(selectedService);
                botMessage.text = `Great! I've selected "${selectedService}" for you. Please proceed with the form.`;
                toast({ title: "Service Selected", description: `Saif has selected a service for you.` });
            }
            
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I had trouble connecting. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Ask Saif, the Sanad AI Agent
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" side="top" align="end">
                <Card className="h-[400px] flex flex-col">
                    <CardHeader className="bg-muted p-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" /> Saif - Sanad Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden p-2">
                        <ScrollArea className="h-full" viewportRef={scrollViewportRef}>
                            <div className="space-y-3 p-2">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                        {msg.sender === 'bot' && <Bot className="h-5 w-5 text-primary shrink-0 mt-1" />}
                                        <p className={`text-sm p-2 rounded-lg max-w-[85%] ${msg.sender === 'user' ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>{msg.text}</p>
                                    </div>
                                ))}
                                {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-2 border-t">
                        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." className="flex-1" />
                            <Button type="submit" size="icon" disabled={isLoading}><Send className="h-4 w-4"/></Button>
                        </form>
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    );
};


// --- Main Component ---
export default function TaskForm({ isVisible }: { isVisible: boolean }) {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [requiredDocs, setRequiredDocs] = useState<SanadTaskAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const serviceForm = useForm<ServiceValues>({
    resolver: zodResolver(ServiceSchema),
  });

  const detailsForm = useForm<DetailsValues>();

  const filteredServices = useMemo(() => {
    if (!searchTerm) return sanadServiceGroups;
    
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: typeof sanadServiceGroups = {};

    for (const group in sanadServiceGroups) {
      const services = sanadServiceGroups[group].filter(service =>
        service.toLowerCase().includes(lowercasedFilter)
      );
      if (services.length > 0) {
        filtered[group] = services;
      }
    }
    return filtered;
  }, [searchTerm]);

  const handleServiceSelect = async (service: string) => {
    serviceForm.setValue("serviceType", service);
    setIsAnalyzing(true);
    try {
        const result = await analyzeSanadTask({ serviceName: service });
        setRequiredDocs(result);
        setStep(2);
    } catch(e) {
        console.error(e);
        toast({ title: "Error", description: "Could not determine document requirements. Please proceed with manual description.", variant: 'destructive' });
        setRequiredDocs(null); // Ensure we proceed even if AI fails
        setStep(2);
    } finally {
        setIsAnalyzing(false);
    }
  };
  
  const handleChatbotServiceSelect = (service: string) => {
    const allServices = Object.values(sanadServiceGroups).flat();
    const foundService = allServices.find(s => s.toLowerCase() === service.toLowerCase());
    if (foundService) {
        handleServiceSelect(foundService);
    } else {
        toast({ title: "Service Not Found", description: `The AI suggested a service that isn't in our list: "${service}". Please select one manually.`, variant: 'destructive'});
    }
  }


  const onSubmit: SubmitHandler<DetailsValues> = async (data) => {
    setIsLoading(true);
    console.log("Submitting Sanad Hub Task:", {
        service: serviceForm.getValues('serviceType'),
        description: data.taskDescription,
        files: data.documentFiles,
    });
    // Simulate API call to task routing engine
    await new Promise(res => setTimeout(res, 2000));
    
    toast({
        title: "Task Submitted Successfully!",
        description: "Your request has been routed to eligible Sanad offices. You will receive offers shortly.",
    });
    setIsSubmitted(true);
    setIsLoading(false);
  };
  
  const resetAll = () => {
    setStep(1);
    setSearchTerm('');
    setIsAnalyzing(false);
    setRequiredDocs(null);
    setIsLoading(false);
    setIsSubmitted(false);
    serviceForm.reset();
    detailsForm.reset();
  }


  if (!isVisible) return null;
  
  if (isSubmitted) {
    return (
        <Card>
            <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Your Task is On Its Way!</CardTitle>
                        <CardDescription>
                            We've sent your request to our network of Sanad offices. You will be notified in your dashboard as soon as offers start coming in.
                        </CardDescription>
                    </div>
                    <Button onClick={resetAll}>Submit Another Task</Button>
                </div>
            </CardContent>
        </Card>
    );
  }

  if (isAnalyzing) {
    return (
         <Card>
            <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Analyzing Request...</CardTitle>
                        <CardDescription>Fahim, our Research Agent, is determining the required documents for your task.</CardDescription>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="transition-all duration-500">
        {step === 1 && (
            <>
                <CardHeader>
                    <CardTitle>Step 1: Select a Service</CardTitle>
                    <CardDescription>Choose the service you need, or ask our AI agent for help.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                                placeholder="Search for a service..." 
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <SanadChatbot onServiceSelect={handleChatbotServiceSelect} />
                    </div>
                    <ScrollArea className="h-96 w-full pr-4">
                        <div className="space-y-4">
                            {Object.entries(filteredServices).map(([group, services]) => (
                                <div key={group}>
                                    <h3 className="font-semibold text-muted-foreground">{group}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                        {services.map(service => (
                                            <Button 
                                                key={service} 
                                                variant="outline" 
                                                className="justify-start h-auto py-2"
                                                onClick={() => handleServiceSelect(service)}
                                            >
                                                {service}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </>
        )}

        {step === 2 && (
            <Form {...detailsForm}>
                <form onSubmit={detailsForm.handleSubmit(onSubmit)}>
                    <CardHeader>
                         <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="self-start -ml-4">
                             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
                         </Button>
                         <CardTitle className="pt-2">Step 2: Provide Details & Documents</CardTitle>
                         <CardDescription>
                             You selected: <span className="font-semibold text-primary">{serviceForm.getValues("serviceType")}</span>
                         </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         {requiredDocs && (
                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Required Documents</CardTitle>
                                    {requiredDocs.notes && <CardDescription>{requiredDocs.notes}</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 list-disc list-inside">
                                        {requiredDocs.documentList.map((doc, i) => <li key={i}>{doc}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                         )}
                         <FormField
                            control={detailsForm.control}
                            name="taskDescription"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Task Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Please provide all relevant details, such as names, CR numbers, visa types, deadlines, etc."
                                    rows={6}
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={detailsForm.control}
                            name="documentFiles"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Attach Documents</FormLabel>
                                <FormControl>
                                    <Input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                </FormControl>
                                <FormDescription>Upload any required forms, IDs, or supporting documents.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Task...</>
                        ) : (
                            <><Send className="mr-2 h-4 w-4" /> Find a Sanad Office</>
                        )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        )}
    </Card>
  );
}
