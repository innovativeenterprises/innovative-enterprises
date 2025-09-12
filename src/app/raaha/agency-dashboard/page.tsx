
'use client';

import { useState, useEffect, useMemo } from 'react';
import { WorkerTable } from '@/components/request-table'; // Use the generic table
import { AgencySettings } from './agency-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useAgenciesData, useWorkersData, useRequestsData } from '@/hooks/use-global-store-data';
import { RequestTable } from '@/components/request-table';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { HireRequest } from '@/lib/raaha-requests';
import type { Worker } from '@/lib/raaha-workers';
import { ScheduleInterviewDialog, type InterviewValues } from '@/components/schedule-interview-dialog';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, MessageSquare, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddEditWorkerDialog } from './worker-table';


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

const requestsColumns = [
    {
        Header: 'Candidate',
        accessor: 'workerName',
    },
    {
        Header: 'Client',
        accessor: 'clientName',
    },
     {
        Header: 'Request Date',
        accessor: 'requestDate',
        Cell: ({ row }: { row: { original: HireRequest }}) => formatDistanceToNow(new Date(row.original.requestDate), { addSuffix: true })
    },
    {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }: { row: { original: HireRequest }}) => getStatusBadge(row.original.status)
    },
     {
        Header: 'Interview',
        accessor: 'interviewDate',
        Cell: ({ row }: { row: { original: HireRequest }}) => row.original.interviewDate ? (
            <div className="text-xs text-muted-foreground space-y-1">
               <div className="flex items-center gap-1.5 font-semibold">
                <CalendarIcon className="h-3 w-3 text-primary" />
                <span>{format(new Date(row.original.interviewDate), "PPP 'at' p")}</span>
               </div>
                {row.original.interviewNotes && (
                    <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" />
                    <span className="truncate">{row.original.interviewNotes}</span>
                    </div>
                )}
            </div>
        ) : null
    },
];

const getAvailabilityBadge = (availability: Worker['availability']) => {
    return (
        <Badge variant={availability === 'Available' ? 'default' : 'outline'} className={availability === 'Available' ? 'bg-green-500/20 text-green-700' : ''}>
            {availability}
        </Badge>
    );
};

const workersColumns = [
    {
        Header: 'Candidate',
        accessor: 'name',
        Cell: ({ row }: { row: { original: Worker }}) => (
            <div className="flex items-center gap-3">
                <Image src={row.original.photo} alt={row.original.name} width={40} height={40} className="rounded-full object-cover"/>
                <div>
                    <p className="font-medium">{row.original.name}</p>
                    <p className="text-sm text-muted-foreground">{row.original.age} years old</p>
                </div>
            </div>
        )
    },
    {
        Header: 'Nationality',
        accessor: 'nationality',
    },
    {
        Header: 'Skills',
        accessor: 'skills',
        Cell: ({ row }: { row: { original: Worker }}) => (
             <div className="flex flex-wrap gap-1 max-w-xs">
                {row.original.skills.slice(0, 3).map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                {row.original.skills.length > 3 && <Badge variant="outline">+{row.original.skills.length - 3}</Badge>}
            </div>
        )
    },
    {
        Header: 'Availability',
        accessor: 'availability',
        Cell: ({ row }: { row: { original: Worker }}) => getAvailabilityBadge(row.original.availability)
    },
]

export default function AgencyDashboardPage() {
    const { workers, setWorkers } = useWorkersData();
    const { requests, setRequests } = useRequestsData();
    const { agencies, setAgencies, isClient } = useAgenciesData();
    const { toast } = useToast();

    const [selectedAgencyId, setSelectedAgencyId] = useState('');

    useEffect(() => {
        if (isClient && agencies.length > 0 && !selectedAgencyId) {
            setSelectedAgencyId(agencies[0].id);
        }
    }, [agencies, isClient, selectedAgencyId]);

    const selectedAgency = agencies.find(a => a.id === selectedAgencyId);
    
    if (!isClient) {
        return (
            <div className="bg-background min-h-[calc(100vh-8rem)]">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div>
                            <Skeleton className="h-10 w-1/3" />
                            <Skeleton className="h-5 w-1/2 mt-2" />
                        </div>
                        <Card className="p-4 bg-muted/50">
                             <div className="flex items-center gap-4">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-10 w-[280px]" />
                             </div>
                        </Card>
                         <div className="space-y-4">
                             <Skeleton className="h-10 w-full" />
                             <Skeleton className="h-64 w-full" />
                         </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!selectedAgency) {
         return (
            <div className="bg-background min-h-[calc(100vh-8rem)]">
                <div className="container mx-auto px-4 py-16">
                     <div className="max-w-7xl mx-auto space-y-8 text-center">
                         <h1 className="text-2xl font-bold">No Agencies Found</h1>
                         <p className="text-muted-foreground">Please configure at least one agency in the system.</p>
                     </div>
                </div>
            </div>
         );
    }
    
    const filteredWorkers = workers.filter(w => w.agencyId === selectedAgency?.name);
    const filteredRequests = requests.filter(r => r.agencyId === selectedAgency?.name);
    
     const onSchedule = (id: string, values: InterviewValues) => {
        setRequests(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'Interviewing', interviewDate: values.interviewDate.toISOString(), interviewNotes: values.interviewNotes } : r
        ));
        toast({ title: "Interview Scheduled!", description: `The interview has been scheduled.` });
    };

    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto space-y-8">
                     <div>
                        <h1 className="text-3xl font-bold">RAAHA Agency Dashboard</h1>
                        <p className="text-muted-foreground">Manage your candidates and client requests.</p>
                    </div>

                    <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-4">
                            <label htmlFor="agency-select" className="font-medium text-sm">Viewing Dashboard For:</label>
                             <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
                                <SelectTrigger className="w-[280px]" id="agency-select">
                                     <SelectValue>
                                        <div className="flex items-center gap-2">
                                            {selectedAgency?.logo && <Image src={selectedAgency.logo} alt={selectedAgency.name} width={20} height={20} className="rounded-sm object-contain" />}
                                            <span>{selectedAgency?.name}</span>
                                        </div>
                                     </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {agencies.map(agency => (
                                        <SelectItem key={agency.id} value={agency.id}>
                                             <div className="flex items-center gap-2">
                                                {agency.logo && <Image src={agency.logo} alt={agency.name} width={20} height={20} className="rounded-sm object-contain" />}
                                                <span>{agency.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                     <Tabs defaultValue="requests" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="requests">Client Requests ({filteredRequests.length})</TabsTrigger>
                            <TabsTrigger value="workers">My Candidates ({filteredWorkers.length})</TabsTrigger>
                            <TabsTrigger value="settings">Agency Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="requests" className="mt-6">
                            <RequestTable 
                                data={filteredRequests} 
                                columns={requestsColumns}
                                isClient={isClient}
                                renderActions={(request) => <ScheduleInterviewDialog request={request} onSchedule={onSchedule} />}
                            />
                        </TabsContent>
                        <TabsContent value="workers" className="mt-6">
                            <WorkerTable workers={filteredWorkers} setWorkers={setWorkers} agencyId={selectedAgency.id} isClient={isClient} />
                        </TabsContent>
                        <TabsContent value="settings" className="mt-6">
                            {selectedAgency && <AgencySettings agency={selectedAgency} setAgencies={setAgencies} />}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
