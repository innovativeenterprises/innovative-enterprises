
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, UserCheck, PlusCircle, Trash2, CheckCircle, ShieldAlert, BadgeInfo, Wand2, FileCheck2, LayoutDashboard } from 'lucide-react';
import { AdmissionsAgentInputSchema, type AdmissionsAgentInput, type AdmissionsAgentOutput } from '@/ai/flows/admissions-agent';
import { analyzeApplication } from '@/ai/flows/admissions-agent';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { analyzeIdentity } from '@/ai/flows/identity-analysis';


const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = AdmissionsAgentInputSchema.extend({
    transcriptFile: z.any().optional(),
    identityDocument: z.any().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

export default function AdmissionsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [response, setResponse] = useState<AdmissionsAgentOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: '',
            dateOfBirth: '',
            nationality: '',
            programOfInterest: 'B.Sc. in Artificial Intelligence',
            academicHistory: [{ schoolName: '', qualification: '', grade: '' }],
            personalStatement: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'academicHistory'
    });

    const handleIdAnalysis = async () => {
        const idFile = form.getValues('identityDocument');
        if (!idFile || idFile.length === 0) {
            toast({ title: 'Please select an identity document first.', variant: 'destructive' });
            return;
        }

        setIsAnalyzing(true);
        toast({ title: 'Analyzing Document...', description: 'Please wait while the AI extracts information.' });

        try {
            const uri = await fileToDataURI(idFile[0]);
            const result = await analyzeIdentity({ idDocumentFrontUri: uri });
            
            if (result.personalDetails?.fullName) {
                form.setValue('fullName', result.personalDetails.fullName);
            }
            if (result.personalDetails?.dateOfBirth) {
                form.setValue('dateOfBirth', result.personalDetails.dateOfBirth);
            }
            if (result.personalDetails?.nationality) {
                form.setValue('nationality', result.personalDetails.nationality);
            }
            if (result.professionalSummary) {
                form.setValue('personalStatement', result.professionalSummary);
            }

            toast({ title: "Analysis Complete", description: "Applicant details have been pre-filled from the document." });
        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Could not analyze the document.", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        setResponse(null);
        try {
            let transcriptUri: string | undefined;
            if (data.transcriptFile && data.transcriptFile.length > 0) {
                transcriptUri = await fileToDataURI(data.transcriptFile[0]);
            }
            const result = await analyzeApplication({ ...data, transcriptUri });
            setResponse(result);
            toast({ title: 'Application Analyzed!', description: 'AI has completed the preliminary review.' });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to analyze the application.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                     <div className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <UserCheck className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Admissions Officer</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Streamline your admissions process. Submit an application below to see how our AI, "Admito," provides instant preliminary analysis for your admissions team.
                        </p>
                    </div>
                    
                    <div className="flex justify-end">
                        <Button asChild variant="outline">
                            <Link href="/admin/education-tech/admissions/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" /> View Admissions Dashboard
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>New Student Application</CardTitle>
                            <CardDescription>Fill out the application form to begin the AI analysis.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <Card className="bg-muted/50 p-4">
                                        <FormField
                                            control={form.control}
                                            name="identityDocument"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>AI-Powered Onboarding</FormLabel>
                                                    <div className="flex gap-2">
                                                        <FormControl className="flex-1">
                                                            <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                                        </FormControl>
                                                        <Button type="button" variant="secondary" onClick={handleIdAnalysis} disabled={isAnalyzing}>
                                                            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                                            Analyze & Pre-fill
                                                        </Button>
                                                    </div>
                                                     <FormDescription className="text-xs">Upload an ID card, Passport, or CV. This document is NOT saved.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </Card>

                                    {/* Personal Details */}
                                    <h3 className="text-lg font-semibold border-b pb-2">Personal Details</h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                         <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                                         <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage/></FormItem>)} />
                                         <FormField control={form.control} name="nationality" render={({ field }) => (<FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                                    </div>
                                    <FormField control={form.control} name="programOfInterest" render={({ field }) => (<FormItem><FormLabel>Program of Interest</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />

                                    {/* Academic History */}
                                    <h3 className="text-lg font-semibold border-b pb-2 pt-4">Academic History</h3>
                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <Card key={field.id} className="p-4 bg-muted/50 relative">
                                                 <div className="grid md:grid-cols-3 gap-4">
                                                    <FormField control={form.control} name={`academicHistory.${index}.schoolName`} render={({ field }) => (<FormItem><FormLabel>School/University</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                                                    <FormField control={form.control} name={`academicHistory.${index}.qualification`} render={({ field }) => (<FormItem><FormLabel>Qualification</FormLabel><FormControl><Input placeholder="e.g., High School Diploma" {...field} /></FormControl><FormMessage/></FormItem>)} />
                                                    <FormField control={form.control} name={`academicHistory.${index}.grade`} render={({ field }) => (<FormItem><FormLabel>Grade/GPA</FormLabel><FormControl><Input placeholder="e.g., 95% or 3.8" {...field} /></FormControl><FormMessage/></FormItem>)} />
                                                </div>
                                                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                                            </Card>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={() => append({ schoolName: '', qualification: '', grade: '' })}><PlusCircle className="mr-2 h-4 w-4"/> Add Academic Record</Button>

                                    {/* Personal Statement & Documents */}
                                     <h3 className="text-lg font-semibold border-b pb-2 pt-4">Supporting Documents</h3>
                                     <FormField control={form.control} name="personalStatement" render={({ field }) => (<FormItem><FormLabel>Personal Statement</FormLabel><FormControl><Textarea placeholder="Tell us why you are interested in this program..." rows={6} {...field} /></FormControl><FormMessage/></FormItem>)} />
                                      <FormField control={form.control} name="transcriptFile" render={({ field }) => (<FormItem><FormLabel>Upload Transcript (Optional)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage/></FormItem>)} />

                                    <Button type="submit" disabled={isLoading || isAnalyzing} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Application...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyze Application</>}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {isLoading && (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                <p className="mt-4 text-muted-foreground">Admito is reviewing the application against our program criteria...</p>
                            </CardContent>
                        </Card>
                    )}

                    {response && (
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Admission Analysis</CardTitle>
                                <CardDescription>Application ID: <span className="font-mono">{response.applicationId}</span></CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Applicant Readiness Score</h3>
                                    <div className="flex items-center gap-4">
                                        <Progress value={response.readinessScore} className="h-3" />
                                        <span className="font-bold text-xl text-primary">{response.readinessScore}%</span>
                                    </div>
                                </div>
                                <Alert>
                                    <BadgeInfo className="h-4 w-4" />
                                    <AlertTitle>AI Summary & Recommendation</AlertTitle>
                                    <AlertDescription>{response.summary}</AlertDescription>
                                </Alert>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="text-green-500"/> Key Strengths</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-sm">
                                            {response.keyStrengths.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2 flex items-center gap-2"><ShieldAlert className="text-yellow-500"/> Areas for Review</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-sm">
                                            {response.areasForReview.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full text-center space-y-2">
                                    <p className="font-semibold">Recommended Next Step:</p>
                                    <Badge variant="default" className="text-base px-4 py-1">{response.recommendedNextStep}</Badge>
                                </div>
                            </CardFooter>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}
