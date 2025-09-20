
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge } from '@/components/stage-badge';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products.schema';

export default function ProductShowcase({ products }: { products: Product[] }) {
  const enabledProducts = products.filter(p => p.enabled);

  return (
    <section id="products" className="py-16 md:py-24 bg-white">
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
                    <Button variant="outline">Learn More</Button>
                    </CardFooter>
                </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
