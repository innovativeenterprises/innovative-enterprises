
'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Search, Handshake, Gift, Warehouse, Package } from "lucide-react";
import Link from 'next/link';
import { useStockItemsData } from '@/hooks/use-data-hooks';
import type { StockItem } from '@/lib/stock-items.schema';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const categories = ['All', 'Food & Beverage', 'Electronics', 'Apparel', 'Home Goods'];

const ItemCard = ({ item }: { item: StockItem }) => (
    <Link href={`/stock-clear/${item.id}`} className="flex">
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col w-full">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={item.aiHint}/>
                     <Badge variant="destructive" className="absolute top-2 right-2">{item.saleType}</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <h3 className="font-semibold text-lg truncate mt-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                 <p className="text-xl font-bold text-primary">OMR {item.price.toLocaleString()}</p>
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
                <CardContent><Skeleton className="h-4 w-full" /></CardContent>
                <CardFooter><Skeleton className="h-8 w-1/3" /></CardFooter>
            </Card>
        ))}
    </div>
);

export default function StockClearClientPage({ initialItems }: { initialItems: StockItem[] }) {
    const { items: stockItems, isClient } = useStockItemsData(initialItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [tagFilter, setTagFilter] = useState('All');

    const filteredItems = useMemo(() => {
        return stockItems.filter(item => {
            const matchesTag = tagFilter === 'All' || item.category === tagFilter;
            const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTag && matchesSearch;
        });
    }, [stockItems, tagFilter, searchTerm]);

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Warehouse className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">StockClear: The B2B Overstock Marketplace</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A B2B marketplace for wholesalers, distributors, and retailers to liquidate excess or near-expiry stock through auctions and bulk sales.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto mt-16">
                     <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by item name..."
                                className="w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex overflow-x-auto gap-2 pb-2">
                            {categories.map(tag => (
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
                            {filteredItems.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                     )}
                </div>

                 <div className="max-w-3xl mx-auto mt-20 text-center">
                    <Card className="bg-accent/10 border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl text-accent">Have Excess Stock?</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                               Turn your unsold inventory into cash. List your overstock or near-expiry goods on our platform and reach a network of bulk buyers.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-center">
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/admin/stock-clear">List Your Stock <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
