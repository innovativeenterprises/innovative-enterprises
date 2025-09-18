
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { type PosProduct } from "@/lib/pos-data.schema";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import Image from "next/image";

export function PosGrid({ products, onAddToCart }: { products: PosProduct[], onAddToCart: (product: PosProduct) => void }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return products;
        }
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                    <Card
                        key={product.id}
                        className="cursor-pointer hover:border-primary transition-colors flex flex-col"
                        onClick={() => onAddToCart(product)}
                    >
                        <CardHeader className="p-0">
                             <div className="relative aspect-square w-full">
                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-t-lg" />
                             </div>
                        </CardHeader>
                        <CardContent className="p-3 flex-grow">
                            <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                            <p className="text-sm font-bold text-primary">OMR {product.price.toFixed(2)}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
