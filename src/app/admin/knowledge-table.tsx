
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import type { KnowledgeDocument } from "@/lib/knowledge";
import { PlusCircle, Edit, Trash2, Upload, Loader2, Sparkles, Wand2, BrainCircuit, Link as LinkIcon, ListChecks, FileUp, CheckCircle } from "lucide-react";
import { analyzeKnowledgeDocument } from "@/ai/flows/knowledge-document-analysis";
import { trainAgent } from "@/ai/flows/train-agent";
import { scrapeAndSummarize } from "@/ai/flows/web-scraper-agent";
import { initialAgentCategories } from '@/lib/agents';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from "@/components/ui/skeleton";
import { fileToDataURI, fileToBase64ContentOnly } from '@/lib/utils';
import { getKnowledgeBase } from '@/lib/firestore';

const UploadDocumentSchema = z.object({
  documentFile: z.any().optional(),
  documentUrls: z.string().optional(),
}).refine(data => (data.documentFile && data.documentFile.length > 0) || data.documentUrls, {
    message: "Either a document file or one or more URLs are required.",
    path: ["documentFile"],
});
type UploadDocumentValues = z.infer<typeof UploadDocumentSchema>;

const UploadDocumentDialog = ({
    isOpen,
    onOpenChange,
    onUpload,
    documentToReplace,
    children,
}: { 
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onUpload: (source: { file?: File, urls?: string[] }, docIdToReplace?: string) => Promise<void>,
    documentToReplace?: KnowledgeDocument,
    children: React.ReactNode
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<UploadDocumentValues>({ resolver: zodResolver(UploadDocumentSchema) });

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, form]);

    const onSubmit: SubmitHandler<UploadDocumentValues> = async (data) => {
        setIsLoading(true);
        const urls = data.documentUrls?.split('\n').filter(url => url.trim() !== '');
        await onUpload({ file: data.documentFile?.[0], urls }, documentToReplace?.id);
        setIsLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{documentToReplace ? "Replace" : "Add"} Knowledge Source</DialogTitle>
                    <DialogDescription>
                        Upload a new document or provide URLs. The AI will analyze it and add it to the knowledge base.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="documentFile" render={({ field }) => (
                            <FormItem><FormLabel>Upload Document File (.pdf, .txt)</FormLabel><FormControl><Input type="file" accept=".pdf,.txt" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                        </div>

                         <FormField control={form.control} name="documentUrls" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Import from URL(s)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="https://example.com/law1.html\nhttps://example.com/regulation2.pdf" rows={3} {...field} />
                                </FormControl>
                                <FormDescription>Enter one URL per line to add multiple sources at once.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                Analyze & {documentToReplace ? "Replace" : "Add"} Source(s)
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};


const QaPairSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty.'),
  answer: z.string().min(1, 'Answer cannot be empty.'),
});

const TrainingDialogSchema = z.object({
  agentId: z.string().min(1, "Please select an agent to train."),
  knowledgeDocuments: z.array(z.string()).optional(),
  knowledgeUrls: z.string().optional(),
  qaPairs: z.array(QaPairSchema).optional(),
});
type TrainingDialogValues = z.infer<typeof TrainingDialogSchema>;

const allAgents = initialAgentCategories.flatMap(category => category.agents);

