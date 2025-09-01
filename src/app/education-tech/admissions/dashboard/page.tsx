
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCheck, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Placeholder data - in a real app, this would come from a database.
const initialApplications = [
    { id: 'APP-12345678', name: 'Nasser Al-Busaidi', program: 'B.Sc. in Artificial Intelligence', readinessScore: 92, status: 'Interview' },
    { id: 'APP-87654321', name: 'Fatima Al-Hinai', program: 'M.Sc. in Data Science', readinessScore: 85, status: 'Conditional Offer' },
    { id: 'APP-23456789', name: 'John Smith', program: 'B.Eng. in Robotics', readinessScore: 78, status: 'Interview' },
    { id: 'APP-98765432', name: 'Aisha Al-Riyami', program: 'B.Sc. in Artificial Intelligence', readinessScore: 65, status: 'Further Review' },
    { id: 'APP-34567890', name: 'Mohammed Al-Farsi', program: 'Ph.D. in Machine Learning', readinessScore: 45, status: 'Reject' },
];

type Application = typeof initialApplications[0];
type SortKey = keyof Application | '';

export default function AdmissionsDashboardPage() {
    const [applications, setApplications] = useState(initialApplications);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'readinessScore', direction: 'descending' });

    const filteredAndSortedApplications = useMemo(() => {
        let sortableItems = [...applications];
        if (searchTerm) {
            sortableItems = sortableItems.filter(app =>
                app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.program.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [applications, searchTerm, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Interview': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Interview</Badge>;
            case 'Conditional Offer': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Conditional Offer</Badge>;
            case 'Further Review': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Further Review</Badge>;
            case 'Reject': return <Badge variant="destructive">Reject</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const SortableHeader = ({ label, sortKey }: { label: string, sortKey: SortKey }) => (
         <TableHead onClick={() => requestSort(sortKey)} className="cursor-pointer">
            <div className="flex items-center gap-2">
                {label}
                {sortConfig.key === sortKey && <ArrowUpDown className="h-4 w-4" />}
            </div>
        </TableHead>
    );

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/education-tech/admissions">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Application Form
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <UserCheck className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Admissions Dashboard</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                An overview of all submitted student applications.
                            </p>
                        </div>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Submitted Applications</CardTitle>
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-2">
                                <CardDescription>A list of recent applications for review.</CardDescription>
                                <div className="flex w-full md:w-auto gap-2">
                                     <div className="relative flex-grow">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Filter by name or program..."
                                            className="pl-8 w-full"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" size="icon" disabled><SlidersHorizontal className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <SortableHeader label="Applicant" sortKey="name" />
                                        <SortableHeader label="Program" sortKey="program" />
                                        <SortableHeader label="Readiness Score" sortKey="readinessScore" />
                                        <SortableHeader label="AI Recommended Step" sortKey="status" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedApplications.map(app => (
                                        <TableRow key={app.id}>
                                            <TableCell>
                                                <div className="font-medium">{app.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{app.id}</div>
                                            </TableCell>
                                            <TableCell>{app.program}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={app.readinessScore} className="w-24 h-2" />
                                                    <span className="font-mono text-sm">{app.readinessScore}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
