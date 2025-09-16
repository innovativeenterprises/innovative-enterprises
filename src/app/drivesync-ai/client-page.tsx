'use client';

import { useState, useMemo } from 'react';
import { Car, Search, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Car as CarType } from '@/lib/cars';
import type { RentalAgency } from '@/lib/rental-agencies';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Available': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Available</Badge>;
        case 'Rented': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Rented</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function DriveSyncClientPage({ initialCars, initialAgencies }: { initialCars: CarType[], initialAgencies: RentalAgency[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    
    // In a real app, you'd have a user session to determine the agency.
    // For this prototype, we'll just assume we're managing 'agency_1'.
    const agency = initialAgencies[0];
    
    const filteredCars = useMemo(() => {
        const agencyCars = initialCars.filter(c => c.rentalAgencyId === agency.id);
        if (!searchTerm) return agencyCars;
        return agencyCars.filter(car => 
            car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [initialCars, searchTerm, agency]);

    return (
        <div className="bg-background min-h-screen">
             <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                     <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Car className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">DriveSync AI Dashboard</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Welcome, {agency.name}. Manage your fleet and bookings from one intelligent dashboard.
                    </p>
                    <div className="mt-6">
                        <Button asChild>
                            <Link href="/drivesync-ai/find-a-car">Go to Customer Booking Assistant <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fleet Management</CardTitle>
                            <div className="flex justify-between items-center">
                                <CardDescription>An overview of your entire vehicle fleet.</CardDescription>
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by make or model..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Price/Day</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCars.map(car => (
                                        <TableRow key={car.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                     <Image src={car.imageUrl} alt={`${car.make} ${car.model}`} width={64} height={48} className="rounded-md object-cover"/>
                                                     <div>
                                                        <p className="font-medium">{car.make} {car.model}</p>
                                                        <p className="text-sm text-muted-foreground">{car.year}</p>
                                                     </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{car.type}</TableCell>
                                            <TableCell>{car.location}</TableCell>
                                            <TableCell>{getStatusBadge(car.availability)}</TableCell>
                                            <TableCell className="text-right font-mono">OMR {car.pricePerDay.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
