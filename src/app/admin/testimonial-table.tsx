
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

const TestimonialSchema = z.object({
  quote: z.string().min(10, "Quote is required"),
  author: z.string().min(2, "Author is required"),
  company: z.string().min(2, "Company is required"),
  avatarId: z.string().min(1, "Avatar ID is required"),
});
type TestimonialValues = z.infer<typeof TestimonialSchema>;

const AddEditTestimonialDialog = ({ testimonial, onSave, children }: { testimonial?: Testimonial, onSave: (values: TestimonialValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<TestimonialValues>({
        resolver: zodResolver(TestimonialSchema),
        defaultValues: testimonial
    });
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{testimonial ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(data => { onSave(data, testimonial?.id); setIsOpen(false); })} className="space-y-4">
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

export default function TestimonialTable({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        setTestimonials(initialTestimonials);
    }, [initialTestimonials]);

    const handleTestimonialSave = (values: TestimonialValues, id?: string) => {
        // In a real app, this would be a server action.
        toast({ title: `Action not implemented in prototype.` });
    };
    
    const handleTestimonialDelete = (id: string) => {
        // In a real app, this would be a server action.
        toast({ title: 'Action not implemented in prototype.', variant: 'destructive' });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Testimonials</CardTitle>
                 <AddEditTestimonialDialog onSave={handleTestimonialSave}>
                    <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Add Testimonial</Button>
                </AddEditTestimonialDialog>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader><TableRow><TableHead>Author</TableHead><TableHead>Quote</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {testimonials.map(t => (
                            <TableRow key={t.id}>
                                <TableCell>
                                    <p className="font-medium">{t.author}</p>
                                    <p className="text-sm text-muted-foreground">{t.company}</p>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground italic">"{t.quote}"</TableCell>
                                <TableCell className="text-right">
                                    <AddEditTestimonialDialog testimonial={t} onSave={handleTestimonialSave}>
                                        <Button variant="ghost" size="icon"><Edit /></Button>
                                    </AddEditTestimonialDialog>
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
