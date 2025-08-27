

'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Search, Star, Filter, Bot, ShoppingCart } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useProductsData } from '@/app/admin/product-table';
import type { Product } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { store } from '@/lib/global-store';
import type { CartItem } from '@/lib/global-store';

const categories = [
    "All",
    "Electronics",
    "Apparel",
    "Home Goods",
    "Books",
    "Sports",
    "Beauty",
];

const ProductCard = ({ product }: { product: Product }) => {
    const { toast } = useToast();

    const handleAddToCart = () => {
        store.set(state => {
            const existingItem = state.cart.find(item => item.id === product.id);
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                }
            }
            return {
                ...state,
                cart: [...state.cart, { ...product, quantity: 1 }]
            }
        });
        toast({
            title: "Added to Cart!",
            description: `1 x "${product.name}" has been added to your shopping cart.`,
        });
    };
    
    return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <Link href={`/ecommerce/${product.id}`} className="flex-grow flex flex-col">
            <CardHeader className="p-0">
                <div className="relative h-64 w-full">
                    <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={product.aiHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <h3 className="font-semibold text-lg truncate mt-1">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                    <p className="font-bold text-xl text-primary">OMR {product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                </div>
            </CardContent>
        </Link>
        <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4"/>
                Add to Cart
            </Button>
        </CardFooter>
    </Card>
)};

export default function EcommercePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { products } = useProductsData();

  const filteredProducts = selectedCategory === 'All'
    ? products.filter(p => p.enabled)
    : products.filter(product => product.enabled && product.category === selectedCategory);

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
        <section className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-primary">Nova Commerce</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Your destination for quality products and seamless shopping. Explore our curated collections.
                </p>
                <div className="mt-8 max-w-xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search for products..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border bg-background"
                        />
                    </div>
                </div>
                 <div className="mt-6">
                    <Button asChild variant="ghost" className="text-primary hover:text-primary">
                        <Link href="/ecommerce/chat">
                            <Bot className="mr-2 h-4 w-4" /> Ask Nova, our AI shopping assistant
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Categories</h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <Button
                                      key={cat}
                                      variant={selectedCategory === cat ? 'secondary' : 'ghost'}
                                      className="w-full justify-start"
                                      onClick={() => setSelectedCategory(cat)}
                                    >
                                      {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2">Price Range</h3>
                            {/* Placeholder for price range slider */}
                            <div className="h-10 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                                Price Slider
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </aside>
            <main className="lg:col-span-3">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
                 <div className="mt-12 text-center">
                    <Button variant="outline">Load More Products</Button>
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}
