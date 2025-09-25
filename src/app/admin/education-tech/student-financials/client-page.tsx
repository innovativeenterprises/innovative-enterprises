
'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, DollarSign, FileText, Calendar, Trash2, Home, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Student } from '@/lib/students.schema';
import { AddEditStudentFinancialsDialog, type StudentFinancialsValues } from "./financials-form";

export default function StudentFinancialsClientPage({ initialStudents }: { initialStudents: Student[] }) {
    const [students, setStudents] = useState(initialStudents);
    const [isClient, setIsClient] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
    const { toast } = useToast();
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const { totalBilled, totalScholarships, totalPaid, totalOutstanding } = useMemo(() => {
        if (!isClient) return { totalBilled: 0, totalScholarships: 0, totalPaid: 0, totalOutstanding: 0 };
        return students.reduce((acc, student) => {
            acc.totalBilled += student.tuitionBilled || 0;
            acc.totalScholarships += student.scholarshipAmount || 0;
            acc.totalPaid += student.amountPaid || 0;
            acc.totalOutstanding += (student.tuitionBilled || 0) - (student.scholarshipAmount || 0) - (student.amountPaid || 0);
            return acc;
        }, { totalBilled: 0, totalScholarships: 0, totalPaid: 0, totalOutstanding: 0 });
    }, [students, isClient]);

    const handleOpenDialog = (student: Student) => {
        setSelectedStudent(student);
        setIsDialogOpen(true);
    }
    
    const handleSave = (values: StudentFinancialsValues, id: string) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, ...values } : s));
        toast({ title: 'Student financials updated.' });
    };

    return (
         <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/admin/education-tech/eduflow">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to EduFlow Suite
                            </Link>
                        </Button>
                        <div className="text-center mb-12">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <DollarSign className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Student Financials Dashboard</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Manage student tuition fees, scholarships, and payment statuses.
                            </p>
                        </div>
                    </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                         <Card><CardHeader><CardTitle>Total Billed</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-primary">{!isClient ? <Skeleton className="h-8 w-3/4" /> : `OMR ${totalBilled.toLocaleString()}`}</CardContent></Card>
                         <Card><CardHeader><CardTitle>Scholarships Awarded</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-green-600">{!isClient ? <Skeleton className="h-8 w-3/4" /> : `OMR ${totalScholarships.toLocaleString()}`}</CardContent></Card>
                         <Card><CardHeader><CardTitle>Total Paid</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-primary">{!isClient ? <Skeleton className="h-8 w-3/4" /> : `OMR ${totalPaid.toLocaleString()}`}</CardContent></Card>
                         <Card><CardHeader><CardTitle>Total Outstanding</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-destructive">{!isClient ? <Skeleton className="h-8 w-3/4" /> : `OMR ${totalOutstanding.toLocaleString()}`}</CardContent></Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Student Financial Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <AddEditStudentFinancialsDialog
                                isOpen={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                                student={selectedStudent}
                                onSave={handleSave}
                            >
                                <div/>
                            </AddEditStudentFinancialsDialog>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead className="text-right">Tuition Billed (OMR)</TableHead>
                                        <TableHead className="text-right">Scholarship (OMR)</TableHead>
                                        <TableHead className="text-right">Amount Paid (OMR)</TableHead>
                                        <TableHead className="text-right">Balance Due (OMR)</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!isClient ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24">
                                                <Skeleton className="h-10 w-full" />
                                            </TableCell>
                                        </TableRow>
                                    ) : students.map(student => {
                                        const balance = (student.tuitionBilled || 0) - (student.scholarshipAmount || 0) - (student.amountPaid || 0);
                                        return (
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
                                                <TableCell className="text-right font-mono">{(student.tuitionBilled || 0).toFixed(2)}</TableCell>
                                                <TableCell className="text-right font-mono text-green-600">{(student.scholarshipAmount || 0).toFixed(2)}</TableCell>
                                                <TableCell className="text-right font-mono">{(student.amountPaid || 0).toFixed(2)}</TableCell>
                                                <TableCell className={`text-right font-mono font-semibold ${balance > 0 ? 'text-destructive' : 'text-primary'}`}>{balance.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(student)}>Manage</Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
