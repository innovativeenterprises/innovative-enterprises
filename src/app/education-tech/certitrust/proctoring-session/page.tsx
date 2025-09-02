
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ShieldCheck, AlertTriangle, CheckCircle, Bot, XCircle } from 'lucide-react';
import { ProctoringInputSchema, type ProctoringOutput } from '@/ai/flows/proctoring-agent.schema';
import { analyzeExamSession } from '@/ai/flows/proctoring-agent';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const FormSchema = ProctoringInputSchema;
type FormValues = z.infer<typeof FormSchema>;

export default function ProctoringSessionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ProctoringOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentId: 'SQU-2021-001',
      examId: `EXAM-${Date.now()}`,
      sessionTranscript: `00:02:15 - User focused on screen
00:10:45 - Unidentified speech detected in background
00:15:32 - Student looks away from screen for 5 seconds
00:25:01 - Paste event detected from clipboard
00:45:10 - Student left view
00:45:55 - Student returned to view`,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeExamSession(data);
      setResponse(result);
      toast({ title: 'Analysis Complete', description: 'The exam session has been analyzed for violations.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to analyze the session. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSeverityBadge = (severity: 'Low' | 'Medium' | 'High') => {
      switch(severity) {
          case 'Low': return <Badge variant="secondary">Low</Badge>;
          case 'Medium': return <Badge variant="destructive" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Medium</Badge>;
          case 'High': return <Badge variant="destructive">High</Badge>;
      }
  }

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
             <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <Bot className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Proctoring Assistant</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Submit an exam session log for analysis. The AI will review the transcript for potential academic integrity violations.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Analyze Exam Session</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="studentId" render={({ field }) => (<FormItem><FormLabel>Student ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="examId" render={({ field }) => (<FormItem><FormLabel>Exam ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <FormField
                                control={form.control}
                                name="sessionTranscript"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Session Log / Transcript</FormLabel>
                                    <FormControl><Textarea rows={8} placeholder="Paste the session log here..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4"/> Analyze Session</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isLoading && (
                <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="mt-2 text-muted-foreground">The proctoring agent is reviewing the session...</p></CardContent></Card>
            )}

            {response && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Proctoring Report</CardTitle>
                        <CardDescription>Report ID: <span className="font-mono">{response.reportId}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert variant={response.overallRiskScore > 70 ? 'destructive' : response.overallRiskScore > 40 ? 'default' : 'default'} className={response.overallRiskScore > 40 && response.overallRiskScore <= 70 ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200' : ''}>
                             {response.overallRiskScore > 70 ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                            <AlertTitle>Overall Assessment</AlertTitle>
                            <AlertDescription>{response.summary}</AlertDescription>
                        </Alert>
                         <div>
                            <h3 className="font-semibold text-lg mb-2">Overall Risk Score</h3>
                            <div className="flex items-center gap-4">
                                <Progress value={response.overallRiskScore} className="h-4 [&>div]:bg-destructive" />
                                <span className="font-bold text-lg text-destructive">{response.overallRiskScore}%</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Potential Violations Detected</h3>
                             {response.potentialViolations.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4 bg-muted rounded-md">No violations detected.</p>
                             ) : (
                                <div className="space-y-3">
                                    {response.potentialViolations.map((v, i) => (
                                        <Card key={i} className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                     <p className="font-semibold">{v.violationType}</p>
                                                     <p className="text-sm text-muted-foreground">Timestamp: {v.timestamp}</p>
                                                     <p className="text-xs italic mt-1">Evidence: {v.evidence}</p>
                                                </div>
                                                {getSeverityBadge(v.severity)}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                             )}
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
      </div>
    </div>
  );
}
