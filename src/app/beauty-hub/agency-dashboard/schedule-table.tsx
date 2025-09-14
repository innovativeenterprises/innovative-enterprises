
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import { format } from 'date-fns';

const getStatusBadge = (status: BeautyAppointment['status']) => {
    switch (status) {
        case 'Confirmed': return <Badge variant="default" className="bg-blue-500/20 text-blue-700">Confirmed</Badge>;
        case 'Completed': return <Badge variant="default" className="bg-green-500/20 text-green-700">Completed</Badge>;
        case 'Cancelled': return <Badge variant="destructive">Cancelled</Badge>;
    }
};

export function ScheduleTable({ appointments }: { appointments: BeautyAppointment[] }) {
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>A log of all scheduled client appointments.</CardDescription>
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
                                <TableCell>
                                    <div className="font-medium">{appt.clientName}</div>
                                    <div className="text-sm text-muted-foreground">{appt.clientContact}</div>
                                </TableCell>
                                <TableCell>{appt.serviceId}</TableCell> {/* In real app, look up service name */}
                                <TableCell>{appt.specialistId}</TableCell> {/* In real app, look up specialist name */}
                                <TableCell>{format(new Date(appt.appointmentDate), 'PPP p')}</TableCell>
                                <TableCell>{getStatusBadge(appt.status)}</TableCell>
                            </TableRow>
                        ))}
                         {appointments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">No appointments found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
