
'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Search, Package, Tag, Filter, Clock } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { initialStockItems, type StockItem } from '@/lib/stock-items';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "StockClear B2B Marketplace | Innovative Enterprises",
  description: "A B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales. Unlock trapped capital and prevent waste.",
};

const categories = ['All', 'Food & Beverage', 'Electronics', 'Apparel', 'Cosmetics', 'General Merchandise'];
const saleTypes = ['All', 'Fixed Price', 'Auction'];

const StockCard = ({ item }: { item: StockItem }) => (
    <Link href={`/stock-clear/${item.id}`} className="flex">
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col w-full">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={item.aiHint} />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">{item.saleType}</div>
                </div>
                <h3 className="font-semibold text-lg truncate mt-1">{item.name}</h3>
                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2"><Package className="h-4 w-4"/> {item.quantity}</div>
                {item.expiryDate && <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2"><Clock className="h-4 w-4"/> Expires: {new Date(item.expiryDate).toLocaleDateString()}</div>}
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <p className="text-xl font-bold text-primary">OMR {item.price.toLocaleString()}</p>
            </CardFooter>
        </Card>
    </Link>
);

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
          <h1 className="text-4xl md:text-5xl font-bold text-primary">StockClear Marketplace</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The premier B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales. Unlock trapped capital and prevent waste.
          </p>
        </div>

        <Card className="max-w-5xl mx-auto mt-12 p-4 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-1">
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
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={saleTypeFilter} onValueChange={setSaleTypeFilter}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                         {saleTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </Card>

        <div className="max-w-6xl mx-auto mt-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                    <StockCard key={item.id} item={item} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
