
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, BrainCircuit, ArrowLeft, Clock, ListOrdered, CheckCircle } from 'lucide-react';
import { LearningPathInputSchema, type LearningPathInput, type LearningPathOutput } from '@/ai/flows/learning-path-generator.schema';
import { generateLearningPath } from '@/ai/flows/learning-path-generator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
      toast({
        title: 'Learning Path Generated!',
        description: 'Your personalized curriculum is ready.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the learning path. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/education-tech/cognita-learn"><ArrowLeft className="mr-2 h-4 w-4" />Back to CognitaLearn</Link>
                    </Button>
                    <div className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <BrainCircuit className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Learning Path Generator</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Define your learning goal and let our AI curriculum designer create a structured, step-by-step learning path for you.
                        </p>
                    </div>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Create Your Learning Path</CardTitle>
                        <CardDescription>Tell us what you want to learn and your current skill level.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="learningGoal"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>What is your learning goal?</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g., 'Learn the fundamentals of web development' or 'Master Python for data science'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="currentKnowledge"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Knowledge (Optional)</FormLabel>
                                            <FormControl>
                                            <Input placeholder="e.g., 'I know basic HTML and CSS'" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="targetAudience"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Skill Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                                    {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Path...</>
                                    ) : (
                                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Learning Path</>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {isLoading && (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">The AI is designing your custom curriculum...</p>
                        </CardContent>
                    </Card>
                )}

                {response && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{response.pathTitle}</CardTitle>
                            <CardDescription>
                                <p>{response.pathDescription}</p>
                                <p className="font-semibold mt-2 flex items-center gap-2"><Clock className="h-4 w-4" /> Total Estimated Time: {response.totalEstimatedHours} hours</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="multiple" className="w-full space-y-4" defaultValue={['item-0']}>
                                {response.modules.map((module, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="p-4 rounded-md bg-muted/50 hover:bg-muted">
                                        <div className="text-left">
                                            <h3 className="font-semibold text-primary">Module {index + 1}: {module.title}</h3>
                                            <p className="text-sm text-muted-foreground">{module.description}</p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 border rounded-b-md">
                                         <ul className="space-y-3">
                                            {module.topics.map((topic, topicIndex) => (
                                                <li key={topicIndex} className="flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium">{topic.title}</p>
                                                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="h-3 w-3" /> ~{topic.estimatedHours} hours</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
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

  