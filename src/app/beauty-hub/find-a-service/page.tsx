
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useBeautyData } from '@/hooks/use-global-store-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function FindAServicePage() {
    const { agencies, isClient } = useBeautyData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAgencies = useMemo(() => {
        if (!searchTerm) return agencies;
        return agencies.filter(agency =>
            agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agency.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [agencies, searchTerm]);

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Find a Salon or Spa</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Discover top-rated beauty and wellness centers near you.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto mt-12 space-y-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or service..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {!isClient ? (
                            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
                        ) : (
                            filteredAgencies.map(agency => (
                                <Card key={agency.id} className="flex flex-col">
                                    <CardHeader className="flex-row items-center gap-4">
                                        <Image src={agency.logo} alt={agency.name} width={64} height={64} className="rounded-lg border p-1" />
                                        <div>
                                            <CardTitle>{agency.name}</CardTitle>
                                            <CardDescription>{agency.description}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardFooter className="mt-auto justify-end">
                                        <Button asChild>
                                            <Link href={`/beauty-hub/agency/${agency.id}`}>
                                                View Services <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
