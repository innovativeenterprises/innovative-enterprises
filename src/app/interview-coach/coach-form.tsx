
'use client';

import { useState, useRef, useEffect } from 'react';
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
import { Loader2, Sparkles, Bot, User, ArrowLeft, ArrowRight, Video, VideoOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FormSchema = z.object({
  jobTitle: z.string().min(3, 'Please enter a valid job title.'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function InterviewCoachForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      jobTitle: '',
    },
  });

  useEffect(() => {
    // This effect will run when `questions` has been populated.
    const getCameraPermission = async () => {
      if (questions.length > 0 && !hasCameraPermission) {
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
      setHasCameraPermission(false);
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
             <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-center">Virtual Interview Simulation</CardTitle>
                    <CardDescription className="text-center">Role: {form.getValues('jobTitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                         {!hasCameraPermission && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                                <VideoOff className="w-12 h-12 mb-4" />
                                <h3 className="text-lg font-semibold">Camera Not Available</h3>
                                <p className="text-sm text-center">Please grant camera permission to use the video simulation feature.</p>
                            </div>
                        )}
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
