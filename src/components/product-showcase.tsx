
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge } from '@/components/stage-badge';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products.schema';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { useCartData } from '@/hooks/use-data-hooks';


export default function ProductShowcase({ products }: { products: Product[] }) {
  const enabledProducts = products.filter(p => p.enabled);
  const { toast } = useToast();
  const { setCart } = useCartData();
  
  const handleAddToCart = (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        if (existingItem) {
            return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        }
        return [...prevCart, { ...product, quantity: 1 }]
    });
    toast({
        title: "Added to Cart!",
        description: `1 x "${product.name}" has been added to your shopping cart.`,
    });
  };

  return (
    <section id="products" className="py-16 md:py-24 bg-muted/20 dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Products</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our innovative products designed to solve real-world challenges.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enabledProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <Link href={product.href || `/ecommerce/${product.id}`} className="flex flex-col h-full">
                    <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                        <Image
                        src={product.image!}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={product.aiHint}
                        />
                        {product.stage && <StageBadge stage={product.stage} />}
                    </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                    <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                    {product.category === 'Electronics' ? (
                       <Button className="w-full" onClick={(e) => handleAddToCart(product, e)}>
                            <ShoppingCart className="mr-2 h-4 w-4"/>
                            Add to Cart
                        </Button>
                    ) : (
                        <Button variant="outline" className="w-full">Learn More</Button>
                    )}
                    </CardFooter>
                </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
