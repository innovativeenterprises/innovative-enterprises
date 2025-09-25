
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { analyzeMeeting } from '@/ai/flows/meeting-analysis';
import type { MeetingAnalysisOutput } from '@/ai/flows/meeting-analysis.schema';

const MeetingFormSchema = z.object({
  participants: z.string().min(3, "Please list at least one participant."),
  transcript: z.string().min(20, "Transcript must be at least 20 characters."),
});
type MeetingFormValues = z.infer<typeof MeetingFormSchema>;

export default function MeetingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<MeetingAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(MeetingFormSchema),
  });

  const onSubmit: SubmitHandler<MeetingFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeMeeting(data);
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your meeting minutes have been generated.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to analyze transcript.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Meeting Analysis Agent</CardTitle>
          <CardDescription>Paste a meeting transcript to automatically generate minutes of meeting and action items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="participants" render={({ field }) => (
                <FormItem><FormLabel>Participants (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <FormField control={form.control} name="transcript" render={({ field }) => (
                <FormItem><FormLabel>Meeting Transcript</FormLabel><FormControl><Textarea rows={10} {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analyzing...</> : 'Generate Minutes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       {response && (
        <Card>
            <CardHeader><CardTitle>{response.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div><h3 className="font-semibold">Summary</h3><p className="text-sm text-muted-foreground">{response.summary}</p></div>
                <div><h3 className="font-semibold">Action Items</h3>
                    <ul className="list-disc pl-5 text-sm">
                        {response.actionItems.map((item, index) => (
                            <li key={index}><strong>{item.assignee}:</strong> {item.task} {item.dueDate && `(Due: ${item.dueDate})`}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
