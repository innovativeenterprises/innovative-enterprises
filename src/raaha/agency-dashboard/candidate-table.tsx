
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Worker } from "@/lib/raaha-workers.schema";
import { PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWorkersData } from "@/hooks/use-data-hooks";

const skillOptions = [
    "Childcare", "Elderly Care", "Cooking (Arabic)", "Cooking (Indian)", "Cooking (International)", 
    "General Cleaning", "Deep Cleaning", "Laundry & Ironing", "Pet Care", "Driving License (Oman)", 
    "First Aid Certified", "English Speaking", "Basic Arabic"
];

const WorkerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nationality: z.string().min(2, "Nationality is required"),
  age: z.coerce.number().min(18, "Must be at least 18 years old"),
  skills: z.array(z.string()).min(1, "At least one skill is required."),
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
    
    useEffect(() => {
        if(isOpen) {
            form.reset({
                ...worker,
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
                                <FormField
                                    control={form.control}
                                    name="skills"
                                    render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={(value) => field.onChange([...(field.value || []), value])} >
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a skill to add..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {skillOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {field.value?.map((skill: string) => (
                                                <div key={skill} className="flex items-center gap-1 bg-muted p-1 px-2 rounded-md text-sm">
                                                    {skill}
                                                    <Button type="button" variant="ghost" size="icon" className="h-4 w-4" onClick={() => field.onChange(field.value?.filter((s: string) => s !== skill))}>
                                                        <Trash2 className="h-3 w-3 text-destructive" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </FormItem>
                                    )}
                                />
                            </div>
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

export function CandidateTable({ columns, agencyId, initialWorkers }: { 
    columns: any[], 
    agencyId: string, 
    initialWorkers: Worker[]
}) {
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();
    const { data: workers, setData: setWorkers } = useWorkersData(initialWorkers);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredWorkers = workers.filter(w => w.agencyId === agencyId);
    
    const handleSave = (values: WorkerValues, id?: string) => {
        const newWorker = { ...values };
        if (id) {
            setWorkers((prev: Worker[]) => prev.map(w => w.id === id ? { ...w, ...newWorker } as Worker : w));
            toast({ title: "Candidate updated." });
        } else {
            setWorkers((prev: Worker[]) => [...prev, { ...newWorker, id: `worker_${Date.now()}` }]);
            toast({ title: "Candidate added." });
        }
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Candidate Database</CardTitle>
                    <CardDescription>Manage your agency's roster of available domestic workers.</CardDescription>
                </div>
                 <AddEditWorkerDialog onSave={handleSave} agencyId={agencyId}>
                    <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Candidate</Button>
                </AddEditWorkerDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map(col => <TableHead key={col.Header}>{col.Header}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={columns.length}><Skeleton className="h-12 w-full" /></TableCell>
                            </TableRow>
                        ) : filteredWorkers.length === 0 ? (
                            <TableRow><TableCell colSpan={columns.length} className="text-center text-muted-foreground h-24">No candidates found for this agency.</TableCell></TableRow>
                        ) : (
                            filteredWorkers.map(worker => (
                                <TableRow key={worker.id}>
                                    {columns.map(col => (
                                        <TableCell key={col.accessor}>
                                            {col.Cell ? col.Cell({ row: { original: worker } }) : worker[col.accessor as keyof Worker]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
