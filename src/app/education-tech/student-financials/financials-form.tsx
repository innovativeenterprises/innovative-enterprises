
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Student } from '@/lib/students.schema';
import { useEffect } from 'react';

const StudentFinancialsSchema = z.object({
  tuitionBilled: z.coerce.number().min(0, "Amount must be non-negative"),
  scholarshipAmount: z.coerce.number().min(0, "Amount must be non-negative"),
  amountPaid: z.coerce.number().min(0, "Amount must be non-negative"),
});
export type StudentFinancialsValues = z.infer<typeof StudentFinancialsSchema>;

export const AddEditStudentFinancialsDialog = ({
    student,
    onSave,
    isOpen,
    onOpenChange,
    children,
}: {
    student?: Student,
    onSave: (values: StudentFinancialsValues, id: string) => void,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    children: React.ReactNode
}) => {
    const form = useForm<StudentFinancialsValues>({
        resolver: zodResolver(StudentFinancialsSchema),
    });

    useEffect(() => {
        if(isOpen && student) {
            form.reset({
                tuitionBilled: student.tuitionBilled || 0,
                scholarshipAmount: student.scholarshipAmount || 0,
                amountPaid: student.amountPaid || 0,
            });
        }
    }, [isOpen, student, form]);

    const onSubmit: SubmitHandler<StudentFinancialsValues> = (data) => {
        if (!student) return;
        onSave(data, student.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Financials for {student?.name}</DialogTitle>
                </DialogHeader>
                {student && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="tuitionBilled" render={({ field }) => (
                                <FormItem><FormLabel>Total Tuition Billed (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="scholarshipAmount" render={({ field }) => (
                                <FormItem><FormLabel>Scholarship Amount (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="amountPaid" render={({ field }) => (
                                <FormItem><FormLabel>Total Amount Paid (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};
