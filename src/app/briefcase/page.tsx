
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Download, FileSignature, FileText, AlertTriangle, FileSpreadsheet, Edit, PlusCircle, Upload, Loader2, CheckCircle, Package, Trash2, User, Wand2, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { analyzeIdentity, type IdentityAnalysisOutput } from '@/ai/flows/identity-analysis';
import { generateAgreement, type AgreementGenerationOutput } from '@/ai/flows/generate-agreement';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { BoQItem } from '@/ai/flows/boq-generator.schema';
import { fileToDataURI } from '@/lib/utils';
import type { BriefcaseData, UserDocument, ServiceRegistration, SavedBoQ } from '@/lib/briefcase';
import { useBriefcaseData } from '@/hooks/use-global-store-data';


const businessCategories = [
    "Tech & IT Services",
    "Creative & Design",
    "Consulting & Professional Services",
    "Printing & Publishing",
    "Automotive Services",
    "Health & Wellness",
    "Legal Services",
    "Financial & Banking",
    "Events & Entertainment",
    "Other",
];

const NewServiceSchema = z.object({
  businessCategory: z.string().min(1, "Please select a business category."),
  serviceChargesFile: z.any().refine(file => file?.length > 0, 'A price list is required.'),
});

const UpdatePriceListSchema = z.object({
    serviceChargesFile: z.any().refine(file => file?.length > 0, 'A new price list file is required.'),
});

const UploadDocumentSchema = z.object({
    documentFile: z.any().refine(file => file?.length > 0, 'Please select a file to upload.'),
});


