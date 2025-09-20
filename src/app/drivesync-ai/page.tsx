
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Car, ArrowRight } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Link from 'next/link';
import { useRentalAgenciesData, useCarsData } from '@/hooks/use-global-store-data';
import type { Car as CarType, RentalAgency } from '@/lib/cars.schema';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "DriveSync AI | Car Rental Management SaaS",
  description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent, fleet management, and integration with IVMS for real-time tracking.",
};

export default function DriveSyncAiPage() {
    const { rentalAgencies } = useRentalAgenciesData();
    const { cars } = useCarsData();
    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const selectedAgency = useMemo(() => {
        if (!selectedAgencyId && rentalAgencies.length > 0) {
            setSelectedAgencyId(rentalAgencies[0].id);
            return rentalAgencies[0];
        }
        return rentalAgencies.find(a => a.id === selectedAgencyId);
    }, [selectedAgencyId, rentalAgencies]);

    const filteredCars = useMemo(() => {
        if (!selectedAgency) return [];
        return cars.filter(car =>
            car.rentalAgencyId === selectedAgency.id &&
            (statusFilter === 'All' || car.availability === statusFilter) &&
            (car.make.toLowerCase().includes(searchTerm.toLowerCase()) || car.model.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [cars, selectedAgency, statusFilter, searchTerm]);

    const getStatusBadge = (status: 'Available' | 'Rented') => (
        <Badge variant={status === 'Available' ? 'default' : 'secondary'} className={status === 'Available' ? 'bg-green-500/20 text-green-700' : ''}>
            {status}
        </Badge>
    );

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <Car className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">DriveSync AI</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and real-time fleet management.
                        </p>
                        <div className="mt-6">
                            <Button asChild>
                                <Link href="/drivesync-ai/find-a-car">
                                    Find a Car (Client View) <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <CardTitle>Fleet Management Dashboard</CardTitle>
                                    <CardDescription>A real-time overview of your vehicle fleet.</CardDescription>
                                </div>
                                {selectedAgency && (
                                    <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
                                        <SelectTrigger className="w-full md:w-[280px]">
                                            <SelectValue>{selectedAgency.name}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rentalAgencies.map(agency => (
                                                <SelectItem key={agency.id} value={agency.id}>{agency.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by make or model..."
                                        className="w-full pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full md:w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Statuses</SelectItem>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Rented">Rented</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Price/Day</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCars.map(car => (
                                        <TableRow key={car.id}>
                                            <TableCell>
                                                <Link href={`/drivesync-ai/${car.id}`} className="flex items-center gap-3 group">
                                                     <Image src={car.imageUrl} alt={`${car.make} ${car.model}`} width={60} height={40} className="rounded-md object-cover"/>
                                                    <div>
                                                        <p className="font-medium group-hover:underline">{car.make} {car.model}</p>
                                                        <p className="text-sm text-muted-foreground">{car.type}</p>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell>{car.year}</TableCell>
                                            <TableCell>{car.location}</TableCell>
                                            <TableCell>OMR {car.pricePerDay.toFixed(2)}</TableCell>
                                            <TableCell>{getStatusBadge(car.availability)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
