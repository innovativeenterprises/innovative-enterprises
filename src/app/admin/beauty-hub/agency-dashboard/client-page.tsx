
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgencySettings } from '@/app/beauty-hub/agency-dashboard/agency-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { SpecialistTable } from '@/app/beauty-hub/agency-dashboard/specialist-table';
import { Badge } from '@/components/ui/badge';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { BeautyService } from '@/lib/beauty-services.schema';
import type { BeautyCenter } from '@/lib/beauty-centers.schema';
import { useToast } from '@/hooks/use-toast';
import type { BeautySpecialist } from '@/lib/beauty-specialists.schema';
import { useBeautyCentersData, useBeautyServicesData, useBeautyAppointmentsData, useBeautySpecialistsData } from '@/hooks/use-data-hooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// --- ServiceTable Component Logic ---
const ServiceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum(['Hair', 'Nails', 'Skincare', 'Massage', 'Makeup']),
  price: z.coerce.number().positive("Price must be a positive number"),
  duration: z.coerce.number().positive("Duration in minutes is required"),
});
type ServiceValues = z.infer<typeof ServiceSchema>;

const AddEditServiceDialog = ({ 
    service, 
    onSave,
    children,
}: { 
    service?: BeautyService, 
    onSave: (values: ServiceValues, id?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<ServiceValues>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: service || { name: "", category: "Hair", price: 0, duration: 30 },
    });

    const onSubmit: SubmitHandler<ServiceValues> = (data) => {
        onSave(data, service?.id);
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{service ? "Edit" : "Add"} Service</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Service Name</FormLabel><FormControl><Input placeholder="e.g., Classic Manicure" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Hair">Hair</SelectItem>
                                    <SelectItem value="Nails">Nails</SelectItem>
                                    <SelectItem value="Skincare">Skincare</SelectItem>
                                    <SelectItem value="Massage">Massage</SelectItem>
                                    <SelectItem value="Makeup">Makeup</SelectItem>
                                </SelectContent></Select><FormMessage/></FormItem>
                            )} />
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price (OMR)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="duration" render={({ field }) => (
                            <FormItem><FormLabel>Duration (minutes)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Service</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function ServiceTable({ services, setServices }: { services: BeautyService[], setServices: (updater: (prev: BeautyService[]) => BeautyService[]) => void }) {
    const { toast } = useToast();

    const handleSave = (values: ServiceValues, id?: string) => {
        const agencyId = services[0]?.agencyId; // Assuming all services belong to the same agency
        if (id) {
            setServices(prev => prev.map(s => s.id === id ? { ...s, ...values } : s));
            toast({ title: "Service updated." });
        } else {
            const newService: BeautyService = { ...values, id: `service_${Date.now()}`, agencyId };
            setServices(prev => [newService, ...prev]);
            toast({ title: "Service added." });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Services &amp; Pricing</CardTitle>
                    <CardDescription>Manage the services your center offers.</CardDescription>
                </div>
                 <AddEditServiceDialog onSave={handleSave}>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Service</Button>
                </AddEditServiceDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map(service => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell><Badge variant="outline">{service.category}</Badge></TableCell>
                                <TableCell>{service.duration} mins</TableCell>
                                <TableCell className="text-right font-mono">OMR {service.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <AddEditServiceDialog service={service} onSave={handleSave}>
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    </AddEditServiceDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- ScheduleTable Component Logic ---
function ScheduleTable({ appointments, setAppointments }: { appointments: BeautyAppointment[], setAppointments: (updater: (prev: BeautyAppointment[]) => BeautyAppointment[]) => void }) {
    const getStatusBadge = (status: BeautyAppointment['status']) => {
        switch (status) {
            case 'Confirmed': return <Badge variant="default" className="bg-green-500/20 text-green-700">Confirmed</Badge>;
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">Pending</Badge>;
            case 'Cancelled': return <Badge variant="destructive">Cancelled</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>A list of scheduled client bookings.</CardDescription>
                </div>
                <Button disabled><PlusCircle className="mr-2 h-4 w-4"/> Add Appointment</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Specialist</TableHead>
                            <TableHead>Date &amp; Time</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.length === 0 ? (
                             <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No appointments scheduled.</TableCell></TableRow>
                        ) : appointments.map(appt => (
                            <TableRow key={appt.id}>
                                <TableCell className="font-medium">{appt.clientName}</TableCell>
                                <TableCell>{appt.service}</TableCell>
                                <TableCell>{appt.specialist}</TableCell>
                                <TableCell>{format(new Date(appt.dateTime), "PPP 'at' p")}</TableCell>
                                <TableCell>{getStatusBadge(appt.status)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- Main Client Page Component ---
export default function AgencyDashboardClientPage({ 
    initialAgencies, 
    initialServices, 
    initialAppointments,
    initialSpecialists
}: { 
    initialAgencies: BeautyCenter[], 
    initialServices: BeautyService[], 
    initialAppointments: BeautyAppointment[],
    initialSpecialists: BeautySpecialist[],
}) {
    const { data: agencies, setData: setAgencies } = useBeautyCentersData(initialAgencies);
    const { data: services, setData: setServices } = useBeautyServicesData(initialServices);
    const { data: appointments, setData: setAppointments } = useBeautyAppointmentsData(initialAppointments);
    const { data: specialists, setData: setSpecialists } = useBeautySpecialistsData(initialSpecialists);
    
    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    const [isClient, setIsClient] = useState(false);

     useEffect(() => {
        setIsClient(true);
        if (initialAgencies.length > 0) {
            setSelectedAgencyId(initialAgencies[0].id);
        }
    }, [initialAgencies]);

    const selectedAgency = agencies.find(a => a.id === selectedAgencyId);
    
    const filteredServices = useMemo(() => services.filter(s => s.agencyId === selectedAgency?.id), [services, selectedAgency]);
    const filteredAppointments = useMemo(() => appointments.filter(a => a.agencyId === selectedAgency?.id), [appointments, selectedAgency]);
    const filteredSpecialists = useMemo(() => specialists.filter(s => s.agencyId === selectedAgency?.id), [specialists, selectedAgency]);


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
                            <SpecialistTable 
                                agencyId={selectedAgency.id} 
                                initialSpecialists={filteredSpecialists}
                             />
                        </TabsContent>
                        <TabsContent value="settings" className="mt-6">
                            {selectedAgency && <AgencySettings agency={selectedAgency} />}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

    