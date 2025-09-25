
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AgencySettings } from './agency-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { SpecialistTable } from './specialist-table';
import { Badge } from '@/components/ui/badge';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { BeautyService } from '@/lib/beauty-services.schema';
import type { BeautyCenter } from '@/lib/beauty-centers.schema';
import type { BeautySpecialist } from '@/lib/beauty-specialists.schema';
import { useToast } from '@/hooks/use-toast';
import { useBeautyCentersData, useBeautyServicesData, useBeautyAppointmentsData, useBeautySpecialistsData } from '@/hooks/use-data-hooks';
import { ServiceTable } from './service-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { initialBeautyAppointments, initialBeautyCenters, initialBeautyServices, initialBeautySpecialists } from '@/lib/firestore-mock';


const getStatusBadge = (status: BeautyAppointment['status']) => {
    switch (status) {
        case 'Confirmed': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Confirmed</Badge>;
        case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
        case 'Cancelled': return <Badge variant="destructive">Cancelled</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

function ScheduleTable({ appointments, setAppointments }: { appointments: BeautyAppointment[], setAppointments: React.Dispatch<React.SetStateAction<BeautyAppointment[]>> }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>A view of all scheduled client appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Specialist</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map(appt => (
                            <TableRow key={appt.id}>
                                <TableCell>{appt.clientName}</TableCell>
                                <TableCell>{appt.service}</TableCell>
                                <TableCell>{appt.specialist}</TableCell>
                                <TableCell>{format(new Date(appt.dateTime), 'PPP p')}</TableCell>
                                <TableCell>{getStatusBadge(appt.status)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


export default function AgencyDashboardPage() {
    const { data: beautyCenters, setData: setBeautyCenters } = useBeautyCentersData(initialBeautyCenters);
    const { data: services, setData: setServices } = useBeautyServicesData(initialBeautyServices);
    const { data: appointments, setData: setAppointments } = useBeautyAppointmentsData(initialBeautyAppointments);
    const { data: specialists, setData: setSpecialists } = useBeautySpecialistsData(initialBeautySpecialists);
    
    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    const [isClient, setIsClient] = useState(false);

     useEffect(() => {
        setIsClient(true);
        if (initialBeautyCenters.length > 0) {
            setSelectedAgencyId(initialBeautyCenters[0].id);
        }
    }, []);

    const selectedAgency = beautyCenters.find(a => a.id === selectedAgencyId);
    
    const filteredServices = useMemo(() => services?.filter(s => s.agencyId === selectedAgency?.id), [services, selectedAgency]);
    const filteredAppointments = useMemo(() => appointments?.filter(a => a.agencyId === selectedAgency?.id), [appointments, selectedAgency]);
    const filteredSpecialists = useMemo(() => specialists?.filter(s => s.agencyId === selectedAgency?.id), [specialists, selectedAgency]);


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
    
    const tabs = [
          { value: 'schedule', label: 'Appointments', content: <ScheduleTable appointments={filteredAppointments || []} setAppointments={setAppointments} /> },
          { value: 'services', label: 'Services', content: <ServiceTable services={filteredServices || []} setServices={setServices} /> },
          { value: 'staff', label: 'Staff', content: <SpecialistTable agencyId={selectedAgency.id} initialSpecialists={filteredSpecialists || []} setSpecialists={setSpecialists} /> },
          { value: 'settings', label: 'Center Settings', content: <AgencySettings agency={selectedAgency} setAgencies={setBeautyCenters} /> }
        ];

    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto space-y-8">
                     <div>
                        <h1 className="text-3xl font-bold">Beauty & Wellness Dashboard</h1>
                        <p className="text-muted-foreground">Manage your salon, staff, and client appointments.</p>
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
                                    {beautyCenters.map(agency => (
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

                     <Tabs defaultValue={tabs[0].value} className="w-full">
                        <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
                           {tabs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
                        </TabsList>
                        {tabs.map(tab => <TabsContent key={tab.value} value={tab.value} className="mt-6">{tab.content}</TabsContent>)}
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
