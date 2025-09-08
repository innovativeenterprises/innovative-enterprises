
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, PlusCircle, TrendingUp, TrendingDown, Percent, FileText } from 'lucide-react';
import Link from 'next/link';
import { type Student } from '@/lib/students';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { useStudentsData } from '@/hooks/use-global-store-data';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function StudentFinancialsPage() {
    const { students, isClient } = useStudentsData();

    const totalTuitionBilled = students.reduce((sum, s) => sum + (s.tuitionBilled || 0), 0);
    const totalScholarships = students.reduce((sum, s) => sum + (s.scholarshipAmount || 0), 0);
    const totalPaid = students.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
    const totalOutstanding = totalTuitionBilled - totalScholarships - totalPaid;

    const paymentStatusData = [
        { name: 'Paid', value: students.filter(s => (s.tuitionBilled || 0) - (s.scholarshipAmount || 0) - (s.amountPaid || 0) <= 0).length, fill: 'var(--color-paid)' },
        { name: 'Partial', value: students.filter(s => {
            const balance = (s.tuitionBilled || 0) - (s.scholarshipAmount || 0) - (s.amountPaid || 0);
            return balance > 0 && (s.amountPaid || 0) > 0;
        }).length, fill: 'var(--color-partial)' },
        { name: 'Unpaid', value: students.filter(s => {
             const balance = (s.tuitionBilled || 0) - (s.scholarshipAmount || 0) - (s.amountPaid || 0);
            return balance > 0 && (s.amountPaid || 0) === 0;
        }).length, fill: 'var(--color-unpaid)' },
    ];
     const chartConfig = {
        value: { label: "Students" },
        paid: { label: "Paid", color: "hsl(var(--chart-2))" },
        partial: { label: "Partial", color: "hsl(var(--chart-3))" },
        unpaid: { label: "Unpaid", color: "hsl(var(--chart-5))" },
    };


    const getStatusBadge = (student: Student) => {
        const balance = (student.tuitionBilled || 0) - (student.scholarshipAmount || 0) - (student.amountPaid || 0);
        if (balance <= 0) return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Paid</Badge>;
        if ((student.amountPaid || 0) > 0) return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Partial Payment</Badge>;
        return <Badge variant="destructive">Unpaid</Badge>;
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/education-tech/eduflow">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to EduFlow Suite
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <DollarSign className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Student Financials</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                A dashboard for managing student tuition, scholarships, and payments.
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center justify-between">Total Tuition Billed <TrendingUp className="h-4 w-4 text-muted-foreground"/></CardTitle></CardHeader><CardContent>{isClient ? <div className="text-2xl font-bold">OMR {totalTuitionBilled.toLocaleString()}</div> : <Skeleton className="h-8 w-3/4"/>}</CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center justify-between">Scholarships Awarded <Percent className="h-4 w-4 text-muted-foreground"/></CardTitle></CardHeader><CardContent>{isClient ? <div className="text-2xl font-bold">OMR {totalScholarships.toLocaleString()}</div>: <Skeleton className="h-8 w-3/4"/>}</CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center justify-between">Total Collected <TrendingUp className="h-4 w-4 text-muted-foreground"/></CardTitle></CardHeader><CardContent>{isClient ? <div className="text-2xl font-bold text-green-600">OMR {totalPaid.toLocaleString()}</div>: <Skeleton className="h-8 w-3/4"/>}</CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center justify-between">Total Outstanding <TrendingDown className="h-4 w-4 text-muted-foreground"/></CardTitle></CardHeader><CardContent>{isClient ? <div className="text-2xl font-bold text-destructive">OMR {totalOutstanding.toLocaleString()}</div>: <Skeleton className="h-8 w-3/4"/>}</CardContent></Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {isClient ? (
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                    <BarChart data={paymentStatusData} accessibilityLayer layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" layout="vertical" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                             ) : <Skeleton className="h-[250px] w-full" />}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Student Accounts</CardTitle>
                            <CardDescription>A list of all students and their current financial status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead className="text-right">Tuition Billed</TableHead>
                                        <TableHead className="text-right">Scholarship</TableHead>
                                        <TableHead className="text-right">Amount Paid</TableHead>
                                        <TableHead className="text-right">Outstanding Balance</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isClient ? students.map(student => {
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
                                                <TableCell className="text-right font-mono text-green-600">-{(student.scholarshipAmount || 0).toFixed(2)}</TableCell>
                                                <TableCell className="text-right font-mono text-green-600">-{(student.amountPaid || 0).toFixed(2)}</TableCell>
                                                <TableCell className={`text-right font-bold font-mono ${balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                                    {balance.toFixed(2)}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(student)}</TableCell>
                                                 <TableCell className="text-right">
                                                    <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4"/> View Statement</Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }) : (
                                        Array.from({length: 5}).map((_, i) => <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-12 w-full"/></TableCell></TableRow>)
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
