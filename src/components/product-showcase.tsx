

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const StageBadge = ({ stage }: { stage: string }) => {
    const getStageColor = () => {
        switch (stage.toLowerCase()) {
            case 'ready':
                return 'bg-green-500 hover:bg-green-600';
            case 'live & operating':
                return 'bg-green-600 hover:bg-green-700';
            case 'launch phase':
                return 'bg-emerald-500 hover:bg-emerald-600';
            case 'post-launch phase':
                return 'bg-teal-500 hover:bg-teal-600';
            case 'development phase':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'testing phase':
                return 'bg-sky-500 hover:bg-sky-600';
            case 'design phase':
                return 'bg-indigo-500 hover:bg-indigo-600';
             case 'validation phase':
                return 'bg-yellow-500 hover:bg-yellow-600 text-black';
            case 'planning phase':
                return 'bg-orange-500 hover:bg-orange-600';
            case 'idea phase':
                return 'bg-rose-500 hover:bg-rose-600';
            case 'research phase':
                return 'bg-purple-500 hover:bg-purple-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    }
    return (
        <Badge variant="default" className={`absolute top-2 right-2 border-none text-white ${getStageColor()}`}>
            {stage}
        </Badge>
    )
}


export default function ProductShowcase({ products: managedProducts }: { products: Product[] }) {
  
  const enabledProducts = managedProducts.filter(p => p.enabled);

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
                        src={product.image}
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
