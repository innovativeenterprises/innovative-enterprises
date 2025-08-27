'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Search, SlidersHorizontal, Star, Tag, Truck, Filter, Bot } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

const categories = [
    { name: "Electronics", icon: <SlidersHorizontal /> },
    { name: "Apparel", icon: <SlidersHorizontal /> },
    { name: "Home Goods", icon: <SlidersHorizontal /> },
    { name: "Books", icon: <SlidersHorizontal /> },
    { name: "Sports", icon: <SlidersHorizontal /> },
    { name: "Beauty", icon: <SlidersHorizontal /> },
];

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 129.99,
        image: "https://picsum.photos/400/400?random=1",
        aiHint: "headphones product",
        rating: 4.5,
    },
    {
        id: 2,
        name: "Modern Coffee Table",
        category: "Home Goods",
        price: 249.00,
        image: "https://picsum.photos/400/400?random=2",
        aiHint: "coffee table",
        rating: 4.8,
    },
    {
        id: 3,
        name: "Performance Running Shoes",
        category: "Sports",
        price: 89.95,
        image: "https://picsum.photos/400/400?random=3",
        aiHint: "running shoes",
        rating: 4.7,
    },
    {
        id: 4,
        name: "Organic Cotton T-Shirt",
        category: "Apparel",
        price: 24.50,
        image: "https://picsum.photos/400/400?random=4",
        aiHint: "cotton t-shirt",
        rating: 4.9,
    },
     {
        id: 5,
        name: "Smartwatch Series 8",
        category: "Electronics",
        price: 399.00,
        image: "https://picsum.photos/400/400?random=5",
        aiHint: "smartwatch product",
        rating: 4.9,
    },
    {
        id: 6,
        name: "Leather Backpack",
        category: "Apparel",
        price: 150.00,
        image: "https://picsum.photos/400/400?random=6",
        aiHint: "leather backpack",
        rating: 4.6,
    },
    {
        id: 7,
        name: "Non-stick Cookware Set",
        category: "Home Goods",
        price: 199.99,
        image: "https://picsum.photos/400/400?random=7",
        aiHint: "cookware set",
        rating: 4.7,
    },
    {
        id: 8,
        name: "The Alchemist",
        category: "Books",
        price: 12.99,
        image: "https://picsum.photos/400/400?random=8",
        aiHint: "book cover",
        rating: 4.8,
    },
];

const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
        <CardContent className="p-4">
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
        <CardFooter className="p-4 pt-0">
            <Button className="w-full">Add to Cart</Button>
        </CardFooter>
    </Card>
);

export default function EcommercePage() {
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
                                    <Link href="#" key={cat.name} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                        {cat.name}
                                    </Link>
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
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
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
