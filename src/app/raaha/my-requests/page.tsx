
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useRequestsData } from '@/hooks/use-global-store-data';
import type { HireRequest } from '@/lib/raaha-requests';
import { RequestTable } from '@/components/request-table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { TimeAgoCell } from '@/components/request-table';
import { ScheduleInterviewDialog, type InterviewValues, type GenericRequest } from '@/components/schedule-interview-dialog';

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

export default function MyRequestsPage() {
    const { requests, setRaahaRequests, isClient } = useRequestsData();
    const { toast } = useToast();
    
    // In a real app, you would filter requests by the logged-in user.
    // For this prototype, we'll assume we're viewing requests for one client.
    const myRequests = isClient ? requests.filter(r => r.clientName === 'Ahmed Al-Farsi') : [];
    
    const onSchedule = (id: string, values: InterviewValues) => {
        setRaahaRequests(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'Interviewing', interviewDate: values.interviewDate.toISOString(), interviewNotes: values.interviewNotes } : r
        ));
        toast({ title: "Interview Scheduled!", description: `The interview has been scheduled.` });
    };
    
    const columns = [
        {
            Header: 'Candidate',
            accessor: 'workerName',
            Cell: ({ row }: { row: { original: HireRequest }}) => (
                <div>
                    <p className="font-medium">{row.original.workerName}</p>
                    <div className="text-sm text-muted-foreground">
                        <TimeAgoCell date={row.original.requestDate} isClient={isClient} />
                    </div>
                </div>
            )
        },
        {
            Header: 'Agency',
            accessor: 'agencyId',
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }: { row: { original: HireRequest }}) => getStatusBadge(row.original.status)
        },
    ];

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/raaha">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to RAAHA Platform
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <UserCheck className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">My Hire Requests</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Track the status of your applications for domestic helpers.
                            </p>
                        </div>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Active & Past Requests</CardTitle>
                            <CardDescription>The table below shows the real-time status of each request as updated by the agency.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <RequestTable 
                                data={myRequests} 
                                columns={columns}
                                isClient={isClient}
                                renderActions={(request) => <ScheduleInterviewDialog request={request as GenericRequest} onSchedule={onSchedule} />}
                            />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
