'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, PlusCircle } from "lucide-react";
import Image from 'next/image';
import { type StockItem } from '@/lib/stock-items';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Active': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Active</Badge>;
        case 'Sold': return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Sold</Badge>;
        case 'Expired': return <Badge variant="outline">Expired</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function StockClearClientPage({ initialItems }: { initialItems: StockItem[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [saleTypeFilter, setSaleTypeFilter] = useState('All');

    const filteredItems = useMemo(() => {
        return initialItems.filter(item => {
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            const matchesSaleType = saleTypeFilter === 'All' || item.saleType === saleTypeFilter;
            const matchesSearch = searchTerm === '' || 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesCategory && matchesSaleType && matchesSearch;
        });
    }, [searchTerm, categoryFilter, saleTypeFilter, initialItems]);

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">StockClear Management</h1>
                <p className="text-muted-foreground">
                    Manage all listings on the B2B overstock marketplace.
                </p>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Listings</CardTitle>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Listing</Button>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Sale Type</TableHead>
                                <TableHead className="text-right">Price (OMR)</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md object-cover" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.saleType}</TableCell>
                                    <TableCell className="text-right font-mono">{item.price.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
