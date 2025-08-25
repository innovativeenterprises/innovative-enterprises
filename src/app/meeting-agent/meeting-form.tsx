
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeMeeting } from '@/ai/flows/meeting-analysis';
import { MeetingAnalysisInputSchema, type MeetingAnalysisOutput, type MeetingAnalysisInput } from '@/ai/flows/meeting-analysis.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, Bell, User, Calendar, Check, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function MeetingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<MeetingAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<MeetingAnalysisInput>({
    resolver: zodResolver(MeetingAnalysisInputSchema),
    defaultValues: {
      transcript: '',
      participants: '',
    },
  });

  const onSubmit: SubmitHandler<MeetingAnalysisInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const result = await analyzeMeeting(data);
        setResponse(result);
        toast({
            title: 'Analysis Complete',
            description: 'Your meeting transcript has been processed.',
        });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the transcript. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    toast({
      title: 'Action Shared!',
      description: "Meeting minutes have been sent to all participants.",
    });
  }

  const handleAssign = (task: string, assignee: string) => {
    toast({
      title: 'Task Assigned!',
      description: `Task "${task}" has been assigned to ${assignee} with a notification.`,
    });
  }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Analyze a Meeting Transcript</CardTitle>
          <CardDescription>Paste the full transcript and list of participants to begin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="transcript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Transcript</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full meeting transcript here. Make sure to include speaker names (e.g., 'John Doe: Hello everyone.')."
                        rows={15}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Jumaa Al Hadidi, Anwar Ahmed Sharif, Huda Al Salmi'" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Analyze Transcript</>
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
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your transcript... This may take a moment.</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{response.title}</CardTitle>
            <CardDescription>
                Below are the meeting minutes generated by the AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg border">{response.summary}</p>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ListChecks /> Discussion Points</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        {response.discussionPoints.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Check /> Decisions Made</h3>
                     <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        {response.decisionsMade.map((decision, index) => <li key={index}>{decision}</li>)}
                    </ul>
                </div>
             </div>
             <div>
                <h3 className="text-lg font-semibold mb-2">Action Items, Tasks & Procedures</h3>
                <div className="space-y-4">
                    {response.actionItems.map((item, index) => (
                        <Alert key={index}>
                            <Bell className="h-4 w-4" />
                            <AlertTitle>{item.task}</AlertTitle>
                            <AlertDescription>
                               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    <Badge variant="secondary" className="flex items-center gap-1.5"><User className="h-3 w-3" /> {item.assignee}</Badge>
                                    {item.dueDate && (
                                        <Badge variant="outline" className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {item.dueDate}</Badge>
                                    )}
                                  </div>
                                  <Button size="sm" variant="outline" onClick={() => handleAssign(item.task, item.assignee)}>
                                        <Send className="mr-2 h-3 w-3" /> Assign & Notify
                                  </Button>
                               </div>
                            </AlertDescription>
                        </Alert>
                    ))}
                    {response.actionItems.length === 0 && (
                        <p className="text-sm text-muted-foreground">No specific action items were identified in the transcript.</p>
                    )}
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 items-stretch">
            <Button onClick={handleShare} className="w-full">
                <Send className="mr-2 h-4 w-4"/> Share Minutes with Participants
            </Button>
            <Button variant="outline" onClick={() => { setResponse(null); form.reset();}} className="w-full">
                Analyze Another Transcript
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
