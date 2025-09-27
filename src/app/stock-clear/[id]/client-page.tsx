
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { ArrowLeft, Calendar, Package, Scale, ShoppingCart, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import type { StockItem } from '@/lib/stock-items.schema';
import { notFound } from 'next/navigation';

const CountdownTimer = ({ endDate }: { endDate: string }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(endDate);
            const distance = end.getTime() - now.getTime();

            if (distance < 0) {
                setTimeLeft("Auction Ended");
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    return <p className="text-2xl font-bold text-destructive">{timeLeft}</p>;
}

export default function StockItemDetailClientPage({ item }: { item?: StockItem }) {

    if (!item) {
        notFound();
    }
    
    const details = [
        { icon: Package, label: 'Quantity', value: item.quantity },
        { icon: Tag, label: 'Category', value: item.category },
        { icon: Scale, label: 'Sale Type', value: item.saleType },
        { icon: Calendar, label: 'Expiry Date', value: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A' },
    ];

    return (
        <div className="bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <Button asChild variant="outline">
                            <Link href="/stock-clear">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Marketplace
                            </Link>
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <div className="grid lg:grid-cols-2">
                                <div className="relative h-80 lg:h-full min-h-[400px]">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none" data-ai-hint={item.aiHint} />
                                </div>
                                <div className="p-8 flex flex-col">
                                    <CardHeader className="p-0 space-y-2">
                                        <Badge variant="outline" className="w-fit">{item.category}</Badge>
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
                                        {item.saleType === 'Auction' && item.auctionEndDate ? (
                                            <div>
                                                 <p className="text-sm text-muted-foreground">Auction Ends In</p>
                                                 <CountdownTimer endDate={item.auctionEndDate} />
                                            </div>
                                        ) : (
                                             <div>
                                                <p className="text-sm text-muted-foreground">Lot Price</p>
                                                <p className="text-4xl font-extrabold text-primary">OMR {item.price.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                    <CardFooter className="p-0 pt-6">
                                        <Button size="lg" className="w-full">
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            {item.saleType === 'Auction' ? 'Place Bid' : 'Purchase Lot'}
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
