

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useCartData } from '@/hooks/use-global-store-data';
import type { CartItem } from '@/lib/global-store';
import { useSettingsData } from '@/hooks/use-global-store-data';

export default function CartPage() {
    const { cart, setCart } = useCartData();
    const { toast } = useToast();
    const { settings } = useSettingsData();

    const handleUpdateQuantity = (id: number, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== id);
            }
            return prevCart.map(item =>
                item.id === id ? { ...item, quantity } : item
            );
        });
    };

    const handleRemoveItem = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
        toast({ title: 'Item removed from cart.' });
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 5.00 : 0; // Flat shipping rate
    const vatAmount = settings.vat.enabled ? (subtotal + shipping) * settings.vat.rate : 0;
    const total = subtotal + shipping + vatAmount;

    return (
        <div className="bg-muted/20 min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl flex items-center gap-3">
                                <ShoppingCart className="h-8 w-8" />
                                Your Shopping Cart
                            </CardTitle>
                            <CardDescription>Review the items in your cart before proceeding to checkout.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {cart.length > 0 ? (
                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead className="text-center">Quantity</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cart.map(item => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="flex items-center gap-4">
                                                            <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
                                                            <div>
                                                                <p className="font-medium">{item.name}</p>
                                                                <p className="text-sm text-muted-foreground">OMR {item.price.toFixed(2)}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                                                <span className="font-bold w-6 text-center">{item.quantity}</span>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">OMR {(item.price * item.quantity).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="lg:col-span-1">
                                        <Card className="bg-muted/50">
                                            <CardHeader>
                                                <CardTitle>Order Summary</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3 text-sm">
                                                <div className="flex justify-between"><span>Subtotal</span><span>OMR {subtotal.toFixed(2)}</span></div>
                                                <div className="flex justify-between"><span>Shipping</span><span>OMR {shipping.toFixed(2)}</span></div>
                                                {settings.vat.enabled && (
                                                    <div className="flex justify-between">
                                                        <span>VAT ({settings.vat.rate * 100}%)</span>
                                                        <span>OMR {vatAmount.toFixed(2)}</span>
                                                    </div>
                                                 )}
                                                <hr className="my-2" />
                                                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>OMR {total.toFixed(2)}</span></div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button asChild className="w-full" size="lg">
                                                    <Link href="/ecommerce/checkout">
                                                        <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                                    <Button asChild variant="outline">
                                        <Link href="/ecommerce">
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
