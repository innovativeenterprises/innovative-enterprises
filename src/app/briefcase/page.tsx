
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Download, FileSignature, FileText, AlertTriangle, FileSpreadsheet, Edit, PlusCircle, Upload, Loader2, CheckCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

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

interface Agreement {
    ndaContent: string;
    serviceAgreementContent: string;
}

interface ServiceRegistration {
    category: string;
    priceListUrl?: string;
    priceListFilename?: string;
}

interface BriefcaseData {
    recordNumber: string;
    applicantName: string;
    agreements: Agreement;
    date: string;
    registrations: ServiceRegistration[];
}

const NewServiceSchema = z.object({
  businessCategory: z.string().min(1, "Please select a business category."),
  serviceChargesFile: z.any().refine(file => file?.length > 0, 'A price list is required.'),
});

const UpdatePriceListSchema = z.object({
    serviceChargesFile: z.any().refine(file => file?.length > 0, 'A new price list file is required.'),
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

export default function BriefcasePage() {
    const [briefcaseData, setBriefcaseData] = useState<BriefcaseData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const updateBriefcase = (newData: BriefcaseData) => {
        setBriefcaseData(newData);
        localStorage.setItem('user_briefcase', JSON.stringify(newData));
    };
    
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('user_briefcase');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // migration for old data structure
                if (parsedData.serviceChargesDataUri && !parsedData.registrations) {
                    parsedData.registrations = [{ category: 'General Services', priceListUrl: parsedData.serviceChargesDataUri, priceListFilename: 'service-charges.csv' }];
                    delete parsedData.serviceChargesDataUri;
                }
                 if (!parsedData.registrations) {
                    parsedData.registrations = [];
                }
                setBriefcaseData(parsedData);
            }
        } catch (error) {
            console.error("Failed to load briefcase data from localStorage", error);
            toast({ title: 'Error Loading Data', description: 'Could not retrieve your saved documents.', variant: 'destructive'});
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    const handleAddService = (category: string, priceListUrl: string, priceListFilename: string) => {
        if (!briefcaseData) return;
        const newRegistration: ServiceRegistration = { category, priceListUrl, priceListFilename };
        const newData = { ...briefcaseData, registrations: [...briefcaseData.registrations, newRegistration]};
        updateBriefcase(newData);
    }
    
    const handleUpdatePriceList = (category: string, priceListUrl: string, priceListFilename: string) => {
         if (!briefcaseData) return;
         const updatedRegistrations = briefcaseData.registrations.map(reg => 
            reg.category === category ? { ...reg, priceListUrl, priceListFilename } : reg
         );
         const newData = { ...briefcaseData, registrations: updatedRegistrations };
         updateBriefcase(newData);
    }
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {briefcaseData ? (
                        <div className="space-y-12">
                             <div>
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                    <Briefcase className="w-10 h-10 text-primary" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-primary text-center">My E-Briefcase</h1>
                                <p className="mt-4 text-lg text-muted-foreground text-center">
                                    Welcome, <span className="font-semibold text-primary">{briefcaseData.applicantName}</span>. Manage your partnership documents and services here.
                                </p>
                            </div>
                            <Card>
                                <CardHeader className="flex-row justify-between items-center">
                                    <div>
                                        <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5"/> Registered Services</CardTitle>
                                        <CardDescription>Manage the services you offer and update your price lists.</CardDescription>
                                    </div>
                                    <AddServiceDialog onAddService={handleAddService} />
                                </CardHeader>
                                <CardContent>
                                    {briefcaseData.registrations.length > 0 ? (
                                        <div className="space-y-4">
                                            {briefcaseData.registrations.map(reg => (
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
                                        <p className="text-sm text-muted-foreground text-center py-4">You have not registered for any services yet.</p>
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
                                                {briefcaseData.agreements.ndaContent}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="service">
                                            <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-60 overflow-y-auto">
                                                {briefcaseData.agreements.serviceAgreementContent}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                                 <CardFooter>
                                    <Button onClick={() => toast({title: "Agreements already signed."})} className="w-full" size="lg" disabled>
                                        <FileSignature className="mr-2 h-5 w-5" /> View E-Signature
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ) : (
                         <div className="max-w-3xl mx-auto text-center">
                            <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full w-fit mb-4">
                                <AlertTriangle className="w-10 h-10 text-yellow-500" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Your E-Briefcase is Empty</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                It looks like you haven't saved any documents yet. After you complete an agent or partner application, you can save your agreements and manage your services here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
