
'use client';

import { notFound } from 'next/navigation';
import { initialProducts } from '@/lib/products';
import type { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { ArrowLeft, Star, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const RelatedProductCard = ({ product }: { product: Product }) => (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <Link href={`/ecommerce/${product.id}`}>
            <div className="relative h-40 w-full">
                <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <CardContent className="p-3">
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <h3 className="font-semibold text-sm truncate mt-1">{product.name}</h3>
                <p className="font-bold text-md text-primary mt-1">OMR {product.price.toFixed(2)}</p>
            </CardContent>
        </Link>
    </Card>
);


export default function ProductDetailPage({ params }: { params: { id: string }}) {
    const [quantity, setQuantity] = useState(1);
    const { toast } = useToast();
    const product = initialProducts.find(p => p.id === parseInt(params.id, 10));

    if (!product) {
        return notFound();
    }
    
    const handleAddToCart = () => {
        toast({
            title: "Added to Cart!",
            description: `${quantity} x "${product.name}" has been added to your shopping cart.`,
        })
    }

    const relatedProducts = initialProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

    return (
        <div className="bg-muted/20 min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <Button variant="ghost" asChild className="mb-8">
                    <Link href="/ecommerce">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shop
                    </Link>
                </Button>
                <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                        <Card className="overflow-hidden">
                            <div className="relative aspect-square w-full">
                                <Image 
                                    src={product.image} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Badge variant="outline">{product.category}</Badge>
                        <h1 className="text-4xl font-bold text-primary">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                                ))}
                                <span className="text-sm font-medium ml-2">{product.rating} / 5.0</span>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground">
                            {product.description}
                        </p>
                        <p className="text-4xl font-extrabold text-foreground">OMR {product.price.toFixed(2)}</p>
                        
                        <Separator />

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                           <div className="flex items-center gap-2 border rounded-md p-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
                           </div>
                            <Button size="lg" className="w-full sm:w-auto" onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-center mb-10">Related Products</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {relatedProducts.map(p => <RelatedProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
