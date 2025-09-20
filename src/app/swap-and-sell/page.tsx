
'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Search, Handshake, Gift, Recycle } from "lucide-react";
import Link from "next/link";
import { useUsedItemsData } from '@/hooks/use-global-store-data';
import type { UsedItem } from '@/lib/used-items.schema';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const ItemCard = ({ item }: { item: UsedItem }) => (
     <Link href={`/swap-and-sell/${item.id}`} className="flex">
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col w-full">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" />
                    <Badge className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm">{item.condition}</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <h3 className="font-semibold text-lg truncate mt-1">{item.name}</h3>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                 <p className="text-xl font-bold text-primary">OMR {item.price.toFixed(2)}</p>
            </CardFooter>
        </Card>
    </Link>
);


export default function SwapAndSellPage() {
    const { items, isClient } = useUsedItemsData();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(item => item.category)))], [items]);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [items, categoryFilter, searchTerm]);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Recycle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Swap &amp; Sell Hub</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Give your old items a new life. Our AI-powered platform makes it easy to sell, donate, or gift your used goods. Just upload a photo, and let the AI do the rest.
            </p>
            <div className="mt-8 flex justify-center gap-4">
               <Button asChild size="lg">
                    <Link href="/swap-and-sell/list-item">List an Item <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search for items..." className="w-full pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                 <div className="flex overflow-x-auto gap-2 pb-2">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={categoryFilter === category ? 'default' : 'outline'}
                            onClick={() => setCategoryFilter(category)}
                            className="shrink-0"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
        </div>

      </div>
    </div>
  );
}
