
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Student } from "@/lib/students";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, ArrowLeft, Users } from "lucide-react";
import Link from 'next/link';
import { useStudentsData } from '@/hooks/use-global-store-data';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Record Management | EduFlow Suite",
  description: "A central database for managing all student profiles and academic records.",
};


const StudentSchema = z.object({
  id: z.string().min(3, "Student ID is required"),
  name: z.string().min(2, "Name is required"),
  major: z.string().min(2, "Major is required"),
  year: z.coerce.number().min(1, "Year must be at least 1"),
  status: z.enum(['On Track', 'Needs Attention', 'At Risk']),
  photo: z.string().url("A valid photo URL is required"),
});
type StudentValues = z.infer<typeof StudentSchema>;

const AddEditStudentDialog = ({ student, onSave, children }: { student?: Student, onSave: (v: StudentValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<StudentValues>({
        resolver: zodResolver(StudentSchema),
        defaultValues: student || { status: 'On Track', photo: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop' },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset(student || { id: '', name: '', major: '', year: 1, status: 'On Track', photo: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop' });
        }
    }, [student, form, isOpen]);

    const onSubmit: SubmitHandler<StudentValues> = (data) => {
        onSave(data, student?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader><DialogTitle>{student ? "Edit" : "Add"} Student Record</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Student Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="id" render={({ field }) => (
                                <FormItem><FormLabel>Student ID</FormLabel><FormControl><Input {...field} disabled={!!student} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="major" render={({ field }) => (
                                <FormItem><FormLabel>Major</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="year" render={({ field }) => (
                                <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="On Track">On Track</SelectItem>
                                    <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                                    <SelectItem value="At Risk">At Risk</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="photo" render={({ field }) => (
                            <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Record</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function StudentRecordsPage() {
    const { students, setStudents, isClient } = useStudentsData();
    const { toast } = useToast();

    const handleSave = (values: StudentValues, id?: string) => {
        if (id) {
            setStudents(prev => prev.map(s => s.id === id ? { ...s, ...values } : s));
            toast({ title: "Student record updated." });
        } else {
            const newStudent: Student = { ...values, tuitionBilled: 0, scholarshipAmount: 0, amountPaid: 0 };
            setStudents(prev => [newStudent, ...prev]);
            toast({ title: "Student record added." });
        }
    };

    const handleDelete = (id: string) => {
        setStudents(prev => prev.filter(s => s.id !== id));
        toast({ title: "Student record removed.", variant: "destructive" });
    };

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case "On Track": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">On Track</Badge>;
            case "Needs Attention": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Needs Attention</Badge>;
            case "At Risk": return <Badge variant="destructive">At Risk</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/education-tech/eduflow">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to EduFlow Suite
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Users className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Student Record Management</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                               A central database for managing all student profiles and academic records.
                            </p>
                        </div>
                    </div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div>
                                <CardTitle>Student Registry</CardTitle>
                                <CardDescription>A list of all enrolled students.</CardDescription>
                            </div>
                            <AddEditStudentDialog onSave={handleSave}>
                                <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Student</Button>
                            </AddEditStudentDialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Major</TableHead><TableHead>Year</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {!isClient ? (
                                        <TableRow><TableCell colSpan={5} className="text-center h-24"><Skeleton className="h-10 w-full"/></TableCell></TableRow>
                                    ) : (
                                        students.map(student => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar><AvatarImage src={student.photo} alt={student.name} /><AvatarFallback>{student.name.charAt(0)}</AvatarFallback></Avatar>
                                                        <div>
                                                            <p className="font-medium">{student.name}</p>
                                                            <p className="text-sm text-muted-foreground">{student.id}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{student.major}</TableCell>
                                                <TableCell>{student.year}</TableCell>
                                                <TableCell>{getStatusBadge(student.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <AddEditStudentDialog student={student} onSave={handleSave}><Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button></AddEditStudentDialog>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button></AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Delete Student?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the record for {student.name}.</AlertDialogDescription></AlertDialogHeader>
                                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(student.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
                </div>
            </div>
        </div>
    );
}
