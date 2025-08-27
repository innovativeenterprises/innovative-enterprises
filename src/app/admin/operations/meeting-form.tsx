
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeMeeting } from '@/ai/flows/meeting-analysis';
import { type MeetingAnalysisOutput } from '@/ai/flows/meeting-analysis.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, FileText, Bot, ListChecks, Calendar, Users, Milestone, PartyPopper } from 'lucide-react';

const FormSchema = z.object({
  transcript: z.string().min(50, 'Transcript must be at least 50 characters.'),
  participants: z.string().min(1, 'Please list at least one participant.'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function MeetingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<MeetingAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      transcript: '',
      participants: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeMeeting(data);
      setResponse(result);
      toast({
        title: 'Analysis Complete!',
        description: 'Your meeting transcript has been summarized.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the meeting transcript. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Meeting Transcript Analysis</CardTitle>
          <CardDescription>Paste your meeting transcript below. Our AI will generate a summary, list discussion points, and extract action items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jumaa Al Hadidi, Anwar Ahmed, Huda Al Salmi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transcript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Transcript</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full meeting transcript here..."
                        rows={12}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                   <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Meeting
                   </>
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
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your meeting... This may take a moment.</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6"/> Meeting Summary: {response.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><ListChecks className="h-5 w-5"/> Key Discussion Points</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {response.discussionPoints.map((point, index) => <li key={index}>{point}</li>)}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><PartyPopper className="h-5 w-5"/> Decisions Made</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {response.decisionsMade.map((decision, index) => <li key={index}>{decision}</li>)}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Milestone className="h-5 w-5"/> Action Items</h3>
              <ul className="space-y-2 text-sm">
                {response.actionItems.map((item, index) => (
                    <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-muted rounded-md">
                        <span>{item.task}</span>
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="flex items-center gap-1"><Users className="h-3 w-3"/>{item.assignee}</Badge>
                            {item.dueDate && <Badge variant="outline" className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{item.dueDate}</Badge>}
                        </div>
                    </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
