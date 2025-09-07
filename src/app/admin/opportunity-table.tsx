
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
import type { Opportunity } from "@/lib/opportunities";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Trophy } from "lucide-react";
import { store } from "@/lib/global-store";
import { Skeleton } from "../ui/skeleton";

// This hook now connects to the global store.
export const useOpportunitiesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        opportunities: data.opportunities,
        setOpportunities: (updater: (opportunities: Opportunity[]) => Opportunity[]) => {
            const currentOpportunities = store.get().opportunities;
            const newOpportunities = updater(currentOpportunities);
            store.set(state => ({ ...state, opportunities: newOpportunities }));
        }
    };
};


const OpportunitySchema = z.object({
  title: z.string().min(3, "Title is required"),
  type: z.string().min(3, "Type is required"),
  prize: z.string().min(1, "Prize/Budget is required"),
  deadline: z.string().min(1, "Deadline is required"),
  description: z.string().min(10, "Description is required"),
  status: z.enum(['Open', 'Closed', 'In Progress']),
});
type OpportunityValues = z.infer<typeof OpportunitySchema>;


const AddEditOpportunityDialog = ({ 
    opportunity, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    opportunity?: Opportunity, 
    onSave: (values: OpportunityValues, id?: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
}) => {
    const form = useForm<OpportunityValues>({
        resolver: zodResolver(OpportunitySchema),
        defaultValues: opportunity || { 
            title: "", 
            type: "", 
            prize: "", 
            deadline: "", 
            description: "", 
            status: "Open" 
        },
    });

    useEffect(() => {
        if(isOpen) {
            form.reset(opportunity || { title: "", type: "", prize: "", deadline: "", description: "", status: "Open" });
        }
    }, [opportunity, form, isOpen]);

    const onSubmit: SubmitHandler<OpportunityValues> = (data) => {
        onSave(data, opportunity?.id);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{opportunity ? "Edit" : "Add"} Opportunity</DialogTitle>
                    <DialogDescription>
                        {opportunity ? "Update the details for this opportunity." : "Enter the details for the new opportunity."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., Design Competition" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="prize" render={({ field }) => (
                                <FormItem><FormLabel>Prize / Budget</FormLabel><FormControl><Input placeholder="e.g., 5,000 OMR" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="deadline" render={({ field }) => (
                                <FormItem><FormLabel>Deadline</FormLabel><FormControl><Input placeholder="e.g., 2024-09-01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Opportunity</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function OpportunityTable({
    opportunities,
    setOpportunities,
}: {
    opportunities: Opportunity[],
    setOpportunities: (updater: (opportunities: Opportunity[]) => void) => void,
}) {
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const handleOpenDialog = (opp?: Opportunity) => {
        setSelectedOpp(opp);
        setIsDialogOpen(true);
    }

    const handleSave = (values: OpportunityValues, id?: string) => {
        if (id) {
            // Update
            setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, ...values } : opp));
            toast({ title: "Opportunity updated successfully." });
        } else {
            // Create
            const newOpp: Opportunity = {
                ...values,
                id: `opp_${values.title.substring(0, 5).replace(/\s+/g, '_')}_${new Date().getTime()}`,
                iconName: 'Trophy', // default icon for new opps
                badgeVariant: 'outline',
            };
            setOpportunities(prev => [newOpp, ...prev]);
            toast({ title: "Opportunity added successfully." });
        }
    };

    const handleDelete = (id: string) => {
        setOpportunities(prev => prev.filter(opp => opp.id !== id));
        toast({ title: "Opportunity removed.", variant: "destructive" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Open": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Open</Badge>;
            case "In Progress": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">In Progress</Badge>;
            case "Closed": return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Closed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Opportunity Management</CardTitle>
                    <CardDescription>Manage open projects, tasks, and competitions.</CardDescription>
                </div>
                 <Button onClick={() => handleOpenDialog()}><PlusCircle /> Add Opportunity</Button>
            </CardHeader>
            <CardContent>
                <AddEditOpportunityDialog 
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    opportunity={selectedOpp}
                    onSave={handleSave}
                >
                    <div />
                </AddEditOpportunityDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={5}>
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            opportunities.map(opp => (
                                <TableRow key={opp.id} onClick={() => handleOpenDialog(opp)} className="cursor-pointer">
                                    <TableCell className="font-medium">{opp.title}</TableCell>
                                    <TableCell>{opp.type}</TableCell>
                                    <TableCell>{opp.deadline}</TableCell>
                                    <TableCell>{getStatusBadge(opp.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this opportunity.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(opp.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
