
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Worker } from "@/lib/raaha-workers.schema";
import type { BeautySpecialist } from '@/lib/beauty-specialists.schema';
import { PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWorkersData, useBeautySpecialistsData } from "@/hooks/use-data-hooks";

type GenericStaff = Worker | BeautySpecialist;

const skillOptions = [
    "Childcare", "Elderly Care", "Cooking (Arabic)", "Cooking (Indian)", "Cooking (International)", 
    "General Cleaning", "Deep Cleaning", "Laundry & Ironing", "Pet Care", "Driving License (Oman)", 
    "First Aid Certified", "English Speaking", "Basic Arabic"
];

const StaffSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialty: z.string().min(3, "Specialty or primary skill is required"),
  photo: z.string().url("A valid photo URL is required"),
  // RaaHA specific
  nationality: z.string().optional(),
  age: z.coerce.number().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  availability: z.enum(['Available', 'Not Available']).optional(),
  rating: z.coerce.number().optional(),
});
type StaffValues = z.infer<typeof StaffSchema>;


const AddEditStaffDialog = ({ 
    staffMember, 
    onSave,
    agencyId,
    dashboardType,
    children,
    isOpen,
    onOpenChange,
}: { 
    staffMember?: GenericStaff, 
    onSave: (values: Partial<GenericStaff>, id?: string) => void,
    agencyId: string,
    dashboardType: 'raaha' | 'beauty',
    children: React.ReactNode,
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    
    const form = useForm<StaffValues>({
        resolver: zodResolver(StaffSchema),
    });
    
    useEffect(() => {
        if(isOpen) {
            const defaultPhoto = `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`;
            if (staffMember && 'specialty' in staffMember) { // BeautySpecialist
                form.reset({
                    name: staffMember.name,
                    specialty: staffMember.specialty,
                    photo: staffMember.photo || defaultPhoto,
                });
            } else if (staffMember && 'nationality' in staffMember) { // Raaha Worker
                 form.reset({
                    name: staffMember.name,
                    nationality: staffMember.nationality,
                    age: staffMember.age,
                    specialty: staffMember.skills.join(', '), // Using specialty for skills overview
                    skills: staffMember.skills,
                    experience: staffMember.experience,
                    availability: staffMember.availability,
                    rating: staffMember.rating,
                    photo: staffMember.photo || defaultPhoto,
                });
            } else {
                 form.reset({
                    name: '',
                    specialty: '',
                    photo: defaultPhoto,
                    nationality: '',
                    age: 18,
                    skills: [],
                    experience: '',
                    availability: 'Available',
                    rating: 4.5,
                });
            }
        }
    }, [staffMember, form, isOpen]);

    const onSubmit: SubmitHandler<StaffValues> = (data) => {
        const commonData = {
            name: data.name,
            photo: data.photo,
        };

        if (dashboardType === 'beauty') {
            onSave({ ...commonData, specialty: data.specialty }, staffMember?.id);
        } else { // raaha
            onSave({
                ...commonData,
                nationality: data.nationality || '',
                age: data.age || 18,
                skills: data.skills || data.specialty.split(',').map(s => s.trim()),
                experience: data.experience || '',
                availability: data.availability || 'Available',
                rating: data.rating || 0,
            }, staffMember?.id);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{staffMember ? "Edit" : "Add"} {dashboardType === 'raaha' ? 'Candidate' : 'Specialist'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
                         <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        {dashboardType === 'raaha' ? (
                            <>
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
                                 <FormField control={form.control} name="skills" render={({ field }) => (
                                     <FormItem><FormLabel>Skills</FormLabel>
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
                                     <FormMessage /></FormItem>
                                 )}/>
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
                            </>
                        ) : (
                             <FormField control={form.control} name="specialty" render={({ field }) => (
                                <FormItem><FormLabel>Specialty</FormLabel><FormControl><Input placeholder="e.g., Hair Stylist, Nail Technician" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        )}

                        <FormField control={form.control} name="photo" render={({ field }) => (
                            <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         {form.watch('photo') && (
                            <Image src={form.watch('photo')} alt="Photo Preview" width={80} height={80} className="rounded-full object-cover" />
                         )}
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function AgencyStaffTable({ columns, agencyId, staff, dashboardType }: { 
    columns: any[], 
    agencyId: string, 
    staff: GenericStaff[], 
    dashboardType: 'raaha' | 'beauty',
}) {
    const [isClient, setIsClient] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<GenericStaff | undefined>(undefined);
    const { toast } = useToast();
    
    const { setData: setWorkers } = useWorkersData();
    const { setData: setSpecialists } = useBeautySpecialistsData();
    
    const setStaffData = dashboardType === 'raaha' ? setWorkers : setSpecialists;

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredStaff = staff.filter(s => s.agencyId === agencyId);
    
    const openDialog = (staffMember?: GenericStaff) => {
        setSelectedStaff(staffMember);
        setIsDialogOpen(true);
    };

    const handleSave = (values: Partial<GenericStaff>, id?: string) => {
        if (id) {
            setStaffData((prev: any[]) => prev.map(s => s.id === id ? { ...s, ...values } : s));
            toast({ title: `${dashboardType === 'raaha' ? 'Candidate' : 'Specialist'} updated.` });
        } else {
            const newStaffMember = { ...values, id: `staff_${Date.now()}`, agencyId };
            setStaffData((prev: any[]) => [...prev, newStaffMember]);
            toast({ title: `${dashboardType === 'raaha' ? 'Candidate' : 'Specialist'} added.` });
        }
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>Manage your team of specialists or candidates.</CardDescription>
                </div>
                 <AddEditStaffDialog 
                    isOpen={isDialogOpen} 
                    onOpenChange={setIsDialogOpen}
                    staffMember={selectedStaff}
                    onSave={handleSave} 
                    agencyId={agencyId}
                    dashboardType={dashboardType}
                >
                    <Button onClick={() => openDialog()}><PlusCircle className="mr-2 h-4 w-4"/> Add {dashboardType === 'raaha' ? 'Candidate' : 'Specialist'}</Button>
                </AddEditStaffDialog>
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
                        ) : filteredStaff.length === 0 ? (
                            <TableRow><TableCell colSpan={columns.length} className="text-center text-muted-foreground h-24">No staff added yet.</TableCell></TableRow>
                        ) : (
                            filteredStaff.map(staffMember => (
                                <TableRow key={staffMember.id} onClick={() => openDialog(staffMember)} className="cursor-pointer">
                                    {columns.map(col => (
                                        <TableCell key={col.accessor}>
                                            {col.Cell ? col.Cell({ row: { original: staffMember } }) : staffMember[col.accessor as keyof GenericStaff]}
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
