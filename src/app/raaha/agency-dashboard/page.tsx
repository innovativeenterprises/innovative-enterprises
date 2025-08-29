
'use client';

import { useState } from 'react';
import { useWorkersData, WorkerTable } from './worker-table';
import { useRequestsData, RequestTable } from './request-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader } from '@/components/ui/card';

const agencies = ["Happy Homes Agency", "Premier Maids"];

export default function AgencyDashboardPage() {
    const { workers, setWorkers } = useWorkersData();
    const { requests, setRequests } = useRequestsData();
    const [selectedAgency, setSelectedAgency] = useState(agencies[0]);

    const filteredWorkers = workers.filter(w => w.agencyId === selectedAgency);
    const filteredRequests = requests.filter(r => r.agencyId === selectedAgency);
    
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
                             <Select value={selectedAgency} onValueChange={setSelectedAgency}>
                                <SelectTrigger className="w-[280px]" id="agency-select">
                                    <SelectValue placeholder="Select an agency..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {agencies.map(agency => (
                                        <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                     <Tabs defaultValue="requests">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="requests">Client Requests ({filteredRequests.length})</TabsTrigger>
                            <TabsTrigger value="workers">My Candidates ({filteredWorkers.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="requests" className="mt-6">
                            <RequestTable requests={filteredRequests} setRequests={setRequests} />
                        </TabsContent>
                        <TabsContent value="workers" className="mt-6">
                            <WorkerTable workers={filteredWorkers} setWorkers={setWorkers} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
