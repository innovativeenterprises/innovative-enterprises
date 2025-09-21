
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Car, Settings, BarChart3, Users } from "lucide-react";
import Link from 'next/link';
import type { Car as CarType } from '@/lib/cars.schema';
import type { RentalAgency } from '@/lib/rental-agencies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const bookingData = [
    { date: 'Mon', bookings: 12 }, { date: 'Tue', bookings: 15 }, { date: 'Wed', bookings: 8 },
    { date: 'Thu', bookings: 18 }, { date: 'Fri', bookings: 22 }, { date: 'Sat', bookings: 25 }, { date: 'Sun', bookings: 10 }
];
const chartConfig = { bookings: { label: "Bookings", color: "hsl(var(--chart-1))" } };

export default function DriveSyncClientPage({ initialAgencies, initialCars }: { initialAgencies: RentalAgency[], initialCars: CarType[] }) {
    const [selectedAgencyId, setSelectedAgencyId] = useState(initialAgencies[0]?.id || '');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const agencyCars = useMemo(() => {
        return initialCars.filter(c => c.rentalAgencyId === selectedAgencyId);
    }, [selectedAgencyId, initialCars]);
    
    const kpiData = useMemo(() => {
        if (!isClient) return { total: 0, available: 0, rented: 0, revenue: 0 };
        const rentedCount = agencyCars.filter(c => c.availability === 'Rented').length;
        return {
            total: agencyCars.length,
            available: agencyCars.length - rentedCount,
            rented: rentedCount,
            revenue: agencyCars.reduce((sum, car) => car.availability === 'Rented' ? sum + car.pricePerDay : sum, 0),
        };
    }, [agencyCars, isClient]);

    const carTypeData = useMemo(() => {
        if (!isClient) return [];
        return ['SUV', 'Sedan', 'Coupe', 'Truck'].map(type => ({
            type,
            count: agencyCars.filter(c => c.type === type).length,
        }));
    }, [agencyCars, isClient]);

    if (!isClient) {
        return (
             <div className="bg-background min-h-[calc(100vh-8rem)]">
                <div className="container mx-auto px-4 py-16">
                    <Skeleton className="h-[80vh] w-full" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Car className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">DriveSync AI</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and real-time fleet management.
                    </p>
                </div>
                
                <div className="max-w-6xl mx-auto mt-16 space-y-8">
                     <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Agency Fleet Dashboard</CardTitle>
                            <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select an agency..."/>
                                </SelectTrigger>
                                <SelectContent>
                                    {initialAgencies.map(agency => (
                                        <SelectItem key={agency.id} value={agency.id}>{agency.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="space-y-8">
                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card><CardHeader><CardTitle className="text-sm font-medium">Total Fleet</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{kpiData.total}</CardContent></Card>
                                <Card><CardHeader><CardTitle className="text-sm font-medium">Available</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-green-600">{kpiData.available}</CardContent></Card>
                                <Card><CardHeader><CardTitle className="text-sm font-medium">Rented</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-yellow-600">{kpiData.rented}</CardContent></Card>
                                <Card><CardHeader><CardTitle className="text-sm font-medium">Est. Daily Revenue</CardTitle></CardHeader><CardContent className="text-2xl font-bold">OMR {kpiData.revenue.toFixed(2)}</CardContent></Card>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                 <Card>
                                    <CardHeader><CardTitle>Bookings This Week</CardTitle></CardHeader>
                                    <CardContent>
                                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                            <LineChart data={bookingData} margin={{ left: -20, right: 20 }}>
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip content={<ChartTooltipContent />} />
                                                <Line type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle>Fleet Composition</CardTitle></CardHeader>
                                    <CardContent>
                                        <ChartContainer config={{}} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={carTypeData} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--primary))" label />
                                                    <Tooltip content={<ChartTooltipContent />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button asChild>
                                <Link href="/drivesync-ai/find-a-car">
                                    Launch AI Booking Assistant <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

