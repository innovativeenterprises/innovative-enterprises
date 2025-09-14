'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateInterviewQuestions } from '@/ai/flows/interview-coach';
import type { InterviewQuestion } from '@/ai/flows/interview-coach.schema';
import { getInterviewFeedback } from '@/ai/flows/interview-feedback';
import type { InterviewFeedbackOutput } from '@/ai/flows/interview-feedback.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Bot, User, ArrowLeft, ArrowRight, VideoOff, ThumbsUp, Lightbulb, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';

const FormSchema = z.object({
  jobTitle: z.string().min(3, 'Please enter a valid job title.'),
});
type FormValues = z.infer<typeof FormSchema>;

const AnswerSchema = z.object({
    answer: z.string().min(10, 'Please provide an answer of at least 10 characters.'),
});
type AnswerValues = z.infer<typeof AnswerSchema>;


export default function InterviewCoachForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<InterviewFeedbackOutput | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      jobTitle: '',
    },
  });
  
  const answerForm = useForm<AnswerValues>({
      resolver: zodResolver(AnswerSchema),
      defaultValues: { answer: '' }
  });

  useEffect(() => {
    // This effect will run when `questions` has been populated.
    const getCameraPermission = async () => {
      if (questions.length > 0 && hasCameraPermission === null) {
         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('Camera API not available.');
            setHasCameraPermission(false);
            return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      }
    };

    getCameraPermission();

    // Cleanup function to stop video stream when component unmounts or questions are cleared
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [questions, hasCameraPermission, toast]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setHasCameraPermission(null);
    setFeedback(null);
    answerForm.reset();

    try {
        toast({ title: "Preparing your session...", description: "Generating questions for your interview practice." });
        const questionsResult = await generateInterviewQuestions(data);
        setQuestions(questionsResult.questions);
        toast({ title: "Session Ready!", description: "Your interview practice session is ready to begin." });
    } catch (error) {
        console.error(error);
        toast({
            title: 'Error Preparing Session',
            description: 'Failed to generate interview questions. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleGetFeedback: SubmitHandler<AnswerValues> = async (data) => {
    setIsGettingFeedback(true);
    setFeedback(null);
    try {
        const result = await getInterviewFeedback({
            question: questions[currentQuestionIndex].question,
            answer: data.answer,
        });
        setFeedback(result);
    } catch (error) {
         toast({ title: 'Error Getting Feedback', description: 'Could not analyze your answer.', variant: 'destructive' });
    } finally {
        setIsGettingFeedback(false);
    }
  };


  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
      answerForm.reset();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
      answerForm.reset();
    }
  };

  const startOver = () => {
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setHasCameraPermission(null);
      setFeedback(null);
      answerForm.reset();
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      form.reset();
  }

  const renderContent = () => {
    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-10 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Your AI Coach is preparing your questions...</p>
                </CardContent>
            </Card>
        );
    }

    if (questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        return (
             <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-center">Virtual Interview Simulation</CardTitle>
                    <CardDescription className="text-center">Role: {form.getValues('jobTitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center text-white">
                             <Image 
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1920&auto=format&fit=crop" 
                                alt="AI Interviewer"
                                fill
                                className="object-cover opacity-90"
                                data-ai-hint="professional woman"
                             />
                             <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded-md">
                                 <p className="font-semibold">AI Interviewer</p>
                             </div>
                        </div>
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            {hasCameraPermission === false && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
                                    <VideoOff className="w-10 h-10 mb-2" />
                                    <h3 className="font-semibold">Camera Not Found</h3>
                                    <p className="text-xs">Please grant camera permission.</p>
                                </div>
                            )}
                             <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded-md">
                                <p className="font-semibold">You</p>
                             </div>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p>
                        <Badge>{currentQuestion.category}</Badge>
                    </div>
                    
                    <Alert className="border-primary/50">
                        <Bot className="h-4 w-4" />
                        <AlertTitle className="font-semibold">Interviewer's Question:</AlertTitle>
                        <AlertDescription className="text-lg font-medium text-foreground pt-1">
                            {currentQuestion.question}
                        </AlertDescription>
                    </Alert>

                     <Form {...answerForm}>
                        <form onSubmit={answerForm.handleSubmit(handleGetFeedback)} className="space-y-4">
                            <FormField
                                control={answerForm.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Answer</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type your answer here..."
                                                rows={5}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <Button type="submit" disabled={isGettingFeedback} className="w-full">
                                {isGettingFeedback ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <GraduationCap className="mr-2 h-4 w-4"/>}
                                Get Feedback
                             </Button>
                        </form>
                     </Form>

                    {isGettingFeedback && (
                        <div className="text-center text-muted-foreground p-4"><Loader2 className="inline-block mr-2 h-4 w-4 animate-spin"/> Analyzing your answer...</div>
                    )}
                    
                    {feedback && (
                        <div className="space-y-4 pt-4 border-t">
                             <h3 className="font-semibold text-lg text-center">AI Feedback</h3>
                             <div className="grid md:grid-cols-2 gap-4">
                                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                    <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400"/>
                                    <AlertTitle>What Went Well</AlertTitle>
                                    <AlertDescription className="text-green-800 dark:text-green-200">{feedback.positiveFeedback}</AlertDescription>
                                </Alert>
                                 <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800">
                                    <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400"/>
                                    <AlertTitle>Areas for Improvement</AlertTitle>
                                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">{feedback.improvementSuggestions}</AlertDescription>
                                </Alert>
                             </div>
                             <Alert>
                                <Sparkles className="h-4 w-4 text-primary"/>
                                <AlertTitle>Suggested Answer</AlertTitle>
                                <AlertDescription className="prose prose-sm max-w-none">{feedback.suggestedAnswer}</AlertDescription>
                            </Alert>
                        </div>
                    )}

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
                        <><Sparkles className="mr-2 h-4 w-4" /> Generate Questions & Start Simulation</>
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
