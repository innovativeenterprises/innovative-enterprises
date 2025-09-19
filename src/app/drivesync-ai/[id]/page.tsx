
'use client';

import { useParams, notFound } from 'next/navigation';
import { useCarsData } from '@/hooks/use-global-store-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { ArrowLeft, MapPin, Calendar, Fuel, Cog, Car } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';
import type { Car as CarType } from '@/lib/cars.schema';
import { getCars } from '@/lib/firestore';

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((car) => ({
    id: car.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cars = await getCars();
  const car = cars.find(c => c.id === params.id);

  if (!car) {
    notFound();
  }

  return {
    title: `${car.make} ${car.model} | DriveSync AI`,
    description: `Details for the ${car.year} ${car.make} ${car.model}.`,
  };
}

export default function CarDetailPage() {
    const params = useParams();
    const { id } = params;
    const { cars, isClient } = useCarsData();
    const [car, setCar] = useState<CarType | undefined>(undefined);

    useEffect(() => {
        if (isClient && id) {
            const foundCar = cars.find(p => p.id === id);
            if (foundCar) {
                setCar(foundCar);
            } else {
                notFound();
            }
        }
    }, [id, cars, isClient]);

     if (!isClient || !car) {
        return (
             <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <Skeleton className="h-10 w-40 mb-8" />
                    <Skeleton className="h-[600px] w-full" />
                </div>
            </div>
        )
    }
    
    const details = [
        { icon: Car, label: 'Type', value: car.type },
        { icon: Calendar, label: 'Year', value: car.year },
        { icon: Fuel, label: 'Fuel', value: car.features.find(f => f.includes('Gasoline') || f.includes('Diesel')) || 'Gasoline' },
        { icon: Cog, label: 'Transmission', value: car.features.find(f => f.includes('Automatic') || f.includes('Manual')) || 'Automatic' },
    ];

    return (
        <div className="bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <Button asChild variant="outline">
                            <Link href="/drivesync-ai/find-a-car">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Listings
                            </Link>
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <div className="grid lg:grid-cols-2">
                                <div className="relative h-80 lg:h-full min-h-[400px]">
                                    <Image src={car.imageUrl} alt={car.model} fill className="object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none" />
                                </div>
                                <div className="p-8 flex flex-col">
                                    <CardHeader className="p-0 space-y-2">
                                        <Badge variant="outline" className="w-fit">{car.make}</Badge>
                                        <CardTitle className="text-3xl font-bold">{car.model}</CardTitle>
                                        <CardDescription className="text-lg flex items-center gap-2 pt-1 text-muted-foreground">
                                            <MapPin className="h-5 w-5" /> {car.location}
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="py-6 flex-grow">
                                         <div className="grid grid-cols-2 gap-4 my-4">
                                            {details.map(detail => (
                                                <div key={detail.label} className="flex items-center gap-3">
                                                    <detail.icon className="h-6 w-6 text-primary" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">{detail.label}</p>
                                                        <p className="font-semibold">{detail.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Features</h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {car.features.map(f => <Badge key={f}>{f}</Badge>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t">
                                        <p className="text-sm text-muted-foreground">Price</p>
                                        <p className="text-4xl font-extrabold text-primary">OMR {car.pricePerDay.toFixed(2)} / day</p>
                                    </div>
                                    <CardFooter className="p-0 pt-6">
                                        <Button size="lg" className="w-full">
                                            Book Now
                                        </Button>
                                    </CardFooter>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
