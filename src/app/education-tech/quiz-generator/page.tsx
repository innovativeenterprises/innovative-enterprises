
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ClipboardCheck, ArrowLeft } from 'lucide-react';
import { QuizGeneratorInputSchema, type QuizGeneratorInput, type QuizGeneratorOutput, type Question } from '@/ai/flows/quiz-generator.schema';
import { generateQuiz } from '@/ai/flows/quiz-generator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

const QuizResults = ({ quiz, answers }: { quiz: QuizGeneratorOutput, answers: Record<number, string> }) => {
    const score = quiz.questions.reduce((correctCount, q, index) => {
        return answers[index] === q.correctAnswer ? correctCount + 1 : correctCount;
    }, 0);
    const percentage = (score / quiz.questions.length) * 100;

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Quiz Results: {quiz.quizTitle}</CardTitle>
                <CardDescription>You scored {score} out of {quiz.questions.length} ({percentage.toFixed(0)}%). Review your answers below.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full space-y-4">
                    {quiz.questions.map((q, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className={cn("p-4 rounded-md", answers[index] === q.correctAnswer ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-900" : "bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900")}>
                                Question {index + 1}: {q.questionText}
                            </AccordionTrigger>
                            <AccordionContent className="p-4 border rounded-b-md">
                                <p className="mb-2 text-sm"><strong>Your Answer:</strong> {answers[index] || "Not answered"}</p>
                                <p className="mb-2 text-sm"><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                                <p className="text-sm italic text-muted-foreground"><strong>Explanation:</strong> {q.explanation}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};


export default function QuizGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizGeneratorOutput | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuizGeneratorInput>({
    resolver: zodResolver(QuizGeneratorInputSchema),
    defaultValues: {
      topic: 'The basics of Photosynthesis',
      difficulty: 'Easy',
      numQuestions: 5,
    },
  });

  const onSubmit: SubmitHandler<QuizGeneratorInput> = async (data) => {
    setIsLoading(true);
    setQuiz(null);
    setAnswers({});
    setIsSubmitted(false);
    try {
      const result = await generateQuiz(data);
      setQuiz(result);
      toast({ title: 'Quiz Generated!', description: 'Your new quiz is ready to be taken.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate quiz. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < (quiz?.questions.length || 0)) {
      toast({ title: 'Incomplete Quiz', description: 'Please answer all questions before submitting.', variant: 'destructive' });
      return;
    }
    setIsSubmitted(true);
  };
  
  const startOver = () => {
    setQuiz(null);
    setAnswers({});
    setIsSubmitted(false);
    form.reset();
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
         <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/education-tech/eduflow"><ArrowLeft className="mr-2 h-4 w-4" />Back to EduFlow Suite</Link>
                </Button>
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <ClipboardCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Quiz Generator</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Enter any topic, and our AI will instantly generate a multiple-choice quiz, complete with answers and explanations. Perfect for educators and students.
                    </p>
                </div>
            </div>

            {!quiz ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Quiz</CardTitle>
                        <CardDescription>Enter a topic, select a difficulty, and choose the number of questions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quiz Topic</FormLabel>
                                <FormControl><Input placeholder="e.g., The Roman Empire, or Introduction to Javascript" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Difficulty</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="numQuestions"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Questions</FormLabel>
                                    <FormControl><Input type="number" min="3" max="10" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quiz...</>
                            ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Quiz</>
                            )}
                        </Button>
                        </form>
                    </Form>
                    </CardContent>
                </Card>
            ) : isSubmitted ? (
                 <>
                    <QuizResults quiz={quiz} answers={answers} />
                    <Button onClick={startOver} className="w-full">Create Another Quiz</Button>
                </>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{quiz.quizTitle}</CardTitle>
                        <CardDescription>Answer the questions below to test your knowledge.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {quiz.questions.map((q, index) => (
                             <Card key={index} className="p-4 bg-muted/50">
                                <p className="font-semibold">{index + 1}. {q.questionText}</p>
                                <RadioGroup
                                    className="mt-4 space-y-2"
                                    value={answers[index]}
                                    onValueChange={(value) => handleAnswerChange(index, value)}
                                >
                                    {q.options.map((option, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                                            <Label htmlFor={`q${index}-o${i}`}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                             </Card>
                        ))}
                         <Button onClick={handleSubmitQuiz} className="w-full">Submit Quiz</Button>
                    </CardContent>
                </Card>
            )}

         </div>
      </div>
    </div>
  );
}
