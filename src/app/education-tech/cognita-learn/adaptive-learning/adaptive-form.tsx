
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, Lightbulb, BookOpen, HelpCircle } from 'lucide-react';
import { generateAdaptiveLesson } from '@/ai/flows/adaptive-learning-tutor';
import { AdaptiveTutorInputSchema, type AdaptiveTutorInput, type AdaptiveTutorOutput } from '@/ai/flows/adaptive-learning-tutor.schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FormSchema = AdaptiveTutorInputSchema;
type FormValues = z.infer<typeof FormSchema>;

export default function AdaptiveLearningForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AdaptiveTutorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      struggleDescription: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
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
    <div className="space-y-8">
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
  );
}
