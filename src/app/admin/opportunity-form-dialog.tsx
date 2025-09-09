
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Opportunity } from "@/lib/opportunities";
import { OpportunitySchema, type OpportunityValues } from "@/lib/opportunities.schema";


export const AddEditOpportunityDialog = ({ 
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
