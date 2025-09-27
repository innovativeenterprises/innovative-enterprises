
'use client';

import { useState, useMemo, useEffect } from "react";
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Edit, Trash2, GraduationCap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Student } from '@/lib/students.schema';
import { AddEditStudentDialog, type StudentValues } from './student-form';
import { useStudentsData } from "@/hooks/use-data-hooks";

export const metadata: Metadata = {
  title: "Admin - Student Records",
  description: "A central database for managing all student profiles and academic records.",
};


export default function StudentRecordsPage() {
    const { data: students, setData: setStudents, isClient } = useStudentsData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
    const { toast } = useToast();

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'On Track': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">On Track</Badge>;
            case 'Needs Attention': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Needs Attention</Badge>;
            case 'At Risk': return <Badge variant="destructive">At Risk</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleOpenDialog = (student?: Student) => {
        setSelectedStudent(student);
        setIsDialogOpen(true);
    };

    const handleSave = (values: StudentValues, id?: string) => {
        if (id) {
            setStudents(prev => prev.map(s => s.id === id ? { ...s, ...values } as Student : s));
            toast({ title: 'Student record updated.' });
        } else {
            const newStudent: Student = { ...values, id: `STU${Date.now()}` };
            setStudents(prev => [newStudent, ...prev]);
            toast({ title: 'Student record added.' });
        }
    };

    const handleDelete = (id: string) => {
        setStudents(prev => prev.filter(s => s.id !== id));
        toast({ title: 'Student record removed.', variant: 'destructive' });
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/education-tech/eduflow">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to EduFlow Suite
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <GraduationCap className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Student Records</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                A central database for managing all student profiles and academic records.
                            </p>
                        </div>
                    </div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>All Students</CardTitle>
                                <CardDescription>A comprehensive list of all students enrolled.</CardDescription>
                            </div>
                             <Button onClick={() => handleOpenDialog()}>
                                <PlusCircle className="mr-2 h-4 w-4"/> Add Student
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <AddEditStudentDialog 
                                isOpen={isDialogOpen} 
                                onOpenChange={setIsDialogOpen}
                                student={selectedStudent} 
                                onSave={handleSave}
                            />
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Major</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {!isClient ? (
                                        <TableRow><TableCell colSpan={5} className="text-center h-24"><Skeleton className="h-10 w-full" /></TableCell></TableRow>
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
                                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(student)}><Edit className="h-4 w-4"/></Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button></AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Delete Record?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the record for {student.name}.</AlertDialogDescription></AlertDialogHeader>
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