const TrainAgentDialog = ({ knowledgeBase }: { knowledgeBase: KnowledgeDocument[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<z.infer<ReturnType<typeof trainAgent>['outputSchema']> | null>(null);
    const { toast } = useToast();

    const form = useForm<TrainingDialogValues>({
        resolver: zodResolver(TrainingDialogSchema),
        defaultValues: {
            agentId: '',
            knowledgeDocuments: [],
            knowledgeUrls: '',
            qaPairs: [{ question: '', answer: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "qaPairs"
    });
    
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            form.setValue('knowledgeDocuments', knowledgeBase.map(doc => doc.id));
        } else {
            form.setValue('knowledgeDocuments', []);
        }
    };

    const onSubmit: SubmitHandler<TrainingDialogValues> = async (data) => {
        setIsLoading(true);
        setResponse(null);
        try {
            const knowledgeDocuments: { fileName: string; content: string; }[] = [];
            data.knowledgeDocuments?.forEach(docId => {
                const doc = knowledgeBase.find(d => d.id === docId);
                if (doc?.dataUri) {
                    const base64Content = doc.dataUri.split(',')[1];
                    if (base64Content) {
                       knowledgeDocuments.push({ fileName: doc.fileName, content: base64Content });
                    }
                }
            });

            const knowledgeUrls = data.knowledgeUrls ? data.knowledgeUrls.split('\n').filter(url => url.trim() !== '') : undefined;

            const result = await trainAgent({
                agentId: data.agentId,
                qaPairs: data.qaPairs,
                knowledgeDocuments: knowledgeDocuments.length > 0 ? knowledgeDocuments : undefined,
                knowledgeUrls: knowledgeUrls,
            });

            setResponse(result);
            toast({ title: 'Training Job Submitted', description: result.message });
            setIsOpen(false);

        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to submit training job.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><BrainCircuit className="mr-2 h-4 w-4" /> Train Agents</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                 <DialogHeader>
                    <DialogTitle>Train an AI Agent</DialogTitle>
                    <DialogDescription>
                       Select an agent and provide knowledge sources to fine-tune its performance.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                         <FormField
                            control={form.control}
                            name="agentId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>1. Select Agent to Train</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an AI agent..." />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {allAgents.map(agent => (
                                        <SelectItem key={agent.name} value={agent.name}>{agent.name} ({agent.role})</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="knowledgeDocuments"
                            render={() => (
                            <FormItem>
                                <div className="mb-4">
                                     <FormLabel>2. Select Knowledge Documents</FormLabel>
                                     <FormDescription>Choose documents from your knowledge base to include in this training session.</FormDescription>
                                </div>
                                <div className="flex items-center space-x-2 mb-2 pl-2">
                                     <Checkbox id="select-all" onCheckedChange={handleSelectAll} />
                                     <Label htmlFor="select-all">Select All</Label>
                                </div>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-md border">
                                {knowledgeBase.map((item) => (
                                    <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="knowledgeDocuments"
                                    render={({ field }) => {
                                        return (
                                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value || []), item.id])
                                                        : field.onChange(field.value?.filter((value) => value !== item.id))
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">{item.documentName}</FormLabel>
                                        </FormItem>
                                        )
                                    }}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="knowledgeUrls"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center gap-2"><LinkIcon className="h-5 w-5"/> 3. Provide Knowledge URLs</FormLabel>
                                <FormControl>
                                <Textarea placeholder="https://example.com/law1.html\nhttps://example.com/regulation2.pdf" rows={3} {...field} />
                                </FormControl>
                                <FormDescription>Enter one URL per line. The AI will scrape the content from these pages.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <Label className="flex items-center gap-2 mb-4"><ListChecks className="h-5 w-5"/> 4. Add Question & Answer Pairs (Optional)</Label>
                            <div className="space-y-4 max-h-48 overflow-y-auto p-1">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="p-4 bg-muted/50 relative">
                                    <div className="space-y-2">
                                        <FormField control={form.control} name={`qaPairs.${index}.question`} render={({ field }) => (<FormItem><FormLabel>Question</FormLabel><FormControl><Input placeholder="What is the capital of Oman?" {...field} /></FormControl><FormMessage/></FormItem>)} />
                                        <FormField control={form.control} name={`qaPairs.${index}.answer`} render={({ field }) => (<FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea placeholder="The capital of Oman is Muscat." rows={2} {...field} /></FormControl><FormMessage/></FormItem>)} />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </Card>
                            ))}
                            </div>
                             <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ question: '', answer: '' })}><PlusCircle className="mr-2 h-4 w-4"/> Add Q&A Pair</Button>
                        </div>
                         <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : <><Sparkles className="mr-2 h-4 w-4" />Start Training</>}
                            </Button>
                        </DialogFooter>
                     </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
