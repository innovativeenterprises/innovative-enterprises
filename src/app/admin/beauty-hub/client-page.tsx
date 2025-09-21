
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
import { useToast } from '@/hooks/use-toast';
import { ServiceTable } from './service-table';
import { ScheduleTable } from './schedule-table';
import { useBeautyData } from '@/hooks/use-data-hooks';

export default function AgencyDashboardClientPage({ initialAgencies, initialServices, initialAppointments }: { initialAgencies: BeautyCenter[], initialServices: BeautyService[], initialAppointments: BeautyAppointment[] }) {
    const { data: agencies, setData: setAgencies, isClient: isAgenciesClient } = useBeautyData(initialAgencies);
    const { data: services, setData: setServices } = useBeautyData(initialServices);
    const { data: appointments, setData: setAppointments } = useBeautyData(initialAppointments);
    
    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    const isClient = isAgenciesClient; // Simplified for clarity

     useEffect(() => {
        if (agencies.length > 0 && !selectedAgencyId) {
            setSelectedAgencyId(agencies[0].id);
        }
    }, [agencies, selectedAgencyId]);

    const selectedAgency = agencies.find(a => a.id === selectedAgencyId);
    
    const filteredServices = useMemo(() => services.filter(s => s.agencyId === selectedAgency?.id), [services, selectedAgency]);
    const filteredAppointments = useMemo(() => appointments.filter(a => a.agencyId === selectedAgency?.id), [appointments, selectedAgency]);


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

                     <Tabs defaultValue="schedule" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="schedule">Appointments</TabsTrigger>
                            <TabsTrigger value="services">Services</TabsTrigger>
                            <TabsTrigger value="staff">Staff</TabsTrigger>
                            <TabsTrigger value="settings">Center Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="schedule" className="mt-6">
                            <ScheduleTable appointments={filteredAppointments} setAppointments={setAppointments} />
                        </TabsContent>
                        <TabsContent value="services" className="mt-6">
                            <ServiceTable services={filteredServices} setServices={setServices} />
                        </TabsContent>
                         <TabsContent value="staff" className="mt-6">
                            <SpecialistTable agencyId={selectedAgency.id} />
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
