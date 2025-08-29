
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { KnowledgeDocument } from "@/lib/knowledge";
import { PlusCircle, Edit, Trash2, Upload, Loader2, Sparkles, Wand2 } from "lucide-react";
import { store } from "@/lib/global-store";
import { analyzeKnowledgeDocument } from "@/ai/flows/knowledge-document-analysis";
import { trainAgent } from "@/ai/flows/train-agent";

// Hook to connect to the global store
export const useKnowledgeData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        knowledgeBase: data.knowledgeBase,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => KnowledgeDocument[]) => {
            const currentDocs = store.get().knowledgeBase;
            const newDocs = updater(currentDocs);
            store.set(state => ({ ...state, knowledgeBase: newDocs }));
        }
    };
};

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const UploadDocumentSchema = z.object({
  documentFile: z.any().refine(file => file?.length == 1, 'A document file is required.'),
});
type UploadDocumentValues = z.infer<typeof UploadDocumentSchema>;

const UploadDocumentDialog = ({
    onUpload,
    documentToReplace,
    children,
}: { 
    onUpload: (file: File, docIdToReplace?: string) => Promise<void>,
    documentToReplace?: KnowledgeDocument,
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<UploadDocumentValues>({ resolver: zodResolver(UploadDocumentSchema) });

    const onSubmit: SubmitHandler<UploadDocumentValues> = async (data) => {
        setIsLoading(true);
        await onUpload(data.documentFile[0], documentToReplace?.id);
        setIsLoading(false);
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{documentToReplace ? "Replace" : "Upload"} Knowledge Document</DialogTitle>
                    <DialogDescription>
                        {documentToReplace 
                            ? `Upload a new version of "${documentToReplace.fileName}". The AI will analyze it and update the knowledge base.`
                            : "Upload a new law, regulation, or knowledge document. The AI will analyze it and add it to the knowledge base."
                        }
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="documentFile" render={({ field }) => (
                            <FormItem><FormLabel>Document File (.pdf, .txt)</FormLabel><FormControl><Input type="file" accept=".pdf,.txt" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                Analyze & {documentToReplace ? "Replace" : "Upload"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function KnowledgeTable() {
    const { knowledgeBase, setKnowledgeBase } = useKnowledgeData();
    const { toast } = useToast();

    const handleUpload = async (file: File, docIdToReplace?: string) => {
        toast({ title: 'Analyzing Document...', description: 'Please wait while the AI extracts key information.' });
        try {
            const dataUri = await fileToDataURI(file);
            const analysis = await analyzeKnowledgeDocument({ documentDataUri: dataUri });

            const newDoc: KnowledgeDocument = {
                id: docIdToReplace || `kb_${Date.now()}`,
                documentName: analysis.documentName,
                documentNumber: analysis.documentNumber,
                version: analysis.version,
                issueDate: analysis.issueDate,
                uploadDate: new Date().toISOString().split('T')[0],
                fileName: file.name,
                fileType: file.type,
                dataUri,
            };

            if (docIdToReplace) {
                setKnowledgeBase(prev => prev.map(doc => doc.id === docIdToReplace ? newDoc : doc));
                 toast({ title: 'Document Replaced!', description: `"${file.name}" has been analyzed and updated.` });
            } else {
                setKnowledgeBase(prev => [newDoc, ...prev]);
                 toast({ title: 'Document Uploaded!', description: `"${file.name}" has been analyzed and added.` });
            }
            
            // Trigger training for relevant agents
            await trainAgent({ agentId: 'Lexi', knowledgeDocuments: [dataUri]});
            toast({ title: 'AI Training Initiated', description: `New knowledge from "${file.name}" is being sent to relevant AI agents.` });


        } catch (error) {
            console.error("Failed to analyze or upload document:", error);
            toast({ title: "Operation Failed", description: "Could not analyze or upload the document. Please try again.", variant: 'destructive' });
        }
    };

    const handleDelete = (id: string) => {
        setKnowledgeBase(prev => prev.filter(doc => doc.id !== id));
        toast({ title: "Document removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>AI Knowledge Base</CardTitle>
                    <CardDescription>Manage the laws, regulations, and documents used to train your AI agents.</CardDescription>
                </div>
                <UploadDocumentDialog onUpload={handleUpload}>
                    <Button><Upload className="mr-2 h-4 w-4" /> Upload Document</Button>
                </UploadDocumentDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document Name</TableHead>
                            <TableHead>Number / Version</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Upload Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {knowledgeBase.map(doc => (
                            <TableRow key={doc.id}>
                                <TableCell>
                                    <p className="font-medium">{doc.documentName}</p>
                                    <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="font-mono text-xs">{doc.documentNumber}</p>
                                    {doc.version && <p className="text-xs text-muted-foreground">v{doc.version}</p>}
                                </TableCell>
                                <TableCell>{doc.issueDate}</TableCell>
                                <TableCell>{doc.uploadDate}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <UploadDocumentDialog onUpload={handleUpload} documentToReplace={doc}>
                                            <Button variant="ghost" size="icon"><Edit /></Button>
                                        </UploadDocumentDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{doc.documentName}". This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(doc.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
