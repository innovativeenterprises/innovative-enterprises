
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
import { PlusCircle, Edit, Trash2, Upload, FileText, User, Building, Banknote } from "lucide-react";
import { store } from "@/lib/global-store";

// Hook to connect to the global store
export const useInvestorsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        investors: data.investors,
        setInvestors: (updater: (investors: Investor[]) => Investor[]) => {
            const currentInvestors = store.get().investors;
            const newInvestors = updater(currentInvestors);
            store.set(state => ({ ...state, investors: newInvestors }));
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

const InvestorSchema = z.object({
  name: z.string().min(3, "Name is required"),
  type: z.enum(['Investor', 'Funder']),
  subType: z.enum(['Personal/Private', 'Angel', 'Institute/Government', 'VC Fund']),
  profile: z.string().min(10, "A brief profile/description is required"),
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
    const form = useForm<InvestorValues>({
        resolver: zodResolver(InvestorSchema),
        defaultValues: investor || {
            name: "",
            type: "Investor",
            subType: "Personal/Private",
            profile: "",
        },
    });

    useEffect(() => {
        if(isOpen) {
           form.reset(investor || { name: "", type: "Investor", subType: "Personal/Private", profile: "" });
        }
    }, [investor, form, isOpen]);

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
                                    <SelectItem value="Personal/Private">Personal/Private</SelectItem><SelectItem value="Angel">Angel</SelectItem><SelectItem value="Institute/Government">Institute/Government</SelectItem><SelectItem value="VC Fund">VC Fund</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="profile" render={({ field }) => (
                            <FormItem><FormLabel>Profile & Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <Card className="bg-muted/50">
                            <CardHeader><CardTitle className="text-base">Upload Documents (Optional)</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="crDoc" render={({ field }) => (
                                    <FormItem><FormLabel>Commercial Record (CR)</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
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

export default function InvestorTable({ investors, setInvestors }: { investors: Investor[], setInvestors: (updater: (investors: Investor[]) => void) => void }) {
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
                id: `inv_${Date.now()}`,
                name: values.name,
                type: values.type,
                subType: values.subType,
                profile: values.profile,
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
                            <TableHead>Type</TableHead>
                            <TableHead>Documents</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {investors.map(inv => (
                            <TableRow key={inv.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            {getTypeIcon(inv.type, inv.subType)}
                                        </div>
                                        <div>
                                            <p className="font-medium">{inv.name}</p>
                                            <p className="text-sm text-muted-foreground">{inv.profile}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{inv.subType}</Badge>
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
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(inv.id)}>Delete</AlertDialogAction>
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
