
'use client';

import { AgencyStaffTable } from '@/components/agency-dashboard/agency-staff-table';
import type { BeautySpecialist } from "@/lib/beauty-specialists.schema";
import { useBeautySpecialistsData } from '@/hooks/use-data-hooks';
import Image from "next/image";


export function SpecialistTable({ agencyId }: { agencyId: string }) {
    const { data: specialists, setData: setSpecialists } = useBeautySpecialistsData();

    const specialistTableColumns = [
         { Header: 'Specialist', accessor: 'name', Cell: ({ row }: { row: { original: BeautySpecialist } }) => (
            <div className="flex items-center gap-3">
                <Image src={row.original.photo} alt={row.original.name} width={40} height={40} className="rounded-full object-cover" />
                <p className="font-medium">{row.original.name}</p>
            </div>
        )},
        { Header: 'Specialty', accessor: 'specialty' },
    ];
    
    return (
        <AgencyStaffTable 
            columns={specialistTableColumns}
            agencyId={agencyId} 
            staff={specialists}
            setStaff={setSpecialists as any}
            dashboardType="beauty"
        />
    );
}

