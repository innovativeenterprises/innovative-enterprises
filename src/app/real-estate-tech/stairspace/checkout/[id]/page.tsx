
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { store } from '@/lib/global-store';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { StairspaceListing } from '@/lib/stairspace-listings';
import { Loader2, Lock, ArrowLeft, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useStairspaceData, useStairspaceRequestsData } from '@/hooks/use-global-store-data';

const CheckoutSchema = z.object({
  cardholderName: z.string().min(3, 'Cardholder name is required.'),
  cardNumber: z.string().length(19, 'Card number must be 16 digits formatted as 0000 0000 0000 0000.'),
  expiryDate: z.string().length(5, 'Expiry date must be in MM/YY format.'),
  cvc: z.string().length(3, 'CVC must be 3 digits.'),
});
type CheckoutValues = z.infer<typeof CheckoutSchema>;

export default function StairspaceCheckoutPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const { stairspaceRequests, setStairspaceRequests, isClient: isRequestsClient } = useStairspaceRequestsData();
    const { stairspaceListings, isClient: isListingsClient } = useStairspaceData();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const request = stairspaceRequests.find(r => r.id === id);
    const listing = request ? stairspaceListings.find(l => l.id === request.listingId) : undefined;
    
    const isClient = isRequestsClient && isListingsClient;

    const form = useForm<CheckoutValues>({
        resolver: zodResolver(CheckoutSchema),
        defaultValues: {
            cardholderName: 'Anwar Ahmed',
            cardNumber: '',
            expiryDate: '',
            cvc: '',
        }
    });

    if (!isClient) {
        return (
             <div className="bg-muted/20 min-h-[calc(100vh-8rem)]">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-xl mx-auto space-y-4">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (!request || !listing) {
        return notFound();
    }
    
    const priceAmount = parseFloat(listing.price.replace(/[^0-9.-]+/g,""));

    const onSubmit: SubmitHandler<CheckoutValues> = async (data) => {
        setIsLoading(true);
        console.log("Processing booking payment:", {
            requestId: request.id,
            listingId: listing.id,
            amount: priceAmount,
        });

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update request status to 'Confirmed'
        setStairspaceRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'Confirmed' } : r));

        toast({ title: "Payment Successful!", description: "Your booking has been confirmed." });
        router.push(`/real-estate-tech/stairspace/checkout/success?requestId=${request.id}`);
        setIsLoading(false);
    };
    
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        form.setValue('cardNumber', formattedValue.slice(0, 19));
    };
    
    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        form.setValue('expiryDate', value.slice(0, 5));
    };

    return (
        <div className="bg-muted/20 min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-xl mx-auto">
                     <Button asChild variant="outline" className="mb-4">
                        <Link href="/real-estate-tech/stairspace/my-requests">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to My Requests
                        </Link>
                    </Button>
                    <Card>
                        <CardHeader>
                            <CardTitle>Complete Your Booking</CardTitle>
                            <CardDescription>Finalize the payment for "{listing.title}".</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                     <Card className="bg-background">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Booking Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Listing:</span><span className="font-medium">{listing.title}</span></div>
                                            <div className="flex justify-between"><span>Location:</span><span className="font-medium">{listing.location}</span></div>
                                            <div className="flex justify-between"><span>Rental Price:</span><span className="font-medium">{listing.price}</span></div>
                                            <hr className="my-2" />
                                            <div className="flex justify-between font-bold text-lg"><span>Total Due:</span><span className="text-primary">OMR {priceAmount.toFixed(2)}</span></div>
                                        </CardContent>
                                    </Card>
                                     <div>
                                        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                                        <div className="space-y-4">
                                            <FormField control={form.control} name="cardholderName" render={({ field }) => (
                                                <FormItem><FormLabel>Cardholder Name</FormLabel><FormControl><Input placeholder="Name on Card" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                                <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="0000 0000 0000 0000" {...field} onChange={handleCardNumberChange} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                                    <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} onChange={handleExpiryDateChange} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                                <FormField control={form.control} name="cvc" render={({ field }) => (
                                                    <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                                        ) : (
                                            <><Lock className="mr-2 h-5 w-5" /> Pay OMR {priceAmount.toFixed(2)} Securely</>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
