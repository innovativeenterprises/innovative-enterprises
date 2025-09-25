
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Target, Clock, Book, BrainCircuit } from 'lucide-react';
import { generateLearningPath } from '@/ai/flows/learning-path-generator';
import { LearningPathInputSchema, type LearningPathInput, type LearningPathOutput } from '@/ai/flows/learning-path-generator.schema';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';

export default function LearningPathGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<LearningPathOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<LearningPathInput>({
    resolver: zodResolver(LearningPathInputSchema),
    defaultValues: {
      learningGoal: '',
      currentKnowledge: '',
      targetAudience: 'Beginner',
    },
  });

  const onSubmit: SubmitHandler<LearningPathInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateLearningPath(data);
      setResponse(result);
      toast({ title: 'Learning Path Generated!', description: 'Your custom curriculum is ready.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate learning path. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <BrainCircuit className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Learning Path Generator</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Define your learning goal and let our AI curriculum designer create a structured, step-by-step learning path for you.
                    </p>
                </div>
                
                <Card>
                    <CardHeader>
                    <CardTitle>Create Your Learning Path</CardTitle>
                    <CardDescription>Tell the AI what you want to learn.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="learningGoal" render={({ field }) => (
                                <FormItem><FormLabel>What is your learning goal?</FormLabel><FormControl><Input placeholder="e.g., 'Learn to build web applications with Next.js'" {...field} /></FormControl><FormMessage/></FormItem>
                            )}/>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="targetAudience" render={({ field }) => (
                                    <FormItem><FormLabel>What is your current level?</FormLabel><FormControl><Input placeholder="e.g., Beginner, Intermediate" {...field} /></FormControl><FormMessage/></FormItem>
                                )}/>
                                <FormField control={form.control} name="currentKnowledge" render={({ field }) => (
                                    <FormItem><FormLabel>Any prior knowledge? (Optional)</FormLabel><FormControl><Input placeholder="e.g., 'I know some basic HTML and CSS'" {...field} /></FormControl><FormMessage/></FormItem>
                                )}/>
                            </div>
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Create My Path</>}
                        </Button>
                        </form>
                    </Form>
                    </CardContent>
                </Card>
                
                {isLoading && (
                    <Card><CardContent className="p-6 text-center space-y-4"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="text-muted-foreground">The AI is designing your curriculum...</p></CardContent></Card>
                )}

                {response && (
                    <Card>
                    <CardHeader>
                        <CardTitle>{response.title}</CardTitle>
                        <CardDescription>{response.description}</CardDescription>
                        <div className="pt-2"><Badge>Total Time: {response.totalEstimatedHours} hours</Badge></div>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {response.modules.map((module, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 text-primary p-2 rounded-md">{index + 1}</div>
                                    <span className="font-semibold text-lg">{module.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-12 pr-4 space-y-4">
                                <p className="text-muted-foreground">{module.summary}</p>
                                <div className="space-y-3">
                                    {module.topics.map((topic, topicIndex) => (
                                        <div key={topicIndex} className="p-3 rounded-md border bg-muted/50">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold flex items-center gap-2"><Book className="h-4 w-4"/> {topic.name}</p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/> {topic.estimatedHours} hrs</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground pl-6 mt-1">{topic.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </CardContent>
                    </Card>
                )}

            </div>
        </div>
    </div>
  );
}
