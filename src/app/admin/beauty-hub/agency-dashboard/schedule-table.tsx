'use client';

import { useState, useEffect } from 'react';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ScheduleTable({ appointments, setAppointments }: { appointments: BeautyAppointment[], setAppointments: (updater: (prev: BeautyAppointment[]) => BeautyAppointment[]) => void }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleStatusChange = (id: string, newStatus: BeautyAppointment['status']) => {
        setAppointments(prev => prev.map(appt => appt.id === id ? { ...appt, status: newStatus } : appt));
    };

    const getStatusBadge = (status: BeautyAppointment['status']) => {
        switch (status) {
            case 'Confirmed': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Confirmed</Badge>;
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
            case 'Cancelled': return <Badge variant="destructive">Cancelled</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointment Schedule</CardTitle>
                <CardDescription>View and manage all upcoming client appointments.</CardDescription>
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
                        {!isClient ? (
                            <TableRow><TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                        ) : appointments.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground h-24">No appointments found.</TableCell></TableRow>
                        ) : (
                            appointments.map(appt => (
                                <TableRow key={appt.id}>
                                    <TableCell className="font-medium">{appt.clientName}</TableCell>
                                    <TableCell>{appt.service}</TableCell>
                                    <TableCell>{appt.specialist}</TableCell>
                                    <TableCell>{format(new Date(appt.dateTime), "PPP 'at' p")}</TableCell>
                                    <TableCell>
                                        <Select value={appt.status} onValueChange={(value) => handleStatusChange(appt.id, value as BeautyAppointment['status'])}>
                                            <SelectTrigger className="w-32 border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                                                <SelectValue asChild>
                                                    {getStatusBadge(appt.status)}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}