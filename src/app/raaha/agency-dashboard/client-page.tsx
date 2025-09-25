
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AgencySettings } from './agency-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { CandidateTable } from './candidate-table';
import { Badge } from '@/components/ui/badge';
import type { HireRequest } from '@/lib/raaha-requests.schema';
import type { Worker } from '@/lib/raaha-workers.schema';
import type { Agency as RaahaAgency } from '@/lib/raaha-agencies.schema';
import { useToast } from '@/hooks/use-toast';
import { useAgenciesData, useWorkersData, useRequestsData } from '@/hooks/use-data-hooks';
import { RequestTable, TimeAgoCell } from '@/components/request-table';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
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

const RequestTableWrapper = ({ initialRequests, agency, setRequests }: { 
    initialRequests: HireRequest[], 
    agency: RaahaAgency,
    setRequests: (updater: (prev: HireRequest[]) => HireRequest[]) => void
}) => {
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

export default function AgencyDashboardClientPage({ initialAgencies, initialWorkers, initialRequests }: { initialAgencies: RaahaAgency[], initialWorkers: Worker[], initialRequests: HireRequest[] }) {
    const { data: agencies, setData: setAgencies } = useAgenciesData(initialAgencies);
    const { data: workers } = useWorkersData(initialWorkers);
    const { data: requests, setData: setRequests } = useRequestsData(initialRequests);
    
    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    const [isClient, setIsClient] = useState(false);

     useEffect(() => {
        setIsClient(true);
        if (initialAgencies.length > 0) {
            setSelectedAgencyId(initialAgencies[0].id);
        }
    }, [initialAgencies]);

    const selectedAgency = agencies.find(a => a.id === selectedAgencyId);
    
    const candidateTableColumns = [
        { Header: 'Candidate', accessor: 'name', Cell: ({ row }: { row: { original: Worker } }) => (
            <div className="flex items-center gap-3">
                <Image src={row.original.photo} alt={row.original.name} width={40} height={40} className="rounded-full object-cover"/>
                <div>
                    <p className="font-medium">{row.original.name}</p>
                    <p className="text-sm text-muted-foreground">{row.original.nationality}</p>
                </div>
            </div>
        )},
        { Header: 'Age', accessor: 'age' },
        { Header: 'Skills', accessor: 'skills', Cell: ({ row }: { row: { original: Worker } }) => (
            <div className="flex flex-wrap gap-1">
                {row.original.skills.slice(0, 2).map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                {row.original.skills.length > 2 && <Badge variant="outline">+{row.original.skills.length - 2}</Badge>}
            </div>
        )},
        { Header: 'Availability', accessor: 'availability', Cell: ({ row }: { row: { original: Worker } }) => (
             <Badge variant={row.original.availability === 'Available' ? 'default' : 'outline'} className={row.original.availability === 'Available' ? 'bg-green-100 text-green-800' : ''}>
                {row.original.availability}
            </Badge>
        )},
    ];


    if (!isClient || !selectedAgency) {
         return (
            <div className="bg-background min-h-[calc(100vh-8rem)]">
                <div className="container mx-auto px-4 py-16">
                     <div className="max-w-7xl mx-auto space-y-8 text-center">
                         <h1 className="text-2xl font-bold">Loading Agency Data...</h1>
                         <Skeleton className="h-96 w-full" />
                     </div>
                </div>
            </div>
         );
    }
    
    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto space-y-8">
                     <div>
                        <h1 className="text-3xl font-bold">Agency Dashboard</h1>
                        <p className="text-muted-foreground">Manage your agency, staff, and client requests.</p>
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
                            <TabsTrigger value="requests">Hire Requests</TabsTrigger>
                            <TabsTrigger value="candidates">Candidates</TabsTrigger>
                            <TabsTrigger value="settings">Agency Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="requests" className="mt-6">
                            <RequestTableWrapper initialRequests={requests} setRequests={setRequests} agency={selectedAgency} />
                        </TabsContent>
                        <TabsContent value="candidates" className="mt-6">
                            <CandidateTable 
                                columns={candidateTableColumns} 
                                agencyId={selectedAgency.id} 
                                initialWorkers={workers} 
                            />
                        </TabsContent>
                        <TabsContent value="settings" className="mt-6">
                            {selectedAgency && <AgencySettings agency={selectedAgency} />}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
