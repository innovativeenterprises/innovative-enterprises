
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Investor } from "@/lib/investors.schema";
import { InvestorSchema } from "@/lib/investors.schema";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvestorsData } from '@/hooks/use-global-store-data';

type InvestorValues = z.infer<typeof InvestorSchema>;

const AddEditInvestorDialog = ({ investor, onSave, children }: { investor?: Investor, onSave: (values: InvestorValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<InvestorValues>({
        resolver: zodResolver(InvestorSchema),
        defaultValues: investor || {
            name: "",
            type: "Investor",
            subType: "Angel",
        }
    });

    useEffect(() => {
        if(isOpen) form.reset(investor);
    }, [investor, form, isOpen]);

    const onSubmit: SubmitHandler<InvestorValues> = (data) => {
        onSave(data, investor?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{investor ? "Edit" : "Add"} Investor/Funder</DialogTitle></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
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
                    {/* Other fields omitted for brevity */}
                    <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save</Button></DialogFooter>
                </form></Form>
            </DialogContent>
        </Dialog>
    );
};

export default function InvestorTable({ initialInvestors }: { initialInvestors: Investor[] }) {
    const { investors, setInvestors, isClient } = useInvestorsData();
    const { toast } = useToast();

    useEffect(() => {
        setInvestors(() => initialInvestors);
    }, [initialInvestors, setInvestors]);

    const handleSave = (values: InvestorValues, id?: string) => {
        const newInvestorData = { ...values, documents: {} };
        if (id) {
            setInvestors(prev => prev.map(inv => inv.id === id ? { ...inv, ...newInvestorData } : inv));
            toast({ title: 'Investor updated.' });
        } else {
            const newInvestor: Investor = { ...newInvestorData, id: `inv_${Date.now()}` };
            setInvestors(prev => [newInvestor, ...prev]);
            toast({ title: 'Investor added.' });
        }
    };

    const handleDelete = (id: string) => {
        setInvestors(prev => prev.filter(inv => inv.id !== id));
        toast({ title: 'Investor removed.', variant: 'destructive' });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Investors & Funders</CardTitle>
                    <CardDescription>Manage your list of potential and current investors.</CardDescription>
                </div>
                <AddEditInvestorDialog onSave={handleSave}>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Investor</Button>
                </AddEditInvestorDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Focus Area</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? <TableRow><TableCell colSpan={4}><Skeleton className="w-full h-12" /></TableCell></TableRow> :
                            investors.map(investor => (
                                <TableRow key={investor.id}>
                                    <TableCell className="font-medium">{investor.name}</TableCell>
                                    <TableCell>{investor.subType}</TableCell>
                                    <TableCell>{investor.focusArea}</TableCell>
                                    <TableCell className="text-right">
                                        <AddEditInvestorDialog investor={investor} onSave={handleSave}>
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </AddEditInvestorDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete Investor?</AlertDialogTitle></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(investor.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
