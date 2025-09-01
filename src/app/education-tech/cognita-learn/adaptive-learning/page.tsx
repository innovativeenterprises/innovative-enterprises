
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, BrainCircuit, ArrowLeft, BookOpen, Lightbulb, Pencil } from 'lucide-react';
import Link from 'next/link';
import { generateAdaptiveLesson } from '@/ai/flows/adaptive-learning-tutor';
import { AdaptiveTutorInputSchema, type AdaptiveTutorOutput } from '@/ai/flows/adaptive-learning-tutor.schema';

export default function AdaptiveLearningPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AdaptiveTutorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof AdaptiveTutorInputSchema>>({
    resolver: zodResolver(AdaptiveTutorInputSchema),
    defaultValues: {
      topic: '',
      difficulty: 'Beginner',
      struggleDescription: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof AdaptiveTutorInputSchema>> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateAdaptiveLesson(data);
      setResponse(result);
      toast({
        title: 'Personalized Lesson Generated!',
        description: 'Your custom explanation is ready below.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the lesson. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto space-y-8">
                 <div>
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/education-tech/cognita-learn"><ArrowLeft className="mr-2 h-4 w-4" />Back to CognitaLearn</Link>
                    </Button>
                    <div className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <BrainCircuit className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">Adaptive Learning Tutor</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                           Struggling with a concept? Tell our AI tutor what you're having trouble with, and it will generate a custom explanation just for you.
                        </p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Get a Personalized Explanation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="topic"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>What topic are you studying?</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g., 'Newton's Second Law of Motion' or 'JavaScript Promises'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="struggleDescription"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>What part are you struggling with?</FormLabel>
                                        <FormControl>
                                            <Textarea rows={4} placeholder="e.g., 'I don't understand the difference between F=ma and weight' or 'I get confused when to use .then() vs await'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating Lesson...</> : <><Sparkles className="mr-2 h-4 w-4"/> Explain It to Me</>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {isLoading && (
                    <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="mt-2 text-muted-foreground">Your personal tutor is preparing your lesson...</p></CardContent></Card>
                )}

                {response && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Personalized Lesson on: {form.getValues('topic')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-muted rounded-lg">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/> Tailored Explanation</h3>
                                <p className="mt-2 text-muted-foreground">{response.explanation}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/> Simple Analogy</h3>
                                <p className="mt-2 text-muted-foreground italic">"{response.analogy}"</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><Pencil className="h-5 w-5 text-primary"/> Practice Question</h3>
                                <p className="mt-2 text-muted-foreground">{response.practiceQuestion}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
