'use client';

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { type SaasCategory, type SaaSProduct } from '@/lib/saas-products';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const getStatusBadge = (status: string) => {
    switch (status) {
        case "Completed":
            return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Completed</Badge>;
        case "On Track":
            return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">On Track</Badge>;
        case "At Risk":
            return <Badge variant="destructive" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">At Risk</Badge>;
        case "On Hold":
            return <Badge variant="outline" className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30">On Hold</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const getStageBadge = (stage: string) => {
    return <Badge variant="outline">{stage}</Badge>;
}

export default function SaasPortfolioClientPage({ saasProducts }: { saasProducts: SaasCategory[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredProducts = useMemo(() => {
        let products: SaaSProduct[] = saasProducts.flatMap(cat => cat.products);

        if (selectedCategory !== 'All') {
            products = products.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return products;
    }, [searchTerm, selectedCategory, saasProducts]);

    const allCategories = ['All', ...saasProducts.map(c => c.name)];

    return (
         <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">SaaS Portfolio</h1>
                <p className="text-muted-foreground">
                    Browse, search, and filter through all {saasProducts.flatMap(c => c.products).length} of our current digital product initiatives.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Digital Products & SaaS Platforms</CardTitle>
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or description..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[280px]">
                                <SelectValue placeholder="Filter by category..." />
                            </SelectTrigger>
                            <SelectContent>
                                {allCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ready</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map(product => (
                                <TableRow key={product.name}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground text-sm max-w-sm">{product.description}</TableCell>
                                    <TableCell>{getStageBadge(product.stage)}</TableCell>
                                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                                    <TableCell>{product.ready ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
