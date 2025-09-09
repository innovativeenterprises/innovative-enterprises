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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Investor } from "@/lib/investors";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Upload, FileText, User, Building, Banknote, Loader2, Percent, Wand2 } from "lucide-react";
import { analyzeCrDocument } from "@/ai/flows/cr-analysis";
import { Skeleton } from "../ui/skeleton";
import { useInvestorsData } from "@/hooks/use-global-store-data";
import { fileToDataURI } from "@/lib/utils";

const InvestorSchema = z.object({
  name: z.string().min(3, "Name is required"),
  type: z.enum(['Investor', 'Funder']),
  subType: z.enum(['Personal/Private', 'Angel', 'Institute/Government', 'VC Fund']),
  profile: z.string().min(10, "A brief profile/description is required"),
  focusArea: z.string().min(3, "Focus area is required"),
  country: z.string().min(2, "Country is required"),
  investmentValue: z.coerce.number().optional(),
  sharePercentage: z.coerce.number().optional(),
  // Document fields
  crDoc: z.any().optional(),
  vatIdDoc: z.any().optional(),
  passportDoc: z.any().optional(),
  civilIdDoc: z.any().optional(),
  incomeProofDoc: z.any().optional(),
});
type InvestorValues = z.infer<typeof InvestorSchema>;

