
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Car, ArrowRight, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Link from 'next/link';
import type { Car as CarType, RentalAgency } from '@/lib/cars.schema';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { getRentalAgencies, getCars } from '@/lib/firestore';

const getStatusBadge = (status: 'Available' | 'Rented' | 'Maintenance') => {
    switch (status) {
        case 'Available':
            return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Available</Badge>;
        case 'Rented':
            return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Rented</Badge>;
        case 'Maintenance':
            return <Badge variant="destructive">Maintenance</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4780 },
  { month: 'May', revenue: 6890 },
  { month: 'Jun', revenue: 5390 },
];
const chartConfig = { revenue: { label: "Revenue (OMR)", color: "hsl(var(--chart-1))" } };

const bookingData = [
  { date: '2024-06-01', bookings: 5 },
  { date: '2024-06-08', bookings: 8 },
  { date: '2024-06-15', bookings: 12 },
  { date: '2024-06-22', bookings: 10 },
  { date: '2024-06-29', bookings: 15 },
];
const bookingChartConfig = { bookings: { label: "Bookings", color: "hsl(var(--chart-2))" } };

export default function DriveSyncAiPage() {
    const [rentalAgencies, setRentalAgencies] = useState<RentalAgency[]>([]);
    const [cars, setCars] = useState<CarType[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        getRentalAgencies().then(setRentalAgencies);
        getCars().then(setCars);
    }, []);

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

    const totalFleet = useMemo(() => cars.filter(c => c.rentalAgencyId === selectedAgency?.id).length, [cars, selectedAgency]);
    const availableCars = useMemo(() => cars.filter(c => c.rentalAgencyId === selectedAgency?.id && c.availability === 'Available').length, [cars, selectedAgency]);
    const avgDailyRate = useMemo(() => {
        const agencyCars = cars.filter(c => c.rentalAgencyId === selectedAgency?.id);
        if (agencyCars.length === 0) return 0;
        const totalRate = agencyCars.reduce((sum, car) => sum + car.pricePerDay, 0);
        return totalRate / agencyCars.length;
    }, [cars, selectedAgency]);


    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto space-y-8">
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
                                    <CardTitle>Agency Dashboard</CardTitle>
                                    <CardDescription>A real-time overview of your vehicle fleet and performance.</CardDescription>
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
                             <Tabs defaultValue="fleet">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="fleet">Fleet Management</TabsTrigger>
                                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                </TabsList>
                                <TabsContent value="fleet" className="mt-6">
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
                                                <SelectItem value="Maintenance">Maintenance</SelectItem>
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
                                </TabsContent>
                                <TabsContent value="analytics" className="mt-6">
                                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        <Card><CardHeader><CardTitle className="text-sm font-medium">Total Fleet</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalFleet}</div></CardContent></Card>
                                        <Card><CardHeader><CardTitle className="text-sm font-medium">Available Cars</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{availableCars}</div></CardContent></Card>
                                        <Card><CardHeader><CardTitle className="text-sm font-medium">Avg. Daily Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">OMR {avgDailyRate.toFixed(2)}</div></CardContent></Card>
                                        <Card><CardHeader><CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{((totalFleet - availableCars) / totalFleet * 100).toFixed(1)}%</div></CardContent></Card>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 mt-6">
                                        <Card>
                                            <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
                                            <CardContent>
                                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                                    <BarChart data={revenueData}>
                                                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                                        <YAxis />
                                                        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                                                    </BarChart>
                                                </ChartContainer>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader><CardTitle>Booking Trends</CardTitle></CardHeader>
                                            <CardContent>
                                                 <ChartContainer config={bookingChartConfig} className="h-[250px] w-full">
                                                    <LineChart data={bookingData}>
                                                        <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {day: '2-digit', month: 'short'})} />
                                                        <YAxis />
                                                        <Tooltip content={<ChartTooltipContent indicator="line" />} />
                                                        <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} dot={{ r: 4 }} />
                                                    </LineChart>
                                                </ChartContainer>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
