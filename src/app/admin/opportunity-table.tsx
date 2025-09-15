
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
import type { Opportunity, OpportunityBadgeVariant } from "@/lib/opportunities";
import { opportunityIconMap } from "@/lib/opportunities";
import { OpportunitySchema, type OpportunityValues } from "@/lib/opportunities.schema";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useOpportunitiesData, setOpportunities } from "@/hooks/use-global-store-data";
import { Skeleton } from "@/components/ui/skeleton";


const AddEditOpportunityDialog = ({ 
    opportunity, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    opportunity?: Opportunity, 
    onSave: (values: OpportunityValues & { iconName: keyof typeof opportunityIconMap, badgeVariant: OpportunityBadgeVariant }, id?: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const form = useForm<OpportunityValues>({
        resolver: zodResolver(OpportunitySchema),
    });

    useEffect(() => {
        if(isOpen) {
            form.reset(opportunity || { title: "", type: "", prize: "", deadline: "", description: "", status: "Open" });
        }
    }, [opportunity, form, isOpen]);

    const onSubmit: SubmitHandler<OpportunityValues> = (data) => {
        const iconName = Object.keys(opportunityIconMap).find(key => key.toLowerCase().includes(data.type.split(" ")[0].toLowerCase())) as keyof typeof opportunityIconMap || 'Trophy';
        const badgeVariant: OpportunityBadgeVariant = data.type.toLowerCase().includes('competition') ? 'default' : data.type.toLowerCase().includes('project') ? 'destructive' : 'secondary';
        onSave({ ...data, iconName, badgeVariant }, opportunity?.id);
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

export default function OpportunityTable() {
    const { opportunities, isClient } = useOpportunitiesData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | undefined>(undefined);

    const openDialog = (opp?: Opportunity) => {
        setSelectedOpp(opp);
        setIsDialogOpen(true);
    }

    const handleSave = (values: OpportunityValues & { iconName: keyof typeof opportunityIconMap, badgeVariant: OpportunityBadgeVariant }, id?: string) => {
        if (id) {
            setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, ...values } : opp));
            toast({ title: "Opportunity updated successfully." });
        } else {
            const newOpp: Opportunity = { ...values, id: `opp_${values.title.toLowerCase().replace(/\s+/g, '_')}` };
            setOpportunities(prev => [newOpp, ...prev]);
            toast({ title: "Opportunity added successfully." });
        }
    };

    const handleDelete = (id: string) => {
        setOpportunities(prev => prev.filter(opp => opp.id !== id));
        toast({ title: "Opportunity removed.", variant: "destructive" });
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Opportunities & Competitions</CardTitle>
                    <CardDescription>Manage the open tasks and projects available to your partner network.</CardDescription>
                </div>
                 <Button onClick={() => openDialog()}><PlusCircle /> Add Opportunity</Button>
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
                            <TableHead>Prize/Budget</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            opportunities.map(opp => (
                                <TableRow key={opp.id}>
                                    <TableCell className="font-medium">{opp.title}</TableCell>
                                    <TableCell>{opp.type}</TableCell>
                                    <TableCell>{opp.prize}</TableCell>
                                    <TableCell>{opp.deadline}</TableCell>
                                    <TableCell>{opp.status}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog(opp)}><Edit /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Delete Opportunity?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{opp.title}".</AlertDialogDescription></AlertDialogHeader>
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