const downloadPricingTemplate = (category: string) => {
    // This is a simplified version of the logic in partner page.
    // In a real app, this would be a shared utility.
    const headers = ["ServiceName", "ServiceDescription", "Unit (e.g., per hour, per project)", "Price (OMR)"];
    let csvContent = headers.join(",") + "\n";
    const templateData = [
        [`Sample ${category} Service 1`, "Description of service 1", "per project", ""],
        [`Sample ${category} Service 2`, "Description of service 2", "per hour", ""],
    ];
    csvContent += templateData.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pricing_template_${category.replace(/\s+/g, '_') || 'generic'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Dialog for adding a new service
const AddServiceDialog = ({ onAddService }: { onAddService: (category: string, priceListUrl: string, priceListFilename: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof NewServiceSchema>>({
        resolver: zodResolver(NewServiceSchema),
        defaultValues: { businessCategory: '' }
    });

    const onSubmit: SubmitHandler<z.infer<typeof NewServiceSchema>> = async (data) => {
        setIsUploading(true);
        try {
            const priceListUrl = await fileToDataURI(data.serviceChargesFile[0]);
            onAddService(data.businessCategory, priceListUrl, data.serviceChargesFile[0].name);
            toast({ title: 'Service Application Submitted', description: `${data.businessCategory} has been submitted for review.` });
            setIsOpen(false);
            form.reset();
        } catch (e) {
            toast({ title: 'Error', description: 'Could not process file upload.', variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4"/> Apply for New Service</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apply for a New Service Category</DialogTitle>
                    <DialogDescription>
                        Select a new service you want to offer and upload the corresponding price list. Your identity documents are already on file.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField
                            control={form.control}
                            name="businessCategory"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Business Category</FormLabel>
                                <div className="flex gap-2">
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select a category..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {businessCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                     <Button type="button" variant="secondary" onClick={() => downloadPricingTemplate(field.value || 'generic')} disabled={!field.value}>
                                        <Download className="mr-2 h-4 w-4" /> Template
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="serviceChargesFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Service Price List</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept=".csv,.xls,.xlsx" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isUploading}>
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                Submit Application
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

// Dialog for updating an existing price list
const UpdatePriceListDialog = ({ registration, onUpdate }: { registration: ServiceRegistration, onUpdate: (category: string, priceListUrl: string, priceListFilename: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof UpdatePriceListSchema>>({
        resolver: zodResolver(UpdatePriceListSchema)
    });

    const onSubmit: SubmitHandler<z.infer<typeof UpdatePriceListSchema>> = async (data) => {
        setIsUploading(true);
        try {
            const priceListUrl = await fileToDataURI(data.serviceChargesFile[0]);
            onUpdate(registration.category, priceListUrl, data.serviceChargesFile[0].name);
            toast({ title: 'Price List Updated', description: `New price list for ${registration.category} has been submitted.` });
            setIsOpen(false);
        } catch (e) {
            toast({ title: 'Error', description: 'Could not process file upload.', variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm"><Edit className="mr-2 h-4 w-4"/> Update Price List</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Price List for "{registration.category}"</DialogTitle>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="serviceChargesFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Price List File</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept=".csv,.xls,.xlsx" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                         <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isUploading}>
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                Upload New Price List
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

const UploadDocumentDialog = ({ onUpload }: { onUpload: (file: File) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof UploadDocumentSchema>>({
        resolver: zodResolver(UploadDocumentSchema)
    });

    const onSubmit: SubmitHandler<z.infer<typeof UploadDocumentSchema>> = (data) => {
        onUpload(data.documentFile[0]);
        toast({ title: 'Document Uploaded', description: 'Your document has been saved to your briefcase.' });
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><Upload className="mr-2 h-4 w-4"/> Upload Document</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a New Document</DialogTitle>
                    <DialogDescription>
                        Upload any personal or business document to your secure briefcase.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="documentFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select File</FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Upload</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

const AnalysisResultDisplay = ({ analysis }: { analysis: CrAnalysisOutput | IdentityAnalysisOutput }) => {
    if ('companyInfo' in analysis) { // CR Analysis
        const { companyNameEnglish, companyNameArabic, registrationNumber, status } = analysis.companyInfo;
        return <p className="text-xs text-muted-foreground"><strong>Type:</strong> CR / <strong>Name:</strong> {companyNameEnglish || companyNameArabic} / <strong>CRN:</strong> {registrationNumber} / <strong>Status:</strong> {status}</p>;
    }
    if ('personalDetails' in analysis) { // ID Analysis
        const { civilNumber } = analysis.idCardDetails || {};
        const { fullName } = analysis.personalDetails || {};
        return <p className="text-xs text-muted-foreground"><strong>Type:</strong> Identity / <strong>Name:</strong> {fullName} / <strong>ID:</strong> {civilNumber}</p>;
    }
    return null;
}


export default function BriefcasePage() {
    const { data: briefcase, setData: setBriefcase, isClient } = useBriefcaseData();
    const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);
    const { toast } = useToast();

    const handleAddService = (category: string, priceListUrl: string, priceListFilename: string) => {
        if (!briefcase) return;
        const newRegistration: ServiceRegistration = { category, priceListUrl, priceListFilename };
        const newData = { ...briefcase, registrations: [...briefcase.registrations, newRegistration]};
        setBriefcase(() => newData);
    }
    
    const handleUpdatePriceList = (category: string, priceListUrl: string, priceListFilename: string) => {
         if (!briefcase) return;
         const updatedRegistrations = briefcase.registrations.map(reg => 
            reg.category === category ? { ...reg, priceListUrl, priceListFilename } : reg
         );
         const newData = { ...briefcase, registrations: updatedRegistrations };
         setBriefcase(() => newData);
    }

    const handleUploadDocument = async (file: File) => {
        if (!briefcase) return;
        const dataUri = await fileToDataURI(file);
        const newDocument: UserDocument = {
            id: `doc_${file.name.replace(/\s+/g, '_')}_${new Date().getTime()}`,
            name: file.name,
            fileType: file.type,
            dataUri: dataUri,
            uploadedAt: new Date().toISOString(),
        };
        const newData = { ...briefcase, userDocuments: [...briefcase.userDocuments, newDocument]};
        setBriefcase(() => newData);
    }

    const handleDeleteDocument = (docId: string) => {
        if (!briefcase) return;
        const updatedDocuments = briefcase.userDocuments.filter(doc => doc.id !== docId);
        const newData = { ...briefcase, userDocuments: updatedDocuments };
        setBriefcase(() => newData);
        toast({ title: 'Document Deleted', description: 'The document has been removed from your briefcase.', variant: 'destructive'});
    }

    const handleAnalyzeDocument = async (doc: UserDocument) => {
        if (!briefcase) return;
        setAnalyzingDocId(doc.id);
        
        try {
            let result;
            // Simple heuristic to determine which AI agent to call
            if (doc.name.toLowerCase().includes('cr') || doc.name.toLowerCase().includes('commercial')) {
                result = await analyzeCrDocument({ documentDataUri: doc.dataUri });
            } else {
                 result = await analyzeIdentity({ idDocumentFrontUri: doc.dataUri });
            }

            const updatedDocuments = briefcase.userDocuments.map(d => 
                d.id === doc.id ? { ...d, analysis: result, name: result.suggestedFilename || d.name } : d
            );
            const newData = { ...briefcase, userDocuments: updatedDocuments };
            setBriefcase(() => newData);

            toast({ title: "Analysis Complete", description: `Successfully analyzed ${doc.name}.` });
        } catch (error) {
            console.error("Analysis failed:", error);
            toast({ title: "Analysis Failed", description: `Could not analyze ${doc.name}. The document might be unsupported.`, variant: "destructive" });
        } finally {
            setAnalyzingDocId(null);
        }
    }
    
    if (!isClient) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            </div>
        );
    }

    if (!briefcase) {
         return (
             <div className="bg-background min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <div className="container mx-auto px-4 py-16">
                     <div className="max-w-3xl mx-auto text-center">
                        <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full w-fit mb-4">
                            <AlertTriangle className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">Could Not Load Briefcase</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                           There was an error loading your E-Briefcase data. Please try again later or contact support.
                        </p>
                    </div>
                </div>
            </div>
         )
    }

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-12">
                         <div>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Briefcase className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary text-center">My E-Briefcase</h1>
                            <p className="mt-4 text-lg text-muted-foreground text-center">
                                Welcome, <span className="font-semibold text-primary">{briefcase.applicantName}</span>. Manage your documents, agreements, and services here.
                            </p>
                        </div>
                         <Card>
                            <CardHeader className="flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5"/> Saved BoQ Projects</CardTitle>
                                    <CardDescription>Review your saved Bill of Quantities projects.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {briefcase.savedBoqs && briefcase.savedBoqs.length > 0 ? (
                                    <div className="space-y-4">
                                        {briefcase.savedBoqs.map(boq => (
                                            <Card key={boq.id} className="p-4 bg-muted/50">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold">{boq.name}</p>
                                                        <p className="text-sm text-muted-foreground">Saved on: {new Date(boq.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">You have no saved BoQ projects.</p>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5"/> Registered Services</CardTitle>
                                    <CardDescription>Manage the services you offer and update your price lists.</CardDescription>
                                </div>
                                <AddServiceDialog onAddService={handleAddService} />
                            </CardHeader>
                            <CardContent>
                                {briefcase.registrations.length > 0 ? (
                                    <div className="space-y-4">
                                        {briefcase.registrations.map(reg => (
                                            <Card key={reg.category} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted/50">
                                                <div>
                                                    <p className="font-semibold">{reg.category}</p>
                                                    {reg.priceListUrl && <p className="text-sm text-muted-foreground">Current Price List: {reg.priceListFilename || 'price_list.csv'}</p>}
                                                </div>
                                                <div className="flex gap-2 mt-2 sm:mt-0">
                                                    {reg.priceListUrl && <Button variant="outline" size="sm" asChild><a href={reg.priceListUrl} download={reg.priceListFilename || 'price_list.csv'}><Download className="mr-2 h-4 w-4"/>Download</a></Button>}
                                                    <UpdatePriceListDialog registration={reg} onUpdate={handleUpdatePriceList} />
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">You have not registered for any services yet. Click "Apply for New Service" to get started.</p>
                                )}
                            </CardContent>
                        </Card>
                        
                         <Card>
                            <CardHeader className="flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> My Documents</CardTitle>
                                    <CardDescription>Upload and manage your personal or business documents.</CardDescription>
                                </div>
                                <UploadDocumentDialog onUpload={handleUploadDocument} />
                            </CardHeader>
                            <CardContent>
                                {briefcase.userDocuments.length > 0 ? (
                                    <div className="space-y-4">
                                        {briefcase.userDocuments.map(doc => (
                                            <Card key={doc.id} className="p-4 bg-muted/50">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold">{doc.name}</p>
                                                        <p className="text-sm text-muted-foreground">Uploaded on: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleAnalyzeDocument(doc)} disabled={analyzingDocId === doc.id}>
                                                             {analyzingDocId === doc.id ? (
                                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analyzing...</>
                                                            ) : (
                                                                <><Wand2 className="mr-2 h-4 w-4"/>Analyze Document</>
                                                            )}
                                                        </Button>
                                                        <Button variant="outline" size="sm" asChild><a href={doc.dataUri} download={doc.name}><Download className="mr-2 h-4 w-4"/>Download</a></Button>
                                                        <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action will permanently delete "{doc.name}" from your briefcase.
                                                            </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteDocument(doc.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                                {doc.analysis && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <AnalysisResultDisplay analysis={doc.analysis} />
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                     <p className="text-sm text-muted-foreground text-center py-4">You have not uploaded any documents yet.</p>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Legal Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="nda" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="nda"><FileText className="mr-2 h-4 w-4"/> Non-Disclosure Agreement</TabsTrigger>
                                        <TabsTrigger value="service"><FileText className="mr-2 h-4 w-4"/> Service Agreement</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="nda">
                                        <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-60 overflow-y-auto">
                                            {briefcase.agreements.ndaContent}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="service">
                                        <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-60 overflow-y-auto">
                                            {briefcase.agreements.serviceAgreementContent}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                             <CardFooter>
                                <Button onClick={() => toast({title: "Agreements already signed."})} className="w-full" size="lg" disabled={briefcase.applicantName === 'Guest User'}>
                                    <FileSignature className="mr-2 h-5 w-5" /> View E-Signature
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