const AddEditInvestorDialog = ({ 
    investor, 
    onSave,
    children,
}: { 
    investor?: Investor, 
    onSave: (values: InvestorValues, id?: string) => Promise<void>,
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const form = useForm<InvestorValues>({
        resolver: zodResolver(InvestorSchema),
        defaultValues: investor || {
            name: "",
            type: "Investor",
            subType: "Personal/Private",
            profile: "",
            focusArea: "",
            country: "",
            investmentValue: 0,
            sharePercentage: 0,
        },
    });

    const { toast } = useToast();

    useEffect(() => {
        if(isOpen) {
           form.reset(investor || { name: "", type: "Investor", subType: "Personal/Private", profile: "", focusArea: "", country: "", investmentValue: 0, sharePercentage: 0 });
        }
    }, [investor, form, isOpen]);

    const handleCrAnalysis = async () => {
        const crFile = form.getValues('crDoc');
        if (!crFile || crFile.length === 0) {
            toast({ title: 'Please select a CR document first.', variant: 'destructive' });
            return;
        }

        setIsAnalyzing(true);
        toast({ title: 'Analyzing Document...', description: 'Please wait while the AI extracts information.' });

        try {
            const uri = await fileToDataURI(crFile[0]);
            const result = await analyzeCrDocument({ documentDataUri: uri });
            
            if (result.companyInfo?.companyNameEnglish) {
                form.setValue('name', result.companyInfo.companyNameEnglish);
            } else if (result.companyInfo?.companyNameArabic) {
                form.setValue('name', result.companyInfo.companyNameArabic);
            }
             if (result.summary) {
                form.setValue('profile', result.summary);
            }

            toast({ title: "Analysis Complete", description: "Investor details have been pre-filled from the CR." });
        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Could not analyze the document.", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const onSubmit: SubmitHandler<InvestorValues> = async (data) => {
        setIsLoading(true);
        await onSave(data, investor?.id);
        setIsLoading(false);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{investor ? "Edit" : "Add"} Investor / Funder</DialogTitle>
                    <DialogDescription>
                        {investor ? "Update the details for this entity." : "Enter the details for a new investor or funder."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name / Institute</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Investor">Investor</SelectItem><SelectItem value="Funder">Funder</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="subType" render={({ field }) => (
                                <FormItem><FormLabel>Sub-Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Personal/Private">Personal/Private</SelectItem>
                                    <SelectItem value="Angel">Angel</SelectItem>
                                    <SelectItem value="Institute/Government">Institute/Government</SelectItem>
                                    <SelectItem value="VC Fund">VC Fund</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="profile" render={({ field }) => (
                            <FormItem><FormLabel>Profile & Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="focusArea" render={({ field }) => (
                                <FormItem><FormLabel>Investment Sector / Focus Area</FormLabel><FormControl><Input placeholder="e.g., AI Projects, Real Estate Tech" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="country" render={({ field }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="e.g., Oman" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="investmentValue" render={({ field }) => (
                                <FormItem><FormLabel>Investment Value (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="sharePercentage" render={({ field }) => (
                                <FormItem><FormLabel>Share (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        
                        <Card className="bg-muted/50">
                            <CardHeader><CardTitle className="text-base">Upload Documents (Optional)</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="crDoc" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Commercial Record (CR)</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl className="flex-1"><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                            <Button type="button" variant="secondary" onClick={handleCrAnalysis} disabled={isAnalyzing}>
                                                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                                Analyze
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="vatIdDoc" render={({ field }) => (
                                    <FormItem><FormLabel>VAT ID Document</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="passportDoc" render={({ field }) => (
                                    <FormItem><FormLabel>Passport</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="civilIdDoc" render={({ field }) => (
                                    <FormItem><FormLabel>Civil / Residence ID</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="incomeProofDoc" render={({ field }) => (
                                    <FormItem><FormLabel>Proof of Income</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                        
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null} Save Record</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function InvestorTable({ investors, setInvestors, isClient }: { investors: Investor[], setInvestors: (updater: (investors: Investor[]) => void) => void, isClient: boolean }) {
    const { toast } = useToast();

    const handleSave = async (values: InvestorValues, id?: string) => {
        const uploadedDocs: Investor['documents'] = {};
        
        // Helper to process file uploads
        const processDoc = async (key: keyof Investor['documents'], fileList: any) => {
            if (fileList && fileList.length > 0) {
                const file = fileList[0];
                const dataUri = await fileToDataURI(file);
                uploadedDocs[key] = { name: file.name, dataUri };
            }
        };

        await processDoc('cr', values.crDoc);
        await processDoc('vatId', values.vatIdDoc);
        await processDoc('passport', values.passportDoc);
        await processDoc('civilId', values.civilIdDoc);
        await processDoc('incomeProof', values.incomeProofDoc);

        if (id) {
            setInvestors(prev => prev.map(inv => inv.id === id ? { ...inv, ...values, documents: { ...inv.documents, ...uploadedDocs } } : inv));
            toast({ title: "Investor updated successfully." });
        } else {
            const newInvestor: Investor = {
                id: `inv_${values.name.replace(/\s+/g, '_').toLowerCase()}`,
                name: values.name,
                type: values.type,
                subType: values.subType,
                profile: values.profile,
                focusArea: values.focusArea,
                country: values.country,
                investmentValue: values.investmentValue,
                sharePercentage: values.sharePercentage,
                documents: uploadedDocs,
            };
            setInvestors(prev => [newInvestor, ...prev]);
            toast({ title: "Investor added successfully." });
        }
    };

    const handleDelete = (id: string) => {
        setInvestors(prev => prev.filter(inv => inv.id !== id));
        toast({ title: "Record removed.", variant: "destructive" });
    };

    const getTypeIcon = (type: string, subType: string) => {
        if (type === 'Funder') return <Banknote />;
        if (subType === 'Personal/Private' || subType === 'Angel') return <User />;
        return <Building />;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Investor & Funder Management</CardTitle>
                    <CardDescription>Manage all financial partners and funding sources.</CardDescription>
                </div>
                <AddEditInvestorDialog onSave={handleSave}>
                    <Button><PlusCircle /> Add Record</Button>
                </AddEditInvestorDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name / Institute</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Focus Area</TableHead>
                            <TableHead>Value (OMR)</TableHead>
                            <TableHead>Share</TableHead>
                            <TableHead>Documents</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={7}>
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            investors.map(inv => (
                                <TableRow key={inv.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                {getTypeIcon(inv.type, inv.subType)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{inv.name}</p>
                                                <p className="text-sm text-muted-foreground">{inv.subType}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{inv.country}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{inv.focusArea}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{inv.investmentValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '-'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-medium">
                                            {inv.sharePercentage ? `${inv.sharePercentage}%` : '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 flex-wrap">
                                            {Object.entries(inv.documents).map(([key, doc]) => (
                                                doc && <a href={doc.dataUri} download={doc.name} key={key}><FileText className="h-5 w-5 text-muted-foreground hover:text-primary" /></a>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AddEditInvestorDialog investor={inv} onSave={handleSave}>
                                                <Button variant="ghost" size="icon"><Edit /></Button>
                                            </AddEditInvestorDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this record.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(inv.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}