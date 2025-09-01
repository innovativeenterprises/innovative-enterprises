
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type CommunityFinance } from '@/lib/community-finances';

const TransactionSchema = z.object({
  description: z.string().min(3, "Description is required"),
  type: z.enum(['Income', 'Expense']),
  category: z.enum(['Membership Dues', 'Donation', 'Event Ticket Sales', 'Event Costs', 'Operational Costs', 'Charity Payout']),
  amount: z.coerce.number().positive("Amount must be a positive number."),
});
export type TransactionValues = z.infer<typeof TransactionSchema>;

export const AddEditTransactionDialog = ({
    transaction,
    onSave,
    children
}: {
    transaction?: CommunityFinance,
    onSave: (values: TransactionValues, id?: string) => void,
    children: React.ReactNode,
}) => {
    const form = useForm<TransactionValues>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: transaction || {
            description: "",
            type: "Expense",
            category: "Operational Costs",
            amount: 0,
        },
    });

    const onSubmit: SubmitHandler<TransactionValues> = (data) => {
        onSave(data, transaction?.id);
        form.reset();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{transaction ? "Edit" : "Add"} Transaction</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Income">Income</SelectItem><SelectItem value="Expense">Expense</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Membership Dues">Membership Dues</SelectItem>
                                    <SelectItem value="Donation">Donation</SelectItem>
                                    <SelectItem value="Event Ticket Sales">Event Ticket Sales</SelectItem>
                                    <SelectItem value="Event Costs">Event Costs</SelectItem>
                                    <SelectItem value="Operational Costs">Operational Costs</SelectItem>
                                    <SelectItem value="Charity Payout">Charity Payout</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem><FormLabel>Amount (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Transaction</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
