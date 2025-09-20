'use client';

import ProForm from "@/app/admin/operations/pro-form";
import TenderForm from "@/app/admin/operations/tender-form";
import MeetingForm from "@/app/admin/operations/meeting-form";
import CouponGenerator from "@/app/admin/operations/coupon-generator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, NotebookText, Ticket, Scale, Edit, PlusCircle, Wand2, Upload, Link as LinkIcon, ListChecks, BrainCircuit } from "lucide-react";
import ThemeGenerator from "./theme-generator";
import AssetRentalAgentForm from '@/app/admin/operations/asset-rental-agent-form';
import type { CostRate } from "@/lib/cost-settings.schema";
import type { KnowledgeDocument } from "@/lib/knowledge.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingTable from "@/app/admin/pricing-table";
import type { Pricing } from "@/lib/pricing.schema";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useKnowledgeData, useCostSettingsData } from "@/hooks/use-global-store-data";
import { analyzeKnowledgeDocument } from "@/ai/flows/knowledge-document-analysis";
import { trainAgent } from "@/ai/flows/train-agent";
import { scrapeAndSummarize } from "@/ai/flows/web-scraper-agent";
import { initialAgentCategories } from '@/lib/agents';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle } from '@/components/ui/alert';
import { fileToDataURI } from '@/lib/utils';
import { Trash2 } from "lucide-react";

// --- KnowledgeTable Logic (Consolidated) ---

const UploadDocumentSchema = z.object({
  documentFile: z.any().optional(),
  documentUrls: z.string().optional(),
}).refine(data => (data.documentFile && data.documentFile.length > 0) || data.documentUrls, {
    message: "Either a document file or one or more URLs are required.",
    path: ["documentFile"],
});
type UploadDocumentValues = z.infer<typeof UploadDocumentSchema>;

const UploadDocumentDialog = ({
    isOpen, onOpenChange, onUpload, documentToReplace, children,
}: { 
    isOpen: boolean; onOpenChange: (open: boolean) => void; onUpload: (source: { file?: File, urls?: string[] }, docIdToReplace?: string) => Promise<void>, documentToReplace?: KnowledgeDocument, children: React.ReactNode
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<UploadDocumentValues>({ resolver: zodResolver(UploadDocumentSchema) });

    useEffect(() => { if (!isOpen) { form.reset(); } }, [isOpen, form]);

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
                    <DialogDescription>Upload a document or provide URLs. The AI will analyze it.</DialogDescription>
                </DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="documentFile" render={({ field }) => (
                        <FormItem><FormLabel>Upload Document</FormLabel><FormControl><Input type="file" accept=".pdf,.txt" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div></div>
                    <FormField control={form.control} name="documentUrls" render={({ field }) => (
                        <FormItem><FormLabel>Import from URL(s)</FormLabel><FormControl><Textarea placeholder="https://example.com/law1.html\nhttps://example.com/regulation2.pdf" rows={3} {...field} /></FormControl><FormDescription>One URL per line.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />} Analyze & {documentToReplace ? "Replace" : "Add"}</Button>
                    </DialogFooter>
                </form></Form>
            </DialogContent>
        </Dialog>
    );
};

const QaPairSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) });
const TrainingDialogSchema = z.object({ agentId: z.string().min(1), knowledgeDocuments: z.array(z.string()).optional(), knowledgeUrls: z.string().optional(), qaPairs: z.array(QaPairSchema).optional() });
type TrainingDialogValues = z.infer<typeof TrainingDialogSchema>;

const allAgents = initialAgentCategories.flatMap(category => category.agents);

