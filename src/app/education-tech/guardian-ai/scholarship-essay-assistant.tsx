
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { Student } from '@/lib/students.schema';
import type { Scholarship } from '@/ai/flows/scholarship-agent.schema';
import { generateScholarshipEssay, type ScholarshipEssayOutput } from '@/ai/flows/guardian-ai/scholarship-essay-assistant';
import { fileToDataURI } from '@/lib/utils';
import { useBriefcaseData } from '@/hooks/use-data-hooks';

const FormSchema = z.object({
  cvFile: z.any().refine(files => files?.length > 0, 'Your CV is required to draft the essay.'),
});
type FormValues = z.infer<typeof FormSchema>;

export function ScholarshipEssayAssistant({ student }: { student: Student }) {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ScholarshipEssayOutput | null>(null);
    const { toast } = useToast();
    const { briefcase } = useBriefcaseData();

    // This is a placeholder for a selected scholarship. In a real app, this would be passed in.
    const scholarship: Scholarship = {
        scholarshipName: "Future Leaders in Tech Scholarship",
        institution: "Global Tech University",
        country: "USA",
        fieldOfStudy: "Computer Science",
        eligibilitySummary: "For outstanding students with a passion for innovation.",
        deadline: "2024-12-31",
        sourceUrl: "#",
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        setResponse(null);
        try {
            const cvDataUri = await fileToDataURI(data.cvFile[0]);
            const result = await generateScholarshipEssay({ scholarship, cvDataUri });
            setResponse(result);
            toast({ title: 'Essay Drafted!', description: 'Your personal statement is ready for review.' });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to draft the essay.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Scholarship Essay Assistant</DialogTitle>
                <DialogDescription>
                    Drafting a personal statement for the '{scholarship.scholarshipName}' for {student.name}. Upload the student's CV to begin.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="cvFile" render={({ field }) => (
                        <FormItem><FormLabel>Student's CV</FormLabel><FormControl><Input type="file" accept=".pdf,.doc,.docx" onChange={e => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Drafting...</> : <><Wand2 className="mr-2 h-4 w-4" /> Draft Essay</>}
                    </Button>
                </form>
            </Form>
            {response && (
                <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Generated Personal Statement:</h3>
                    <div className="prose prose-sm max-w-full h-64 overflow-y-auto p-4 rounded-md border bg-muted">
                        {response.essay}
                    </div>
                </div>
            )}
        </DialogContent>
    );
}

