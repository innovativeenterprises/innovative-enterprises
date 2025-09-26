
'use client';

import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, FileText, CheckCircle, Trophy, Download } from 'lucide-react';
import { generateSalesMarketingAssignment } from '@/ai/flows/sales-marketing-assignment';
import type { SalesMarketingAssignmentOutput } from '@/ai/flows/sales-marketing-assignment.schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PartnerCard } from '../partner-card';
import { Textarea } from '@/components/ui/textarea';

const EmailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  whatsappNumber: z.string().min(8, "Please enter a valid WhatsApp number."),
});
type EmailValues = z.infer<typeof EmailSchema>;

const SubmissionSchema = z.object({
    comprehensionAnswers: z.string().min(10, 'Please answer the comprehension questions.'),
    reportFile: z.any().refine(files => files?.length > 0, 'A report file is required.'),
    kpiEstimation: z.string().min(3, 'Please provide your KPI estimation.'),
});
type SubmissionValues = z.infer<typeof SubmissionSchema>;

type PageState = 'start' | 'loading' | 'assignment' | 'submitting' | 'assessing' | 'success';

export default function SalesChallengePage() {
    const [pageState, setPageState] = useState<PageState>('start');
    const [assignment, setAssignment] = useState<SalesMarketingAssignmentOutput | null>(null);
    const [assessmentResult, setAssessmentResult] = useState<{ score: number, feedback: string } | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const emailForm = useForm<EmailValues>({ resolver: zodResolver(EmailSchema) });
    const submissionForm = useForm<SubmissionValues>({ resolver: zodResolver(SubmissionSchema) });

    const handleStartAssignment: SubmitHandler<EmailValues> = async (data) => {
        setPageState('loading');
        try {
            const result = await generateSalesMarketingAssignment(data);
            setAssignment(result);
            setPageState('assignment');
            toast({ title: 'Assignment Generated!', description: 'Your assignment has been sent to your email and WhatsApp.' });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to generate assignment.', variant: 'destructive' });
            setPageState('start');
        }
    };

    const handleSubmission: SubmitHandler<SubmissionValues> = async (data) => {
        setPageState('assessing');
        await new Promise(resolve => setTimeout(resolve, 2000));
        // In a real app, you'd have an AI flow to assess the report and comprehension answers.
        const score = Math.floor(Math.random() * (98 - 85 + 1) + 85); // Simulate a good score
        setAssessmentResult({
            score,
            feedback: `Excellent submission. Your comprehension of the brief was clear and your proposed strategy is sound. You achieved ${score}% of the target KPIs, which is a great result for this simulation.`
        });
        setPageState('success');
    };

    const handleDownload = async (element: HTMLElement | null, filename: string) => {
        if (!element) return;
        toast({ title: 'Generating Download...', description: 'Please wait.' });
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            link.click();
        } catch (e) {
            toast({ title: "Download Failed", variant: 'destructive' });
        }
    };

    const renderContent = () => {
        switch(pageState) {
            case 'loading': return <Card className="p-12 text-center"><Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" /><p className="mt-4 text-muted-foreground">Generating your personalized assignment...</p></Card>
            case 'assessing': return <Card className="p-12 text-center"><Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" /><p className="mt-4 text-muted-foreground">Assessing your submission...</p></Card>
            case 'assignment':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Assignment: {assignment?.assignmentTitle}</CardTitle>
                            <CardDescription>Follow the steps below to complete your task.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-full dark:prose-invert" dangerouslySetInnerHTML={{ __html: assignment?.assignmentHtml || '' }} />
                        </CardContent>
                        <CardFooter>
                            <Card className="w-full bg-muted/50">
                                <CardHeader><CardTitle>Submit Your Work</CardTitle></CardHeader>
                                <CardContent>
                                    <Form {...submissionForm}>
                                        <form onSubmit={submissionForm.handleSubmit(handleSubmission)} className="space-y-4">
                                             <FormField control={submissionForm.control} name="comprehensionAnswers" render={({ field }) => (<FormItem><FormLabel>Comprehension Question Answers</FormLabel><FormControl><Textarea rows={4} placeholder="Answer the comprehension questions from the brief here..." {...field} /></FormControl><FormMessage/></FormItem>)} />
                                            <FormField control={submissionForm.control} name="reportFile" render={({ field }) => (<FormItem><FormLabel>Upload Final Report</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage/></FormItem>)} />
                                            <FormField control={submissionForm.control} name="kpiEstimation" render={({ field }) => (<FormItem><FormLabel>Your KPI Estimation</FormLabel><FormControl><Input placeholder="e.g., 'I estimate I can achieve a 20% conversion rate...'" {...field} /></FormControl><FormMessage/></FormItem>)} />
                                            <Button type="submit" className="w-full">Submit for Assessment</Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </CardFooter>
                    </Card>
                );
            case 'success':
                 const freelancerId = `AGENT-${String(Date.now()).slice(-6)}`;
                 return (
                    <Card>
                        <CardHeader className="text-center">
                             <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
                                <Trophy className="h-12 w-12 text-green-500" />
                            </div>
                            <CardTitle className="text-2xl">Congratulations, You're Approved!</CardTitle>
                            <CardDescription>{assessmentResult?.feedback}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            <PartnerCard 
                                cardRef={cardRef}
                                partnerName={emailForm.getValues('email').split('@')[0]}
                                joiningDate={new Date().toLocaleDateString()}
                                expiryDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}
                                classification="Bronze"
                                services="Sales, Marketing"
                                partnerType="Individual Agent"
                                freelancerId={freelancerId}
                            />
                            <Alert>
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>New Partner Incentive!</AlertTitle>
                                <AlertDescription>
                                    As a valued sales & marketing agent, you will earn a **5% commission** on all sales from any new client you bring to the INNOVATIVE ENTERPRISES platform. This is a lifetime commission for as long as you are an active partner.
                                </AlertDescription>
                            </Alert>
                             <div className="flex gap-2">
                                <Button onClick={() => handleDownload(cardRef.current, 'partner-card.png')}><Download className="mr-2 h-4 w-4"/>Download Virtual ID</Button>
                                <Button variant="secondary" onClick={() => toast({ title: 'Coming Soon!'})}>Download Certificate</Button>
                             </div>
                        </CardContent>
                    </Card>
                 );
            case 'start':
            default:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales & Marketing Onboarding Challenge</CardTitle>
                            <CardDescription>Enter your details to receive a real-world case study assignment via email and WhatsApp.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...emailForm}>
                                <form onSubmit={emailForm.handleSubmit(handleStartAssignment)} className="space-y-4">
                                    <FormField control={emailForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="your-email@example.com" {...field} /></FormControl><FormMessage/></FormItem>)} />
                                    <FormField control={emailForm.control} name="whatsappNumber" render={({ field }) => (<FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="+968..." {...field} /></FormControl><FormMessage/></FormItem>)} />
                                    <Button type="submit" className="w-full"><Send className="mr-2 h-4 w-4"/> Start Assignment</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                );
        }
    }


  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Prove Your Skills</h1>
             <p className="mt-4 text-lg text-muted-foreground">
               Welcome to our practical onboarding assessment for sales and marketing freelancers. Instead of a standard interview, we believe in seeing your skills in action.
            </p>
        </div>
        <div className="max-w-2xl mx-auto mt-12">
            {renderContent()}
        </div>
      </div>
    </div>
  );
}
