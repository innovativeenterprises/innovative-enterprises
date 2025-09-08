
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
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
import type { Worker } from "@/lib/raaha-workers";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Home } from "lucide-react";
import Image from 'next/image';
import { store } from "@/lib/global-store";
import { type Agency } from '@/lib/raaha-agencies';
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkersData } from "@/hooks/use-global-store-data";
import { useAgenciesData } from "./agency-settings";

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const WorkerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nationality: z.string().min(2, "Nationality is required"),
  age: z.coerce.number().min(18, "Age must be at least 18"),
  experience: z.string().min(10, "Experience description is required"),
  skills: z.array(z.object({ value: z.string().min(2, "Skill cannot be empty") })),
  availability: z.enum(['Available', 'Not Available']),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5"),
  photoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  photoFile: z.any().optional(),
}).refine(data => data.photoUrl || (data.photoFile && data.photoFile.length > 0), {
    message: "Either a Photo URL or a Photo File is required.",
    path: ["photoUrl"],
});
type WorkerValues = z.infer<typeof WorkerSchema> & { photo: string };


const AddEditWorkerDialog = ({ worker, onSave, children, agencyId }: { worker?: Worker, onSave: (v: WorkerValues, id?: string) => void, children: React.ReactNode, agencyId: Agency['id'] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(worker?.photo || null);

    const form = useForm<z.infer<typeof WorkerSchema>>({
        resolver: zodResolver(WorkerSchema),
        defaultValues: {
            name: worker?.name || "",
            nationality: worker?.nationality || "",
            age: worker?.age || 25,
            experience: worker?.experience || "",
            skills: worker?.skills.map(s => ({ value: s })) || [{ value: '' }],
            availability: worker?.availability || 'Available',
            rating: worker?.rating || 4.5,
            photoUrl: worker?.photo || "",
            photoFile: undefined,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "skills"
    });

    const watchPhotoUrl = form.watch('photoUrl');
    const watchPhotoFile = form.watch('photoFile');

    useEffect(() => {
        if (watchPhotoFile && watchPhotoFile.length > 0) {
            fileToDataURI(watchPhotoFile[0]).then(setImagePreview);
        } else if (watchPhotoUrl) {
            setImagePreview(watchPhotoUrl);
        } else {
            setImagePreview(worker?.photo || null);
        }
    }, [watchPhotoUrl, watchPhotoFile, worker?.photo]);
    
    useEffect(() => { 
        if(isOpen) {
            form.reset({ 
                name: worker?.name || "",
                nationality: worker?.nationality || "",
                age: worker?.age || 25,
                experience: worker?.experience || "",
                skills: worker?.skills.map(s => ({ value: s })) || [{ value: '' }],
                availability: worker?.availability || 'Available',
                rating: worker?.rating || 4.5,
                photoUrl: worker?.photo || "",
                photoFile: undefined,
            });
            setImagePreview(worker?.photo || null);
        }
    }, [worker, form, isOpen]);
    
    const onSubmit: SubmitHandler<z.infer<typeof WorkerSchema>> = async (data) => {
        let photoValue = "";

        if (data.photoFile && data.photoFile[0]) {
            photoValue = await fileToDataURI(data.photoFile[0]);
        } else if (data.photoUrl) {
            photoValue = data.photoUrl;
        }

        onSave({ ...data, photo: photoValue }, worker?.id);
        setImagePreview(null);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader><DialogTitle>{worker ? "Edit" : "Add"} Candidate</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="nationality" render={({ field }) => (
                                <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="age" render={({ field }) => (
                                <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="rating" render={({ field }) => (
                                <FormItem><FormLabel>Rating (0-5)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="availability" render={({ field }) => (
                                <FormItem><FormLabel>Availability</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Not Available">Not Available</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="experience" render={({ field }) => (
                            <FormItem><FormLabel>Experience</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
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
                                                <FormItem className="flex-grow"><FormControl><Input placeholder="e.g., Childcare" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}
                                        />
                                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: "" })}>Add Skill</Button>
                        </div>
                        
                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <h4 className="text-sm font-medium">Candidate Photo</h4>
                                {imagePreview && (
                                    <div className="relative h-24 w-24 rounded-full overflow-hidden border">
                                        <Image src={imagePreview} alt="Photo Preview" fill className="object-cover"/>
                                    </div>
                                )}
                                <FormField control={form.control} name="photoUrl" render={({ field }) => (
                                    <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                                </div>
                                <FormField control={form.control} name="photoFile" render={({ field }) => (
                                    <FormItem><FormLabel>Upload Photo</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                        </Card>
                        
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Candidate</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export function WorkerTable({ workers, setWorkers, agencyId }: { workers: Worker[], setWorkers: (updater: (workers: Worker[]) => void) => void, agencyId: string }) { 
    const { toast } = useToast();
    const { agencies, isClient } = useAgenciesData();

    const handleSave = (values: WorkerValues, id?: string) => {
        const skillsArray = values.skills.map(s => s.value).filter(s => s.trim() !== '');
        const agency = agencies.find(a => a.id === agencyId);
        
        if (id) {
            setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...values, skills: skillsArray } : w));
            toast({ title: "Candidate updated." });
        } else {
            const newWorker: Worker = { ...values, id: `worker_${values.name.toLowerCase().replace(/\s+/g, '_')}`, skills: skillsArray, agencyId: agency!.name };
            setWorkers(prev => [newWorker, ...prev]);
            toast({ title: "Candidate added." });
        }
    };

    const handleDelete = (id: string) => {
        setWorkers(prev => prev.filter(w => w.id !== id));
        toast({ title: "Candidate removed.", variant: "destructive" });
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Agency Candidate Management</CardTitle>
                    <CardDescription>Manage the domestic worker candidates in your agency's database.</CardDescription>
                </div>
                <AddEditWorkerDialog onSave={handleSave} agencyId={agencyId}>
                    <Button><PlusCircle /> Add Candidate</Button>
                </AddEditWorkerDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Nationality</TableHead>
                            <TableHead>Skills</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                   <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                         ) : workers.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No candidates for this agency yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            workers.map(worker => (
                            <TableRow key={worker.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image src={worker.photo} alt={worker.name} width={40} height={40} className="rounded-full object-cover"/>
                                        <div>
                                            <p className="font-medium">{worker.name}</p>
                                            <p className="text-sm text-muted-foreground">{worker.age} years old</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{worker.nationality}</TableCell>
                                <TableCell className="max-w-xs">
                                    <div className="flex flex-wrap gap-1">
                                        {worker.skills.slice(0, 3).map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                        {worker.skills.length > 3 && <Badge variant="outline">+{worker.skills.length - 3}</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={worker.availability === 'Available' ? 'default' : 'outline'} className={worker.availability === 'Available' ? 'bg-green-500/20 text-green-700' : ''}>
                                        {worker.availability}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddEditWorkerDialog worker={worker} onSave={handleSave} agencyId={agencyId}>
                                            <Button variant="ghost" size="icon"><Edit /></Button>
                                        </AddEditWorkerDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete Candidate?</AlertDialogTitle><AlertDialogDescription>This will permanently remove {worker.name} from your database.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(worker.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
