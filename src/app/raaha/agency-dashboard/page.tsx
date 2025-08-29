
'use client';

import { useWorkersData, WorkerTable } from './worker-table';
import { useRequestsData, RequestTable } from './request-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AgencyDashboardPage() {
    const workerData = useWorkersData();
    const requestData = useRequestsData();
    
    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto space-y-8">
                     <div>
                        <h1 className="text-3xl font-bold">RAAHA Agency Dashboard</h1>
                        <p className="text-muted-foreground">Manage your candidates and client requests.</p>
                    </div>
                     <Tabs defaultValue="requests">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="requests">Client Requests ({requestData.requests.length})</TabsTrigger>
                            <TabsTrigger value="workers">My Candidates ({workerData.workers.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="requests" className="mt-6">
                            <RequestTable {...requestData} />
                        </TabsContent>
                        <TabsContent value="workers" className="mt-6">
                            <WorkerTable {...workerData} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
