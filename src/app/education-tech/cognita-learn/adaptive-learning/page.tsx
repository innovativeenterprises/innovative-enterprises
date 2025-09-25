
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Lightbulb, BookOpen, HelpCircle, BrainCircuit } from 'lucide-react';
import { generateAdaptiveLesson } from '@/ai/flows/adaptive-learning-tutor';
import { AdaptiveTutorInputSchema, type AdaptiveTutorInput, type AdaptiveTutorOutput } from '@/ai/flows/adaptive-learning-tutor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdaptiveLearningPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AdaptiveTutorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AdaptiveTutorInput>({
    resolver: zodResolver(AdaptiveTutorInputSchema),
    defaultValues: {
      topic: '',
      struggleDescription: '',
    },
  });

  const onSubmit: SubmitHandler<AdaptiveTutorInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateAdaptiveLesson(data);
      setResponse(result);
      toast({ title: 'Lesson Generated!', description: 'Your personalized explanation is ready.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate lesson. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <BrainCircuit className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Adaptive Learning Tutor</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Struggling with a concept? Tell our AI tutor what you're having trouble with, and it will generate a custom explanation just for you.
                    </p>
                </div>
                
                 <Card>
                    <CardHeader>
                    <CardTitle>Get a Custom Explanation</CardTitle>
                    <CardDescription>Tell the AI Tutor what you're finding difficult.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Topic or Subject</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g., Photosynthesis" {...field} />
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
                                <FormLabel>What are you struggling with?</FormLabel>
                                <FormControl>
                                <Textarea placeholder="e.g., 'I don't understand the difference between the light and dark reactions.'" rows={4} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Explain It to Me</>}
                        </Button>
                        </form>
                    </Form>
                    </CardContent>
                </Card>

                {isLoading && (
                    <Card><CardContent className="p-6 text-center space-y-4"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="text-muted-foreground">The AI Tutor is preparing your lesson...</p></CardContent></Card>
                )}

                {response && (
                    <Card>
                    <CardHeader>
                        <CardTitle>Your Personalized Lesson</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert>
                        <BookOpen className="h-4 w-4" />
                        <AlertTitle>Tailored Explanation</AlertTitle>
                        <AlertDescription>{response.tailoredExplanation}</AlertDescription>
                        </Alert>
                        <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Simple Analogy</AlertTitle>
                        <AlertDescription>{response.analogy}</AlertDescription>
                        </Alert>
                        <Alert>
                        <HelpCircle className="h-4 w-4" />
                        <AlertTitle>Practice Question</AlertTitle>
                        <AlertDescription>{response.practiceQuestion}</AlertDescription>
                        </Alert>
                    </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
