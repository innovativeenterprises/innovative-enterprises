
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { store } from '@/lib/global-store';
import type { CartItem } from '@/lib/global-store';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CheckoutSchema = z.object({
  // Shipping Information
  fullName: z.string().min(3, "Full name is required."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  country: z.string().min(2, "Country is required."),
  postalCode: z.string().min(3, "Postal code is required."),
  
  // Payment Information
  cardholderName: z.string().min(3, 'Cardholder name is required.'),
  cardNumber: z.string().length(19, 'Card number must be 16 digits formatted as 0000 0000 0000 0000.'),
  expiryDate: z.string().length(5, 'Expiry date must be in MM/YY format.'),
  cvc: z.string().length(3, 'CVC must be 3 digits.'),
});

type CheckoutValues = z.infer<typeof CheckoutSchema>;

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const updateCart = () => setCartItems(store.get().cart);
        updateCart();
        const unsubscribe = store.subscribe(updateCart);
        if (store.get().cart.length === 0) {
            router.push('/ecommerce');
        }
        return () => unsubscribe();
    }, [router]);

    const form = useForm<CheckoutValues>({
        resolver: zodResolver(CheckoutSchema),
        defaultValues: {
            country: 'Oman',
        }
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + shipping;

    const onSubmit: SubmitHandler<CheckoutValues> = async (data) => {
        setIsLoading(true);
        console.log("Processing order:", {
            shippingDetails: {
                fullName: data.fullName,
                address: data.address,
                city: data.city,
                country: data.country,
                postalCode: data.postalCode,
            },
            paymentCardNumber: data.cardNumber.slice(-4), // Only log last 4 digits
            orderItems: cartItems,
            total,
        });

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({ title: "Payment Successful!", description: "Your order has been placed." });
        store.set(state => ({ ...state, cart: [] }));
        router.push('/ecommerce/checkout/success');
        setIsLoading(false);
    };

    return (
        <div className="bg-muted/20 min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <Card>
                                        <CardHeader><CardTitle>Shipping Information</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="address" render={({ field }) => (
                                                <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <div className="grid grid-cols-3 gap-4">
                                                <FormField control={form.control} name="city" render={({ field }) => (
                                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="country" render={({ field }) => (
                                                    <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="postalCode" render={({ field }) => (
                                                    <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                     <Card>
                                        <CardHeader><CardTitle>Payment Information</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                             <FormField control={form.control} name="cardholderName" render={({ field }) => (
                                                <FormItem><FormLabel>Cardholder Name</FormLabel><FormControl><Input placeholder="Name on Card" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                                <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                                    <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                                <FormField control={form.control} name="cvc" render={({ field }) => (
                                                    <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Payment...</>
                                        ) : (
                                            <><Lock className="mr-2 h-5 w-5" /> Pay OMR {total.toFixed(2)} Securely</>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                        <div>
                             <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                     <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md object-cover" />
                                                     <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{item.quantity}</span>
                                                </div>
                                                <p className="font-medium text-sm">{item.name}</p>
                                            </div>
                                            <p className="text-sm font-medium">OMR {(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                    <hr className="my-4" />
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span>Subtotal</span><span>OMR {subtotal.toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span>Shipping</span><span>OMR {shipping.toFixed(2)}</span></div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>OMR {total.toFixed(2)}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
