
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateInterviewQuestions } from '@/ai/flows/interview-coach';
import type { InterviewQuestion } from '@/ai/flows/interview-coach.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Bot, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FormSchema = z.object({
  jobTitle: z.string().min(3, 'Please enter a valid job title.'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function InterviewCoachForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      jobTitle: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    try {
      const result = await generateInterviewQuestions(data);
      setQuestions(result.questions);
      toast({ title: "Questions Generated!", description: "Your interview practice session is ready to begin." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate interview questions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const startOver = () => {
      setQuestions([]);
      setCurrentQuestionIndex(0);
      form.reset();
  }

  const renderContent = () => {
    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Your AI Coach is preparing your questions...</p>
                </CardContent>
            </Card>
        );
    }

    if (questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="text-center">Interview Practice Session</CardTitle>
                    <CardDescription className="text-center">Role: {form.getValues('jobTitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p>
                        <Badge>{currentQuestion.category}</Badge>
                    </div>
                    <div className="flex items-start gap-4 p-4 min-h-[120px] bg-muted rounded-lg">
                        <div className="bg-primary text-primary-foreground p-2 rounded-full">
                            <Bot className="h-5 w-5"/>
                        </div>
                        <p className="flex-1 font-semibold text-lg">{currentQuestion.question}</p>
                    </div>
                    <div className="flex items-start gap-4 p-4 min-h-[150px]">
                         <div className="bg-accent text-accent-foreground p-2 rounded-full">
                            <User className="h-5 w-5"/>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-muted-foreground mb-2">Your Answer:</p>
                             <div className="prose prose-sm max-w-full text-foreground whitespace-pre-wrap p-2 border-b-2 border-primary focus-within:border-primary-focus">
                                 <p className="text-sm text-muted-foreground italic">Think about your response. In a future version, you'll be able to record your answer here and get feedback.</p>
                             </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <div className="flex justify-between w-full">
                        <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                        <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
                             Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="ghost" onClick={startOver}>Start Over with a New Role</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Start Your Practice Session</CardTitle>
                <CardDescription>Enter the job title you are preparing for, and our AI will generate a list of relevant interview questions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Target Job Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Senior Product Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Questions...</>
                    ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> Generate Questions</>
                    )}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      {renderContent()}
    </div>
  );
}
