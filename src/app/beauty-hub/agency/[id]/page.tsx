
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useBeautyCentersData, useBeautyServicesData } from '@/hooks/use-data-hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, DollarSign, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { BookingForm } from '../../booking-form';
import { BeautyChat } from '../../beauty-chat';
import type { BeautyService } from '@/lib/beauty-services.schema';

export default function AgencyDetailPage() {
    const params = useParams();
    const { id } = params;
    const { data: agencies, isClient: isAgenciesClient } = useBeautyCentersData();
    const { data: services, isClient: isServicesClient } = useBeautyServicesData();
    const isClient = isAgenciesClient && isServicesClient;
    
    const [selectedService, setSelectedService] = useState<BeautyService | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const agency = useMemo(() => {
        if (!isClient) return null;
        return agencies.find(a => a.id === id);
    }, [agencies, id, isClient]);

    const agencyServices = useMemo(() => {
        if (!isClient) return [];
        return services.filter(s => s.agencyId === id);
    }, [services, id, isClient]);

    useEffect(() => {
        if (isClient && !agency) {
            notFound();
        }
    }, [isClient, agency]);
    
    const handleBookClick = (service: BeautyService) => {
        setSelectedService(service);
        setIsFormOpen(true);
    };

    if (!isClient || !agency) {
        return (
            <div className="container mx-auto px-4 py-16">
                <Skeleton className="h-screen w-full" />
            </div>
        );
    }
    
    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/beauty-hub/find-a-service">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to All Salons
                            </Link>
                        </Button>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                             <Image src={agency.logo} alt={agency.name} width={128} height={128} className="rounded-xl border p-2" />
                             <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold text-primary">{agency.name}</h1>
                                <p className="mt-2 text-lg text-muted-foreground">{agency.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Our Services</CardTitle>
                                </CardHeader>
                                <CardContent className="grid sm:grid-cols-2 gap-4">
                                    {agencyServices.map(service => (
                                        <Card key={service.id} className="p-4 flex flex-col">
                                            <h3 className="font-semibold">{service.name}</h3>
                                            <Badge variant="outline" className="w-fit my-2">{service.category}</Badge>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground flex-grow">
                                                <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> {service.duration} min</span>
                                                <span className="flex items-center gap-1"><DollarSign className="h-4 w-4"/> {service.price.toFixed(2)}</span>
                                            </div>
                                            <Button size="sm" className="w-full mt-4" onClick={() => handleBookClick(service)}>Book Now</Button>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <BeautyChat agency={agency} services={agencyServices} />
                        </div>
                    </div>
                </div>
            </div>
             {isFormOpen && selectedService && (
                <BookingForm
                    agency={agency}
                    service={selectedService}
                    isOpen={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
