
'use client';

import { useState, useEffect } from 'react';
import { useWorkersData, WorkerTable } from './worker-table';
import { useRequestsData, RequestTable } from './request-table';
import { useAgenciesData, AgencySettings } from './agency-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function AgencyDashboardPage() {
    const { workers, setWorkers } = useWorkersData();
    const { requests, setRequests } = useRequestsData();
    const { agencies, setAgencies } = useAgenciesData();
    const [isClient, setIsClient] = useState(false);

    const [selectedAgencyId, setSelectedAgencyId] = useState(agencies[0]?.id);

    useEffect(() => {
        setIsClient(true);
        if (!selectedAgencyId && agencies.length > 0) {
            setSelectedAgencyId(agencies[0].id);
        }
    }, [agencies, selectedAgencyId]);

    const selectedAgency = agencies.find(a => a.id === selectedAgencyId);
    const filteredWorkers = workers.filter(w => w.agencyId === selectedAgency?.name);
    const filteredRequests = requests.filter(r => r.agencyId === selectedAgency?.name);
    
    if (!isClient) {
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
                            <RequestTable requests={filteredRequests} setRequests={setRequests} />
                        </TabsContent>
                        <TabsContent value="workers" className="mt-6">
                            <WorkerTable workers={filteredWorkers} setWorkers={setWorkers} agencyId={selectedAgency.id} />
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
