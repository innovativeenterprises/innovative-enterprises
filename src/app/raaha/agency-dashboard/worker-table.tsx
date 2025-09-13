
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Worker } from "@/lib/raaha-workers";
import { PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";

const skillOptions = [
    "Childcare", "Elderly Care", "Cooking (Arabic)", "Cooking (Indian)", "Cooking (International)", 
    "General Cleaning", "Deep Cleaning", "Laundry & Ironing", "Pet Care", "Driving License (Oman)", 
    "First Aid Certified", "English Speaking", "Basic Arabic"
];

const WorkerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nationality: z.string().min(2, "Nationality is required"),
  age: z.coerce.number().min(18, "Must be at least 18 years old"),
  skills: z.array(z.object({ value: z.string() })).min(1, "At least one skill is required."),
  experience: z.string().min(10, "Experience summary is required"),
  availability: z.enum(['Available', 'Not Available']),
  rating: z.coerce.number().min(0).max(5),
  photo: z.string().url("A valid photo URL is required"),
  agencyId: z.string(),
});
type WorkerValues = z.infer<typeof WorkerSchema>;

export const AddEditWorkerDialog = ({ 
    worker, 
    onSave,
    agencyId,
    children,
}: { 
    worker?: Worker, 
    onSave: (values: WorkerValues, id?: string) => void,
    agencyId: string,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const form = useForm<WorkerValues>({
        resolver: zodResolver(WorkerSchema),
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'skills',
    });

    useEffect(() => {
        if(isOpen) {
            form.reset({
                ...worker,
                skills: worker?.skills.map(s => ({ value: s })) || [{ value: '' }],
                agencyId: agencyId,
            });
        }
    }, [worker, form, isOpen, agencyId]);

    const onSubmit: SubmitHandler<WorkerValues> = (data) => {
        onSave(data, worker?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{worker ? "Edit" : "Add"} Candidate</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Candidate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="nationality" render={({ field }) => (
                                <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="age" render={({ field }) => (
                                <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="experience" render={({ field }) => (
                            <FormItem><FormLabel>Experience Summary</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div>
                             <FormLabel>Skills</FormLabel>
                             <div className="space-y-2 mt-2">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`skills.${index}.value`}
                                            render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a skill..." /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {skillOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                            )}
                                        />
                                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                            </div>
                             <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: ''})}><PlusCircle className="mr-2 h-4 w-4"/> Add Skill</Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="availability" render={({ field }) => (
                                <FormItem><FormLabel>Availability</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="Not Available">Not Available</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="rating" render={({ field }) => (
                                <FormItem><FormLabel>Rating (1-5)</FormLabel><FormControl><Input type="number" step="0.1" min="1" max="5" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="photo" render={({ field }) => (
                            <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         {form.watch('photo') && (
                            <Image src={form.watch('photo')} alt="Photo Preview" width={80} height={80} className="rounded-full object-cover" />
                         )}
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Candidate</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
