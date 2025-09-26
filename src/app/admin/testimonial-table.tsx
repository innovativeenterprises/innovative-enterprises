
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import type { Testimonial } from "@/lib/clients.schema";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTestimonialsData } from "@/hooks/use-data-hooks";

const TestimonialSchema = z.object({
  quote: z.string().min(10, "Quote is required"),
  author: z.string().min(2, "Author is required"),
  company: z.string().min(2, "Company is required"),
  avatarId: z.string().min(1, "Avatar ID is required"),
});
type TestimonialValues = z.infer<typeof TestimonialSchema>;

const AddEditTestimonialDialog = ({ 
    testimonial, 
    onSave, 
    children,
    isOpen,
    onOpenChange,
}: { 
    testimonial?: Testimonial, 
    onSave: (values: TestimonialValues, id?: string) => void, 
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const form = useForm<TestimonialValues>({
        resolver: zodResolver(TestimonialSchema),
    });

    useEffect(() => {
        if (isOpen) {
            form.reset(testimonial || { quote: '', author: '', company: '', avatarId: '' });
        }
    }, [testimonial, form, isOpen]);
    
    const onSubmit: SubmitHandler<TestimonialValues> = (data) => {
        onSave(data, testimonial?.id); 
        onOpenChange(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{testimonial ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField control={form.control} name="quote" render={({ field }) => (
                        <FormItem><FormLabel>Quote</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="author" render={({ field }) => (
                        <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="avatarId" render={({ field }) => (
                        <FormItem><FormLabel>Avatar ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save Testimonial</Button></DialogFooter>
                </form></Form>
            </DialogContent>
        </Dialog>
    );
};

export default function TestimonialTable() {
    const { data: testimonials, setData: setTestimonials, isClient } = useTestimonialsData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | undefined>(undefined);

    const handleOpenDialog = (testimonial?: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsDialogOpen(true);
    };

    const handleTestimonialSave = (values: TestimonialValues, id?: string) => {
        if (id) {
            setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...values } : t));
            toast({ title: 'Testimonial updated.' });
        } else {
            const newTestimonial = { ...values, id: `test_${Date.now()}` };
            setTestimonials(prev => [newTestimonial, ...prev]);
            toast({ title: 'Testimonial added.' });
        }
    };
    
    const handleTestimonialDelete = (id: string) => {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        toast({ title: 'Testimonial removed.', variant: 'destructive' });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Testimonials</CardTitle>
                 <Button variant="outline" onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Testimonial
                 </Button>
            </CardHeader>
            <CardContent>
                <AddEditTestimonialDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    testimonial={selectedTestimonial}
                    onSave={handleTestimonialSave}
                >
                    <div />
                </AddEditTestimonialDialog>
                 <Table>
                    <TableHeader><TableRow><TableHead>Author</TableHead><TableHead>Quote</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow><TableCell colSpan={3}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                        ) : testimonials.map(t => (
                            <TableRow key={t.id}>
                                <TableCell>
                                    <p className="font-medium">{t.author}</p>
                                    <p className="text-sm text-muted-foreground">{t.company}</p>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground italic">"{t.quote}"</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(t)}>
                                        <Edit />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button></AlertDialogTrigger>
                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Testimonial?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleTestimonialDelete(t.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
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
