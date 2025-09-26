
'use client';

import { AgencyStaffTable } from '@/components/agency-dashboard/agency-staff-table';
import type { Worker } from "@/lib/raaha-workers.schema";
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import { useWorkersData } from '@/hooks/use-data-hooks';

export function CandidateTable({ agencyId }: { agencyId: string }) {
    const { data: workers, setData: setWorkers } = useWorkersData();
    
    const workerTableColumns = [
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

    return (
        <AgencyStaffTable 
            columns={workerTableColumns}
            agencyId={agencyId}
            staff={workers}
            setStaff={setWorkers as any}
            dashboardType="raaha"
        />
    );
}

