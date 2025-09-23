
'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import type { HireRequest } from "@/lib/raaha-requests.schema";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MessageSquare } from 'lucide-react';
import { ScheduleInterviewDialog, type InterviewValues, type GenericRequest } from '@/components/schedule-interview-dialog';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeAgoCell } from '@/components/request-table';
import type { Agency as RaahaAgency } from "@/lib/raaha-agencies.schema";

const getStatusBadge = (status: HireRequest['status']) => {
    switch (status) {
        case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
        case 'Contacted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Contacted</Badge>;
        case 'Interviewing': return <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 hover:bg-purple-500/30">Interviewing</Badge>;
        case 'Hired': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Hired</Badge>;
        case 'Closed': return <Badge variant="destructive">Closed</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export function RequestTable({ initialRequests, agency, setRequests }: { 
    initialRequests: HireRequest[], 
    agency: RaahaAgency,
    setRequests: (updater: (prev: HireRequest[]) => HireRequest[]) => void
}) {
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const filteredRequests = useMemo(() => {
        if (!agency) return initialRequests;
        return initialRequests.filter(r => r.agencyId === agency.name);
    }, [initialRequests, agency]);

    const onSchedule = (id: string, values: InterviewValues) => {
        setRequests(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'Interviewing', interviewDate: values.interviewDate.toISOString(), interviewNotes: values.interviewNotes } : r
        ));
        toast({ title: "Interview Scheduled!", description: `The interview has been scheduled.` });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Incoming Hire Requests</CardTitle>
                <CardDescription>A list of all new and ongoing requests from clients.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            <TableRow>
                                <TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell>
                            </TableRow>
                        ) : filteredRequests.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">No hire requests found for this agency.</TableCell>
                            </TableRow>
                        ) : (
                            filteredRequests.map(request => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    <div className="font-medium">{request.clientName}</div>
                                    <div className="text-sm text-muted-foreground">{request.clientContact}</div>
                                </TableCell>
                                <TableCell>
                                     <div className="font-medium">{request.workerName}</div>
                                     <div className="text-sm text-muted-foreground">
                                        <TimeAgoCell date={request.requestDate} isClient={isClient} />
                                     </div>
                                </TableCell>
                                <TableCell>{getStatusBadge(request.status)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm"><MessageSquare className="mr-2 h-4 w-4"/> Contact</Button>
                                        <ScheduleInterviewDialog request={request as GenericRequest} onSchedule={onSchedule} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
