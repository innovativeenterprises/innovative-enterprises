
'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import type { HireRequest } from "@/lib/raaha-requests.schema";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MessageSquare } from 'lucide-react';
import { ScheduleInterviewDialog, type InterviewValues, type GenericRequest } from '@/components/schedule-interview-dialog';
import { useToast } from "@/hooks/use-toast";
import { TimeAgoCell } from '@/components/request-table';
import type { Agency as RaahaAgency } from "@/lib/raaha-agencies.schema";
import { RequestTable } from '@/components/request-table';

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

export function RequestTableWrapper({ initialRequests, agency, setRequests }: { 
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

    const columns = [
        {
            Header: 'Client',
            accessor: 'clientName',
            Cell: ({ row }: { row: { original: HireRequest }}) => (
                <div>
                    <div className="font-medium">{row.original.clientName}</div>
                    <div className="text-sm text-muted-foreground">{row.original.clientContact}</div>
                </div>
            )
        },
        {
            Header: 'Candidate',
            accessor: 'workerName',
            Cell: ({ row }: { row: { original: HireRequest }}) => (
                <div>
                    <div className="font-medium">{row.original.workerName}</div>
                    <div className="text-sm text-muted-foreground">
                        <TimeAgoCell date={row.original.requestDate} isClient={isClient} />
                    </div>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }: { row: { original: HireRequest }}) => getStatusBadge(row.original.status)
        },
    ];

    const renderActions = (request: HireRequest) => (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm"><MessageSquare className="mr-2 h-4 w-4"/> Contact</Button>
            <ScheduleInterviewDialog request={request as GenericRequest} onSchedule={onSchedule} />
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Incoming Hire Requests</CardTitle>
                <CardDescription>A list of all new and ongoing requests from clients.</CardDescription>
            </CardHeader>
            <CardContent>
                <RequestTable 
                    data={filteredRequests}
                    columns={columns}
                    isClient={isClient}
                    renderActions={(request) => renderActions(request as HireRequest)}
                />
            </CardContent>
        </Card>
    )
}

// Renaming the default export to avoid confusion with the new wrapper component
export { RequestTableWrapper as RequestTable };
