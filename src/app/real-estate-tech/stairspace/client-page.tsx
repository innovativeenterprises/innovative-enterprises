'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Search, Handshake, Gift } from "lucide-react";
import Link from 'next/link';
import { useStairspaceData } from '@/hooks/use-global-store-data';
import type { StairspaceListing } from '@/lib/stairspace-listings';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const ListingCard = ({ listing }: { listing: StairspaceListing }) => (
    <Link href={`/real-estate-tech/stairspace/${listing.id}`} className="flex">
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col w-full">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={listing.aiHint}/>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="flex flex-wrap gap-2 mb-2">
                    {listing.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
                <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                <p className="text-sm text-muted-foreground">{listing.location}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                 <p className="text-xl font-bold text-primary">{listing.price}</p>
            </CardFooter>
        </Card>
    </Link>
);

const ListingGridSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-8 w-1/3" />
                </CardFooter>
            </Card>
        ))}
    </div>
);

export default function StairspacePage() {
    const { stairspaceListings, isClient } = useStairspaceData();
    const [searchTerm, setSearchTerm] = useState('');
    const [tagFilter, setTagFilter] = useState('All');

    const allTags = useMemo(() => {
        if (!isClient) return [];
        const tags = new Set<string>(['All']);
        stairspaceListings.forEach(listing => {
            listing.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [stairspaceListings, isClient]);

    const filteredListings = useMemo(() => {
        return stairspaceListings.filter(listing => {
            const matchesTag = tagFilter === 'All' || listing.tags.includes(tagFilter);
            const matchesSearch = searchTerm === '' || listing.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTag && matchesSearch;
        });
    }, [stairspaceListings, tagFilter, searchTerm]);

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Handshake className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">StairSpace: Your Micro-Retail Revolution</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A marketplace that connects property owners with entrepreneurs looking for affordable, flexible, and high-visibility micro-retail and storage spots.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto mt-16">
                     <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by listing title..."
                                className="w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex overflow-x-auto gap-2 pb-2">
                            {allTags.map(tag => (
                                <Button
                                    key={tag}
                                    variant={tagFilter === tag ? 'default' : 'outline'}
                                    onClick={() => setTagFilter(tag)}
                                    className="shrink-0"
                                >
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    </div>
                     {!isClient ? <ListingGridSkeleton /> : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredListings.map(listing => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                     )}
                </div>

                 <div className="max-w-3xl mx-auto mt-20 text-center">
                    <Card className="bg-accent/10 border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl text-accent">Have an Unused Space?</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                               Turn your empty corner, under-stair space, or small kiosk into a new source of revenue.
                            </CardDescription>
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