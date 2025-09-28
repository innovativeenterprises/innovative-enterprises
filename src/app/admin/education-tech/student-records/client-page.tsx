
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
import type { Student } from "@/lib/students.schema";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentsData } from "@/hooks/use-data-hooks";

const StudentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  major: z.string().min(2, "Major is required"),
  year: z.coerce.number().int().min(1).max(8),
  status: z.enum(['On Track', 'Needs Attention', 'At Risk']),
  photo: z.string().url("A valid photo URL is required"),
});
type StudentValues = z.infer<typeof StudentSchema>;

const AddEditStudentDialog = ({ 
    student, 
    onSave, 
    children,
    isOpen,
    onOpenChange,
}: { 
    student?: Student, 
    onSave: (v: StudentValues, id?: string) => void, 
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const form = useForm<StudentValues>({
        resolver: zodResolver(StudentSchema),
    });
    
    useEffect(() => {
        if(isOpen) {
            form.reset(student || { name: '', major: '', year: 1, status: 'On Track', photo: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}` });
        }
    }, [student, form, isOpen]);

    const onSubmit: SubmitHandler<StudentValues> = (data) => {
        onSave(data, student?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader><DialogTitle>{student ? "Edit" : "Add"} Student</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Student Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="major" render={({ field }) => (
                                <FormItem><FormLabel>Major</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="year" render={({ field }) => (
                                <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="On Track">On Track</SelectItem>
                                <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                                <SelectItem value="At Risk">At Risk</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
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

export default function StudentRecordsClientPage() {
    const { data: students, setData: setStudents, isClient } = useStudentsData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);

    const openDialog = (student?: Student) => {
        setSelectedStudent(student);
        setIsDialogOpen(true);
    };

    const handleSave = (values: StudentValues, id?: string) => {
        if (id) {
            setStudents(prev => prev.map(s => s.id === id ? { ...s, ...values } : s));
            toast({ title: "Student record updated." });
        } else {
            const newStudent: Student = { ...values, id: `stu_${Date.now()}` };
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
            case 'On Track': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">On Track</Badge>;
            case 'Needs Attention': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Needs Attention</Badge>;
            case 'At Risk': return <Badge variant="destructive">At Risk</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Student Records</CardTitle>
                    <CardDescription>A central database for managing all student profiles and academic records.</CardDescription>
                </div>
                 <Button onClick={() => openDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Student
                 </Button>
            </CardHeader>
            <CardContent>
                <AddEditStudentDialog 
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    student={selectedStudent} 
                    onSave={handleSave}
                >
                   <div />
                </AddEditStudentDialog>
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
                                            <Button variant="ghost" size="icon" onClick={() => openDialog(student)}><Edit className="h-4 w-4"/></Button>
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
    );
}
