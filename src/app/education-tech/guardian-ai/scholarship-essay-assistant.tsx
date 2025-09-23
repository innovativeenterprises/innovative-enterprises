

'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, Copy, PenSquare } from 'lucide-react';
import { ScholarshipSchema } from '@/ai/flows/guardian-ai/scholarship-agent.schema';
import type { ScholarshipEssayOutput } from '@/ai/flows/guardian-ai/scholarship-essay-assistant.schema';
import { generateScholarshipEssay } from '@/ai/flows/guardian-ai/scholarship-essay-assistant';
import type { Student } from '@/lib/students.schema';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = ScholarshipSchema.extend({
    cvDocument: z.any().refine(file => file?.length > 0, "Student's CV is required."),
});
type FormValues = z.infer<typeof FormSchema>;

export function ScholarshipEssayAssistant({ student }: { student: Student }) {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ScholarshipEssayOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            scholarshipName: 'Oman National Scholarship',
            institution: 'Sultan Qaboos University',
            country: 'Oman',
            fieldOfStudy: student.major,
            eligibilitySummary: 'For Omani nationals with high academic standing and leadership potential.',
        },
    });
    
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        setResponse(null);
        try {
            const cvDataUri = await fileToDataURI(data.cvDocument[0]);
            const result = await generateScholarshipEssay({
                scholarship: {
                    scholarshipName: data.scholarshipName,
                    institution: data.institution,
                    country: data.country,
                    fieldOfStudy: data.fieldOfStudy,
                    eligibilitySummary: data.eligibilitySummary,
                },
                cvDataUri,
            });
            setResponse(result);
            toast({ title: 'Essay Draft Generated!', description: 'Your personal statement is ready for review.' });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to generate essay draft.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

     const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        toast({ title: "Copied!", description: "The essay content has been copied to your clipboard." });
    };

    const handleDownload = (content: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "scholarship-essay-draft.md";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast({ title: 'Downloaded!'});
    };

    return (
        <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
                <DialogTitle>AI Scholarship Essay Assistant</DialogTitle>
                <DialogDescription>
                    Provide scholarship details and upload a CV for {student.name}. The AI will draft a tailored personal statement.
                </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-1 pr-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="cvDocument"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student's CV Document</FormLabel>
                                <FormControl>
                                <Input type="file" accept=".pdf,.doc,.docx,.png,.jpg" onChange={(e) => field.onChange(e.target.files)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="scholarshipName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scholarship Name</FormLabel>
                                <FormControl>
                                <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="institution"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Institution</FormLabel>
                                    <FormControl>
                                    <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                    <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="fieldOfStudy"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Field of Study</FormLabel>
                                <FormControl>
                                <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="eligibilitySummary"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eligibility / Focus</FormLabel>
                                <FormControl>
                                <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting Essay...</> : <><PenSquare className="mr-2 h-4 w-4" /> Generate Draft</>}
                        </Button>
                    </form>
                </Form>
                 {response && (
                    <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-2">Generated Personal Statement Draft</h3>
                        <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-64 overflow-y-auto">
                            {response.essay}
                        </div>
                         <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => handleCopy(response.essay)}><Copy className="mr-2 h-4 w-4"/>Copy</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownload(response.essay)}><Download className="mr-2 h-4 w-4"/>Download</Button>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