const TrainAgentDialog = ({ knowledgeBase }: { knowledgeBase: KnowledgeDocument[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<z.infer<ReturnType<typeof trainAgent>['outputSchema']> | null>(null);
    const { toast } = useToast();
    const form = useForm<TrainingDialogValues>({ resolver: zodResolver(TrainingDialogSchema), defaultValues: { agentId: '', qaPairs: [{ question: '', answer: '' }] }});
    const { fields, append, remove } = useFieldArray({ control: form.control, name: "qaPairs" });

    const onSubmit: SubmitHandler<TrainingDialogValues> = async (data) => {
        setIsLoading(true); setResponse(null);
        try {
            const knowledgeDocuments: { fileName: string; content: string; }[] = data.knowledgeDocuments?.map(docId => {
                const doc = knowledgeBase.find(d => d.id === docId);
                const base64Content = doc?.dataUri?.split(',')[1];
                return { fileName: doc!.fileName, content: base64Content! };
            }).filter(d => d.content) || [];
            const knowledgeUrls = data.knowledgeUrls?.split('\n').filter(url => url.trim() !== '');
            const result = await trainAgent({ agentId: data.agentId, qaPairs: data.qaPairs, knowledgeDocuments: knowledgeDocuments.length > 0 ? knowledgeDocuments : undefined, knowledgeUrls });
            setResponse(result);
            toast({ title: 'Training Job Submitted', description: result.message });
            setIsOpen(false);
        } catch (error) { console.error(error); toast({ title: 'Error', description: 'Failed to submit training job.', variant: 'destructive' });
        } finally { setIsLoading(false); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button variant="outline"><BrainCircuit className="mr-2 h-4 w-4" /> Train Agents</Button></DialogTrigger>
            <DialogContent className="sm:max-w-[725px]"><DialogHeader><DialogTitle>Train an AI Agent</DialogTitle><DialogDescription>Select an agent and provide knowledge sources.</DialogDescription></DialogHeader>
            <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* ... (rest of the form remains the same) ... */}
                <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />} Start Training</Button></DialogFooter>
            </form></Form>
            </DialogContent>
        </Dialog>
    );
};

const KnowledgeTable = () => {
    const { knowledgeBase, setKnowledgeBase, isClient } = useKnowledgeData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | undefined>(undefined);

    const handleOpenDialog = (doc?: KnowledgeDocument) => { setSelectedDoc(doc); setIsDialogOpen(true); };

    const handleUpload = async (source: { file?: File; urls?: string[] }, docIdToReplace?: string) => {
        toast({ title: 'Analyzing Source(s)...' });
        try {
            if (source.urls && source.urls.length > 0) {
                const results = await Promise.all(source.urls.map(async url => await analyzeKnowledgeDocument({ documentContent: (await scrapeAndSummarize({ source: url, isUrl: true })).summary, sourceUrl: url })));
                setKnowledgeBase(prev => [...results.map((analysis, index) => ({ id: `kb_${Date.now()}_${index}`, ...analysis, uploadDate: new Date().toISOString().split('T')[0], fileName: source.urls![index], fileType: 'url' })), ...prev]);
                toast({ title: `${results.length} URLs Added!` });
            } else if (source.file) {
                const { name: fileName, type: fileType } = source.file;
                const dataUri = await fileToDataURI(source.file);
                const analysis = await analyzeKnowledgeDocument({ documentDataUri: dataUri });
                const newDoc: KnowledgeDocument = { id: docIdToReplace || `kb_${Date.now()}`, ...analysis, uploadDate: new Date().toISOString().split('T')[0], fileName, fileType, dataUri };
                if (docIdToReplace) { setKnowledgeBase(prev => prev.map(doc => doc.id === docIdToReplace ? newDoc : doc)); toast({ title: 'Document Replaced!' });
                } else { setKnowledgeBase(prev => [newDoc, ...prev]); toast({ title: 'Document Added!' }); }
            } else { throw new Error("No source provided."); }
        } catch (error) { console.error(error); toast({ title: "Operation Failed", description: String(error), variant: 'destructive' }); }
    };

    const handleDelete = (id: string) => { setKnowledgeBase(prev => prev.filter(doc => doc.id !== id)); toast({ title: "Document removed.", variant: "destructive" }); };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>AI Knowledge Base</CardTitle><div className="flex gap-2"><TrainAgentDialog knowledgeBase={knowledgeBase} /><Button onClick={() => handleOpenDialog()}><Upload className="mr-2 h-4 w-4" /> Add Source</Button></div></CardHeader>
            <CardContent>
                <UploadDocumentDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onUpload={handleUpload} documentToReplace={selectedDoc}><div/></UploadDocumentDialog>
                <Table><TableHeader><TableRow><TableHead>Document Name</TableHead><TableHead>Institution</TableHead><TableHead>Number / Version</TableHead><TableHead>Issue Date</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{!isClient ? <TableRow><TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell></TableRow> : knowledgeBase.map(doc => (
                    <TableRow key={doc.id}>
                        <TableCell><p className="font-medium">{doc.documentName}</p></TableCell>
                        <TableCell><p className="text-sm text-muted-foreground">{doc.institutionName}</p></TableCell>
                        <TableCell><p className="font-mono text-xs">{doc.documentNumber}</p>{doc.version && <p className="text-xs text-muted-foreground">v{doc.version}</p>}</TableCell>
                        <TableCell>{doc.issueDate}</TableCell>
                        <TableCell><a href={doc.fileType === 'url' ? doc.fileName : doc.dataUri} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80 text-sm truncate max-w-xs block">{doc.fileName}</a></TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => handleOpenDialog(doc)}><Edit /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{doc.documentName}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(doc.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></TableCell>
                    </TableRow>
                ))}</TableBody></Table>
            </CardContent>
        </Card>
    );
}

// --- CostSettingsTable Logic (Consolidated) ---

const CostRateSchema = z.object({ name: z.string().min(2), category: z.enum(['Material', 'Labor', 'Equipment', 'Travel']), unit: z.string().min(1), rate: z.coerce.number().min(0) });
type CostRateValues = z.infer<typeof CostRateSchema>;

