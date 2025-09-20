
'use client';

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/products.schema';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductsData } from '@/hooks/use-global-store-data';

const getStatusBadge = (status?: string) => {
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
            return <Badge variant="outline">N/A</Badge>;
    }
};

const getStageBadge = (stage: string) => {
    return <Badge variant="outline">{stage}</Badge>;
}

export default function SaasPortfolioPage() {
  const { products } = useProductsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
      let productList: Product[] = products;

      if (selectedCategory !== 'All') {
          productList = productList.filter(p => p.category === selectedCategory);
      }

      if (searchTerm) {
          productList = productList.filter(p =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
      }

      return productList;
  }, [searchTerm, selectedCategory, products]);
  
  const allCategories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);


  return (
    <div className="space-y-8">
      <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">SaaS Portfolio</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse the complete portfolio of all digital products and SaaS platforms.
          </p>
        </div>
        <div className="mt-12">
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product: Product) => (
                                <TableRow key={product.name}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground text-sm max-w-sm">{product.description}</TableCell>
                                    <TableCell>{getStageBadge(product.stage)}</TableCell>
                                    <TableCell>{getStatusBadge(product.adminStatus)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
