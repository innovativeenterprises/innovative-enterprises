
'use client';

import { useWorkersData, WorkerTable } from './worker-table';

export default function AgencyDashboardPage() {
    const workerData = useWorkersData();
    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                   <WorkerTable {...workerData} />
                </div>
            </div>
        </div>
    )
}
