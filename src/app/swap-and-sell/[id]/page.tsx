
'use client';

import { useParams, notFound } from 'next/navigation';
import { useUsedItemsData } from '@/hooks/use-global-store-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { ArrowLeft, Tag, Info, User, DollarSign, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';
import { initialUsedItems, type UsedItem } from '@/lib/used-items.schema';

export async function generateStaticParams() {
  return initialUsedItems.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = initialUsedItems.find(i => i.id === params.id);

  if (!item) {
    return {
      title: 'Item Not Found',
    };
  }

  return {
    title: `${item.name} | Swap & Sell Hub`,
    description: item.description,
  };
}

export default function ItemDetailPage() {
    const params = useParams();
    const { id } = params;
    const { items, isClient } = useUsedItemsData();
    const [item, setItem] = useState<UsedItem | undefined>(undefined);

    useEffect(() => {
        if (isClient && id) {
            const foundItem = items.find(i => i.id === id);
            if (foundItem) {
                setItem(foundItem);
            } else {
                notFound();
            }
        }
    }, [id, items, isClient]);

     if (!isClient || !item) {
        return (
             <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <Skeleton className="h-10 w-40 mb-8" />
                    <Skeleton className="h-[600px] w-full" />
                </div>
            </div>
        )
    }
    
    const details = [
        { icon: Tag, label: 'Category', value: item.category },
        { icon: Info, label: 'Condition', value: item.condition },
        { icon: User, label: 'Seller', value: item.seller },
    ];

    return (
        <div className="bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <Button asChild variant="outline">
                            <Link href="/swap-and-sell">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Marketplace
                            </Link>
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <div className="grid lg:grid-cols-2">
                                <div className="relative h-80 lg:h-full min-h-[400px]">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none" />
                                </div>
                                <div className="p-8 flex flex-col">
                                    <CardHeader className="p-0 space-y-2">
                                        <Badge variant="outline" className="w-fit">{item.listingType}</Badge>
                                        <CardTitle className="text-3xl font-bold">{item.name}</CardTitle>
                                    </CardHeader>
                                    <div className="py-6 flex-grow">
                                        <p className="text-foreground/80">{item.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 my-4">
                                        {details.map(detail => (
                                            <div key={detail.label} className="flex items-center gap-3">
                                                <detail.icon className="h-6 w-6 text-primary" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">{detail.label}</p>
                                                    <p className="font-semibold">{detail.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t">
                                        <p className="text-sm text-muted-foreground">Price</p>
                                        <p className="text-4xl font-extrabold text-primary">OMR {item.price.toFixed(2)}</p>
                                    </div>
                                    <CardFooter className="p-0 pt-6">
                                        <Button size="lg" className="w-full">
                                            <MessageCircle className="mr-2 h-5 w-5" /> Contact Seller
                                        </Button>
                                    </CardFooter>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
