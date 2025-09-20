
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, ClipboardCheck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz } from '@/ai/flows/quiz-generator';
import { QuizGeneratorInputSchema, type QuizGeneratorOutput } from '@/ai/flows/quiz-generator.schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Quiz Generator | Innovative Enterprises",
  description: "Enter any topic, and our AI will instantly generate a multiple-choice quiz, complete with answers and explanations. Perfect for educators and students.",
};


const FormSchema = QuizGeneratorInputSchema;
type FormValues = z.infer<typeof FormSchema>;

function QuizForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QuizGeneratorOutput | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      difficulty: 'Medium',
      numQuestions: 5,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    setUserAnswers({});
    setIsSubmitted(false);
    try {
      const result = await generateQuiz(data);
      setResponse(result);
      toast({ title: 'Quiz Generated!', description: 'Your quiz is ready to be taken.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate quiz. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };
  
  const score = isSubmitted ? response?.questions.reduce((correct, q, i) => {
    return userAnswers[i] === q.correctAnswer ? correct + 1 : correct;
  }, 0) : 0;
  
  const scorePercentage = response ? (score! / response.questions.length) * 100 : 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a Quiz</CardTitle>
          <CardDescription>Tell the AI what topic you want a quiz on.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., The Solar System" {...field} /></FormControl><FormMessage/></FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem><FormLabel>Difficulty</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                           <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Easy"/></FormControl><Label>Easy</Label></FormItem>
                           <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Medium"/></FormControl><Label>Medium</Label></FormItem>
                           <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Hard"/></FormControl><Label>Hard</Label></FormItem>
                        </RadioGroup>
                    </FormControl><FormMessage/></FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="numQuestions"
                  render={({ field }) => (
                    <FormItem><FormLabel>Number of Questions</FormLabel><FormControl><Input type="number" min="3" max="15" {...field} /></FormControl><FormMessage/></FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Quiz</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="mt-2 text-muted-foreground">The AI is creating your quiz...</p></CardContent></Card>}

      {response && (
        <Card>
          <CardHeader><CardTitle>{response.title}</CardTitle><CardDescription>Select an answer for each question.</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            {response.questions.map((q, index) => (
              <Card key={index} className="p-4 bg-muted/50">
                <p className="font-semibold mb-3">{index + 1}. {q.questionText}</p>
                <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} value={userAnswers[index]} disabled={isSubmitted} className="space-y-2">
                    {q.options.map((option, i) => {
                        const isCorrect = option === q.correctAnswer;
                        const isSelected = userAnswers[index] === option;
                        return (
                            <FormItem key={i} className={cn("flex items-center space-x-3 space-y-0 rounded-md border p-3 transition-colors", 
                                isSubmitted && isCorrect && 'border-green-500 bg-green-500/10',
                                isSubmitted && isSelected && !isCorrect && 'border-destructive bg-destructive/10'
                            )}>
                                <FormControl><RadioGroupItem value={option}/></FormControl>
                                <Label className="font-normal flex-1 cursor-pointer">{option}</Label>
                                {isSubmitted && isCorrect && <CheckCircle className="h-5 w-5 text-green-500"/>}
                                {isSubmitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive"/>}
                            </FormItem>
                        )
                    })}
                </RadioGroup>
                {isSubmitted && <p className="text-sm mt-3 p-2 bg-background rounded-md border text-muted-foreground"><strong>Explanation:</strong> {q.explanation}</p>}
              </Card>
            ))}
          </CardContent>
           <CardFooter className="flex-col gap-4">
             {!isSubmitted ? (
                 <Button onClick={handleSubmitQuiz} className="w-full">Submit Quiz</Button>
             ) : (
                <div className="w-full text-center">
                    <h3 className="font-bold text-2xl">Your Score: {score} / {response.questions.length} ({scorePercentage.toFixed(0)}%)</h3>
                </div>
             )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}


export default function QuizGeneratorPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
         <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <ClipboardCheck className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Quiz Generator</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Enter any topic, and our AI will instantly generate a multiple-choice quiz, complete with answers and explanations. Perfect for educators and students.
                </p>
            </div>
            <QuizForm />
         </div>
      </div>
    </div>
  );
}
