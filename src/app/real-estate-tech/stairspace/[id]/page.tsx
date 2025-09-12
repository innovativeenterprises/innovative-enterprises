
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useStairspaceData } from '@/hooks/use-global-store-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { ArrowLeft, MapPin, Tag, Calendar, User, Mail, Phone, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { BookingRequestForm } from './booking-form';
import type { StairspaceListing } from '@/lib/stairspace.schema';


export default function StairspaceDetailPage() {
    const params = useParams();
    const { id } = params;
    const { stairspaceListings } = useStairspaceData();
    const router = useRouter();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const listing = stairspaceListings.find(l => l.id === id);

    if (!listing) {
        return notFound();
    }

    return (
        <div className="bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                        <Button asChild variant="outline" onClick={() => router.back()}>
                            <Link href="/real-estate-tech/stairspace">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Listings
                            </Link>
                        </Button>
                    </div>
                    <Card className="overflow-hidden">
                        <div className="grid lg:grid-cols-5">
                            <div className="lg:col-span-3 relative min-h-[300px] lg:min-h-[500px]">
                                <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover" />
                            </div>
                            <div className="lg:col-span-2 p-8 flex flex-col">
                                <div className="flex-grow">
                                    <CardHeader className="p-0">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {listing.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                                        </div>
                                        <CardTitle className="text-3xl font-bold">{listing.title}</CardTitle>
                                        <CardDescription className="text-lg flex items-center gap-2 pt-1 text-muted-foreground">
                                            <MapPin className="h-5 w-5" /> {listing.location}
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="py-6 space-y-4">
                                        <p className="text-foreground/80">
                                            This unique space is perfect for entrepreneurs looking to launch a pop-up, test a product, or operate a micro-business with high visibility and low overhead.
                                        </p>
                                        <div className="border-t pt-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Availability:</span>
                                                <span className="font-semibold">Immediate</span>
                                            </div>
                                             <div className="flex justify-between">
                                                <span className="text-muted-foreground">Minimum Rental:</span>
                                                <span className="font-semibold">1 Day</span>
                                            </div>
                                             <div className="flex justify-between">
                                                <span className="text-muted-foreground">Ideal For:</span>
                                                <span className="font-semibold">Retail, Showcases, Art</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t">
                                    <p className="text-sm text-muted-foreground">Rental Price</p>
                                    <p className="text-4xl font-extrabold text-primary">{listing.price}</p>
                                    <CardFooter className="p-0 pt-6">
                                        <Button size="lg" className="w-full" onClick={() => setIsFormOpen(true)}>
                                            <DollarSign className="mr-2 h-5 w-5" /> Request to Book
                                        </Button>
                                    </CardFooter>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                 {isFormOpen && (
                    <BookingRequestForm 
                        listing={listing}
                        isOpen={isFormOpen}
                        onOpenChange={setIsFormOpen}
                        onClose={() => setIsFormOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
