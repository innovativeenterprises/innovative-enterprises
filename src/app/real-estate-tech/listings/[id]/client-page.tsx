
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { ArrowLeft, MapPin, BedDouble, Bath, Home, Square, Building2, Banknote, Mail } from 'lucide-react';
import Link from 'next/link';
import type { Property } from '@/lib/properties.schema';

export default function ProviderProfileClientPage({ property }: { property: Property }) {
    
    const details = [
        { icon: Home, label: 'Type', value: property.propertyType },
        { icon: Square, label: 'Area', value: `${property.areaSqM} sq.m.` },
        { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms },
        { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
        { icon: Building2, label: 'Building Age', value: property.buildingAge },
        { icon: Banknote, label: 'Status', value: property.status },
    ];

    return (
        <div className="bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <Button asChild variant="outline">
                            <Link href="/real-estate-tech/smart-listing">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Listings
                            </Link>
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <div className="grid lg:grid-cols-2">
                                <div className="relative h-80 lg:h-full min-h-[400px]">
                                    <Image src={property.imageUrl} alt={property.title} fill className="object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none" />
                                </div>
                                <div className="p-8 flex flex-col">
                                    <CardHeader className="p-0 space-y-2">
                                        <CardTitle className="text-3xl font-bold">{property.title}</CardTitle>
                                        <CardDescription className="text-lg flex items-center gap-2 pt-1 text-muted-foreground">
                                            <MapPin className="h-5 w-5" /> {property.location}
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="py-6 flex-grow">
                                        <p className="text-foreground/80">{property.description}</p>
                                    </div>
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
                                    <div className="pt-6 border-t">
                                        <p className="text-sm text-muted-foreground">Price</p>
                                        <p className="text-4xl font-extrabold text-primary">OMR {property.price.toLocaleString()}</p>
                                    </div>
                                    <CardFooter className="p-0 pt-6">
                                        <Button size="lg" className="w-full">
                                            <Mail className="mr-2 h-5 w-5" /> Contact Agent
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
