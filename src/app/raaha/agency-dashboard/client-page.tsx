
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
import { RequestTable } from './request-table';
import { useAgenciesData, useWorkersData, useRequestsData } from '@/hooks/use-data-hooks';

export default function AgencyDashboardClientPage({ initialAgencies, initialWorkers, initialRequests }: { initialAgencies: RaahaAgency[], initialWorkers: Worker[], initialRequests: HireRequest[] }) {
    const { data: agencies, setData: setAgencies, isClient: isAgenciesClient } = useAgenciesData(initialAgencies);
    const { data: workers, setData: setWorkers, isClient: isWorkersClient } = useWorkersData(initialWorkers);
    const { data: requests, setData: setRequests, isClient: isRequestsClient } = useRequestsData(initialRequests);
    
    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    const isClient = isAgenciesClient && isWorkersClient && isRequestsClient;

     useEffect(() => {
        if (agencies.length > 0 && !selectedAgencyId) {
            setSelectedAgencyId(agencies[0].id);
        }
    }, [agencies, selectedAgencyId]);

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
                            <RequestTable initialRequests={requests} agency={selectedAgency} />
                        </TabsContent>
                        <TabsContent value="candidates" className="mt-6">
                            <CandidateTable columns={candidateTableColumns} agencyId={selectedAgency.id} initialWorkers={workers} />
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
