
'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Search, HandCoins } from "lucide-react";
import Link from 'next/link';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useStairspaceListingsData } from '@/hooks/use-data-hooks';

const ItemCard = ({ item }: { item: StairspaceListing }) => (
    <Link href={`/real-estate-tech/stairspace/listing/${item.id}`} className="flex">
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col w-full">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={item.aiHint} />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground">{item.location}</p>
                <h3 className="font-semibold text-lg truncate mt-1">{item.title}</h3>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <p className="text-lg font-bold text-primary">{item.price}</p>
            </CardFooter>
        </Card>
    </Link>
);

const ListingGridSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
                <Skeleton className="h-48 w-full" />
                <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                <CardFooter><Skeleton className="h-8 w-1/3" /></CardFooter>
            </Card>
        ))}
    </div>
);

export default function StairspaceClientPage({ initialListings }: { initialListings: StairspaceListing[] }) {
    const { data: listings, isClient } = useStairspaceListingsData(initialListings);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm) return listings;
        return listings.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [listings, searchTerm]);

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                 <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <HandCoins className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">StairSpace Marketplace</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A marketplace connecting property owners with entrepreneurs looking for affordable, flexible, and high-visibility micro-retail and storage spots.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto mt-16">
                     <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or location..."
                                className="w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                     {!isClient ? <ListingGridSkeleton /> : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                     )}
                </div>
                 <div className="max-w-3xl mx-auto mt-20 text-center">
                    <Card className="bg-accent/10 border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl text-accent">Have an Unused Space?</CardTitle>
                        </CardHeader>
                        <CardFooter className="justify-center">
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/real-estate-tech/stairspace/list-your-space">List Your Space <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
