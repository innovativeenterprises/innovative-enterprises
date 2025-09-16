
'use client';

import { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { type BeautyAppointment } from '@/lib/beauty-appointments';

export function ScheduleTable({ appointments, setAppointments }: { appointments: BeautyAppointment[], setAppointments: (updater: (prev: BeautyAppointment[]) => BeautyAppointment[]) => void }) {
    
    const { toast } = useToast();

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
                            <TableHead>Date & Time</TableHead>
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
