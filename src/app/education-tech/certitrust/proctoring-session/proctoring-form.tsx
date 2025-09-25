
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { analyzeExamSession } from '@/ai/flows/proctoring-agent';
import { ProctoringInputSchema, type ProctoringOutput } from '@/ai/flows/proctoring-agent.schema';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const FormSchema = ProctoringInputSchema;
type FormValues = z.infer<typeof FormSchema>;

export default function ProctoringSessionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ProctoringOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        studentId: 'STU12345',
        examId: 'EXAM-CS101-MID',
        sessionTranscript: `
[00:01:15] - Student looks away from screen for 3 seconds.
[00:05:30] - Unidentified speech detected in background.
[00:15:22] - Student switches to external window for 10 seconds.
[00:25:05] - Mobile phone screen reflection detected.
        `.trim(),
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeExamSession(data);
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Exam session has been analyzed for violations.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to analyze the session log.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: 'High' | 'Medium' | 'Low') => {
      switch(severity) {
          case 'High': return <Badge variant="destructive">High</Badge>;
          case 'Medium': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Medium</Badge>;
          case 'Low': return <Badge variant="secondary">Low</Badge>;
          default: return <Badge variant="outline">Unknown</Badge>;
      }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Exam Session</CardTitle>
          <CardDescription>Paste the session log or transcript below to begin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="studentId" render={({ field }) => (
                        <FormItem><FormLabel>Student ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="examId" render={({ field }) => (
                        <FormItem><FormLabel>Exam ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                 </div>
                 <FormField control={form.control} name="sessionTranscript" render={({ field }) => (
                    <FormItem><FormLabel>Session Log / Transcript</FormLabel><FormControl><Textarea rows={10} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze Session</>}
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /><p className="mt-2 text-muted-foreground">The AI proctor is reviewing the session...</p></CardContent></Card>}

      {response && (
        <Card>
            <CardHeader>
                <CardTitle>AI Proctoring Report</CardTitle>
                <CardDescription>Report ID: <span className="font-mono">{response.reportId}</span></CardDescription>
            </CardHeader>
             <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Overall Risk Score</h3>
                    <div className="flex items-center gap-4">
                        <Progress value={response.overallRiskScore} className="h-4"/>
                        <span className="font-bold text-xl text-primary">{response.overallRiskScore}/100</span>
                    </div>
                </div>
                 <div className="p-4 bg-muted rounded-md border">
                    <h4 className="font-semibold mb-1">AI Summary</h4>
                    <p className="text-sm text-muted-foreground">{response.summary}</p>
                 </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Potential Violations</h3>
                     <Table>
                        <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Violation Type</TableHead><TableHead>Severity</TableHead><TableHead>Evidence</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {response.potentialViolations.length > 0 ? (
                                response.potentialViolations.map((v, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-mono">{v.timestamp}</TableCell>
                                        <TableCell>{v.type}</TableCell>
                                        <TableCell>{getSeverityBadge(v.severity)}</TableCell>
                                        <TableCell className="text-muted-foreground italic">{v.evidence}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-4">No violations detected.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