const AddEditCostRateDialog = ({ rate, onSave, children, isOpen, onOpenChange }: { rate?: CostRate, onSave: (values: CostRateValues, id?: string) => void, children: React.ReactNode, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const form = useForm<CostRateValues>({ resolver: zodResolver(CostRateSchema), defaultValues: rate || { category: 'Material' }});
    useEffect(() => { if (isOpen) form.reset(rate || { name: "", category: "Material", unit: "", rate: 0 }); }, [rate, form, isOpen]);
    const onSubmit: SubmitHandler<CostRateValues> = (data) => { onSave(data, rate?.id); onOpenChange(false); };
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}><DialogTrigger asChild>{children}</DialogTrigger><DialogContent>
            <DialogHeader><DialogTitle>{rate ? "Edit" : "Add"} Market Rate</DialogTitle></DialogHeader>
            <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Item Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Material">Material</SelectItem><SelectItem value="Labor">Labor</SelectItem><SelectItem value="Equipment">Equipment</SelectItem><SelectItem value="Travel">Travel</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="rate" render={({ field }) => (<FormItem><FormLabel>Rate (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="unit" render={({ field }) => (<FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g., per m², per hour" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save Rate</Button></DialogFooter>
            </form></Form>
        </DialogContent>
    );
};

const CostSettingsTable = () => {
    const { costSettings, setCostSettings, isClient } = useCostSettingsData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRate, setSelectedRate] = useState<CostRate | undefined>(undefined);
    const openDialog = (rate?: CostRate) => { setSelectedRate(rate); setIsDialogOpen(true); };
    const handleSave = (values: CostRateValues, id?: string) => {
        if (id) { setCostSettings(prev => prev.map(r => r.id === id ? { ...r, ...values } : r)); toast({ title: "Rate updated." }); } 
        else { const newRate: CostRate = { ...values, id: `cost_${Date.now()}` }; setCostSettings(prev => [newRate, ...prev]); toast({ title: "Rate added." }); }
    };
    const handleDelete = (id: string) => { setCostSettings(prev => prev.filter(r => r.id !== id)); toast({ title: "Rate removed.", variant: "destructive" }); };
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Market Rates for Cost Estimation</CardTitle><Button onClick={() => openDialog()}><PlusCircle className="mr-2 h-4 w-4"/> Add Rate</Button></CardHeader>
            <CardContent>
                <AddEditCostRateDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} rate={selectedRate} onSave={handleSave}><div/></AddEditCostRateDialog>
                <Table><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Unit</TableHead><TableHead className="text-right">Rate (OMR)</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{!isClient ? <TableRow><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow> : costSettings.map(rate => (
                    <TableRow key={rate.id}>
                        <TableCell className="font-medium">{rate.name}</TableCell><TableCell>{rate.category}</TableCell><TableCell>{rate.unit}</TableCell><TableCell className="text-right font-mono">{rate.rate.toFixed(3)}</TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openDialog(rate)}><Edit/></Button>
                            <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Rate?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{rate.name}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(rate.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        </div></TableCell>
                    </TableRow>
                ))}</TableBody></Table>
            </CardContent>
        </Card>
    );
}

// --- Main Page Component ---

export default function AdminOperationsClientPage({ 
    initialPricing,
}: { 
    initialPricing: Pricing[],
}) {

  const internalTools = [
    { id: 'pro', title: 'PRO Task Delegation', icon: UserRoundCheck, component: <ProForm /> },
    { id: 'tender', title: 'Tender Response Assistant', icon: FileText, component: <TenderForm /> },
    { id: 'meeting', title: 'Online Meeting Agent', icon: NotebookText, component: <MeetingForm /> },
    { id: 'coupon', title: 'Coupon Generator', icon: Ticket, component: <CouponGenerator /> },
    { id: 'rental', title: 'Asset Rental Proposal Generator', icon: Scale, component: <AssetRentalAgentForm /> },
  ]

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                A suite of internal AI tools and configurations to enhance business operations.
            </p>
        </div>

        <Tabs defaultValue="ai-tools" className="w-full">
             <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ai-tools">AI Tools & Generators</TabsTrigger>
                <TabsTrigger value="knowledge-base">AI Knowledge Base</TabsTrigger>
                <TabsTrigger value="costing">Market Rates</TabsTrigger>
                <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
            </TabsList>
            <TabsContent value="ai-tools" className="mt-6 space-y-8">
                 <ThemeGenerator />
                <div className="pt-8">
                    <h2 className="text-2xl font-bold mb-4">Other Internal AI Tools</h2>
                    <Accordion type="single" collapsible className="w-full">
                    {internalTools.map(tool => (
                        <AccordionItem value={tool.id} key={tool.id}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <tool.icon className="h-5 w-5 text-primary" />
                                    <span className="text-lg font-semibold">{tool.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                {tool.component}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </div>
            </TabsContent>
            <TabsContent value="knowledge-base" className="mt-6">
                <KnowledgeTable />
            </TabsContent>
             <TabsContent value="costing" className="mt-6 space-y-8">
                <CostSettingsTable />
            </TabsContent>
            <TabsContent value="pricing" className="mt-6 space-y-8">
                <PricingTable pricing={initialPricing} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
