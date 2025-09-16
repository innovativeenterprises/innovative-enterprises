
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AgencySettings } from './agency-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { RequestTable, TimeAgoCell } from '@/components/request-table';
import { WorkerTable } from './worker-table';
import { Badge } from '@/components/ui/badge';
import type { HireRequest } from '@/lib/raaha-requests';
import type { Worker } from '@/lib/raaha-workers';
import { ScheduleInterviewDialog, type InterviewValues, type GenericRequest } from '@/components/schedule-interview-dialog';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { type BeautyCenter } from '@/lib/beauty-centers';
import { type BeautyService } from '@/lib/beauty-services';
import { type BeautyAppointment } from '@/lib/beauty-appointments';
import { ServiceTable } from './service-table';
import { ScheduleTable } from './schedule-table';

const getStatusBadge = (status: HireRequest['status']) => {
    switch (status) {
        case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
        case 'Contacted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Contacted</Badge>;
        case 'Interviewing': return <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 hover:bg-purple-500/30">Interviewing</Badge>;
        case 'Hired': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Hired</Badge>;
        case 'Closed': return <Badge variant="destructive">Closed</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const getAvailabilityBadge = (availability: Worker['availability']) => {
    return (
        <Badge variant={availability === 'Available' ? 'default' : 'outline'} className={availability === 'Available' ? 'bg-green-500/20 text-green-700' : ''}>
            {availability}
        </Badge>
    );
};


export default function AgencyDashboardClientPage({ initialAgencies, initialServices, initialAppointments }: { initialAgencies: BeautyCenter[], initialServices: BeautyService[], initialAppointments: BeautyAppointment[] }) {
    const [agencies, setAgencies] = useState(initialAgencies);
    const [services, setServices] = useState(initialServices);
    const [appointments, setAppointments] = useState(initialAppointments);
    const [isClient, setIsClient] = useState(false);

    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    const { toast } = useToast();

     useEffect(() => {
        setIsClient(true);
        if (agencies.length > 0 && !selectedAgencyId) {
            setSelectedAgencyId(agencies[0].id);
        }
    }, [agencies, selectedAgencyId]);

    const selectedAgency = agencies.find(a => a.id === selectedAgencyId);

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
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="schedule">Appointment Schedule</TabsTrigger>
                            <TabsTrigger value="services">Services & Pricing</TabsTrigger>
                            <TabsTrigger value="settings">Center Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="schedule" className="mt-6">
                            <ScheduleTable appointments={appointments} setAppointments={setAppointments} />
                        </TabsContent>
                        <TabsContent value="services" className="mt-6">
                            <ServiceTable services={services} setServices={setServices} />
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
