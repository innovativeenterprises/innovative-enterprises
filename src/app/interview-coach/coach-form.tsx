
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateInterviewQuestions } from '@/ai/flows/interview-coach';
import type { InterviewQuestion } from '@/ai/flows/interview-coach.schema';
import { generateVideo } from '@/ai/flows/video-generator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Bot, User, ArrowLeft, ArrowRight, Video, VideoOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';

const FormSchema = z.object({
  jobTitle: z.string().min(3, 'Please enter a valid job title.'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function InterviewCoachForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [interviewerVideoUrl, setInterviewerVideoUrl] = useState<string | null>(null);
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
    setInterviewerVideoUrl(null);
    setCurrentQuestionIndex(0);

    try {
        toast({ title: "Preparing your session...", description: "Generating questions and preparing the virtual interviewer." });

        const questionsPromise = generateInterviewQuestions(data);
        const videoPromise = generateVideo({ 
            prompt: "A short, looping, photorealistic video of a friendly, professional HR manager nodding slightly in an office setting. They are looking directly at the camera as if listening. This is for a virtual interview simulation.",
            durationSeconds: 8,
        });

        const [questionsResult, videoUrl] = await Promise.all([questionsPromise, videoPromise]);
        
        setQuestions(questionsResult.questions);
        setInterviewerVideoUrl(videoUrl);

        toast({ title: "Session Ready!", description: "Your interview practice session is ready to begin." });

    } catch (error) {
        console.error(error);
        toast({
            title: 'Error Preparing Session',
            description: 'Failed to generate interview questions or video. Please try again.',
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
      setInterviewerVideoUrl(null);
      setCurrentQuestionIndex(0);
      setHasCameraPermission(false);
      form.reset();
  }

  const renderContent = () => {
    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-10 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Your AI Coach is preparing your questions and the virtual interviewer... this may take up to a minute.</p>
                </CardContent>
            </Card>
        );
    }

    if (questions.length > 0 && interviewerVideoUrl) {
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
                             <video src={interviewerVideoUrl} loop autoPlay muted playsInline className="w-full h-full object-cover opacity-90" />
                             <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded-md">
                                 <p className="font-semibold">AI Interviewer</p>
                             </div>
                        </div>
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            {!hasCameraPermission && (
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
