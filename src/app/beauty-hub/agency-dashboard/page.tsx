
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AgencySettings } from './agency-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useBeautyData, setBeautyCenters, setBeautyAppointments } from '@/hooks/use-global-store-data';
import { ScheduleTable } from './schedule-table';
import { ServiceTable } from './service-table';
import { useToast } from '@/hooks/use-toast';


export default function AgencyDashboardPage() {
    const { 
        centers, 
        services, 
        appointments, 
        specialists, 
        isClient 
    } = useBeautyData();
    const { toast } = useToast();

    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    
    useEffect(() => {
        if (centers.length > 0 && !selectedAgencyId) {
            setSelectedAgencyId(centers[0].id);
        }
    }, [centers, selectedAgencyId]);

    const selectedAgency = centers.find(a => a.id === selectedAgencyId);
    
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
    
    const filteredServices = services.filter(s => s.centerId === selectedAgency.id);
    const filteredAppointments = appointments.filter(a => a.centerId === selectedAgency.id);

    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto space-y-8">
                     <div>
                        <h1 className="text-3xl font-bold">Beauty Center Dashboard</h1>
                        <p className="text-muted-foreground">Manage your services, specialists, and client appointments.</p>
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
                                    {centers.map(agency => (
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
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="schedule">Appointments ({filteredAppointments.length})</TabsTrigger>
                            <TabsTrigger value="services">Services ({filteredServices.length})</TabsTrigger>
                            <TabsTrigger value="settings">Center Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="schedule" className="mt-6">
                            <ScheduleTable appointments={filteredAppointments} />
                        </TabsContent>
                        <TabsContent value="services" className="mt-6">
                            <ServiceTable services={filteredServices} specialists={specialists} agencyId={selectedAgency.id} />
                        </TabsContent>
                        <TabsContent value="settings" className="mt-6">
                            {selectedAgency && <AgencySettings agency={selectedAgency} setAgencies={setBeautyCenters} />}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
