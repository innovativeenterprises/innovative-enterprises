
'use client';

import { useState, useMemo } from 'react';
import { initialStockItems } from '@/lib/stock-items';
import StockClearClientPage from './client-page';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Search, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export const metadata: Metadata = {
  title: "StockClear B2B Marketplace | Innovative Enterprises",
  description: "A B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales. Unlock trapped capital and prevent waste.",
};

const ItemCard = ({ item }: { item: any }) => (
    <Link href={`/stock-clear/${item.id}`} className="flex">
        <Card className="w-full overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="relative h-48 w-full">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={item.aiHint} />
                 {item.saleType === 'Auction' && <Badge className="absolute top-2 left-2 bg-red-500 text-white">Auction</Badge>}
            </div>
            <CardHeader>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <CardTitle className="text-lg truncate">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </CardContent>
            <CardFooter>
                 <p className="text-xl font-bold text-primary">OMR {item.price.toLocaleString()}</p>
            </CardFooter>
        </Card>
    </Link>
)

export default function StockClearPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [saleTypeFilter, setSaleTypeFilter] = useState('All');
    
    const filteredItems = useMemo(() => {
        return initialStockItems.filter(item => {
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            const matchesSaleType = saleTypeFilter === 'All' || item.saleType === saleTypeFilter;
            const matchesSearch = searchTerm === '' || 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesCategory && matchesSaleType && matchesSearch;
        });
    }, [searchTerm, categoryFilter, saleTypeFilter]);

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                 <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Truck className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">StockClear B2B Marketplace</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Unlock trapped capital and prevent waste. A B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales.
                    </p>
                </div>
                 <div className="max-w-6xl mx-auto mt-12 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Browse Listings</CardTitle>
                            <CardDescription>Find deals on bulk inventory for your business.</CardDescription>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                                <div className="relative md:col-span-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by product name..."
                                        className="w-full pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {['All', 'Food & Beverage', 'Electronics', 'Apparel', 'Cosmetics', 'General Merchandise'].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select value={saleTypeFilter} onValueChange={setSaleTypeFilter}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {['All', 'Fixed Price', 'Auction'].map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => <ItemCard key={item.id} item={item} />)}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
