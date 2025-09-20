
'use client';

import { useState, useMemo, useEffect } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Gift, CheckCircle, Send } from 'lucide-react';
import type { GiftCard } from '@/lib/gift-cards.schema';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useGiftCardsData } from "@/hooks/use-global-store-data";

const GiftCardSchema = z.object({
  design: z.enum(['Generic', 'Birthday', 'Thank You', 'Holiday']),
  amount: z.coerce.number().min(5, "Minimum amount is OMR 5.").max(500, "Maximum amount is OMR 500."),
  recipientName: z.string().min(2, "Recipient's name is required."),
  recipientEmail: z.string().email("A valid email is required."),
  senderName: z.string().min(2, "Your name is required."),
  message: z.string().max(200, "Message must be 200 characters or less.").optional(),
});
type GiftCardValues = z.infer<typeof GiftCardSchema>;

const designImages = {
    'Generic': 'https://images.unsplash.com/photo-1574484284004-24cd4b2a752a?q=80&w=600&auto=format&fit=crop',
    'Birthday': 'https://images.unsplash.com/photo-1576883587853-d1604117e43b?q=80&w=600&auto=format&fit=crop',
    'Thank You': 'https://images.unsplash.com/photo-1589391886822-81cff8842187?q=80&w=600&auto=format&fit=crop',
    'Holiday': 'https://images.unsplash.com/photo-1513297884279-d17b29b6e510?q=80&w=600&auto=format&fit=crop',
};

export default function HadeeyaPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [submittedCard, setSubmittedCard] = useState<GiftCard | null>(null);
    const { setGiftCards } = useGiftCardsData();
    const { toast } = useToast();
    
    const form = useForm<GiftCardValues>({
        resolver: zodResolver(GiftCardSchema),
        defaultValues: {
            design: 'Generic',
            amount: 25,
        },
    });
    
    const watchDesign = form.watch('design');

    const onSubmit: SubmitHandler<GiftCardValues> = async (data) => {
        setIsLoading(true);
        // Simulate API call and card generation
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newCard: GiftCard = {
            id: `gc_${Date.now()}`,
            code: [...Array(16)].map(() => Math.floor(Math.random() * 10)).join('').replace(/(\d{4})/g, '$1 ').trim(),
            ...data,
            status: 'Active',
            issueDate: new Date().toISOString(),
        };

        setGiftCards(prev => [...prev, newCard]);
        setSubmittedCard(newCard);
        
        toast({ title: "Success!", description: `Your gift card for ${newCard.recipientName} has been created and sent.` });
        setIsLoading(false);
        form.reset();
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Gift className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Hadeeya Digital Gift Cards</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        The perfect gift for any occasion. Create and send a personalized digital gift card in minutes.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mt-12">
                   {submittedCard ? (
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
                                    <CheckCircle className="h-12 w-12 text-green-500" />
                                </div>
                                <CardTitle className="text-2xl">Gift Card Sent!</CardTitle>
                                <CardDescription>
                                    Your gift card for <strong>OMR {submittedCard.amount.toFixed(2)}</strong> has been successfully sent to <strong>{submittedCard.recipientEmail}</strong>.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <p className="text-muted-foreground">Thank you for using Hadeeya!</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => setSubmittedCard(null)}>Create Another Gift Card</Button>
                            </CardFooter>
                        </Card>
                   ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Create a New Gift Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <FormField control={form.control} name="design" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>1. Choose a Design</FormLabel>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                                                    {Object.keys(designImages).map(design => (
                                                        <FormItem key={design}>
                                                            <FormControl>
                                                                <RadioGroupItem value={design} id={design} className="sr-only"/>
                                                            </FormControl>
                                                            <Label htmlFor={design} className={cn('block rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground cursor-pointer', field.value === design && 'border-primary ring-2 ring-primary')}>
                                                                <Image src={designImages[design as keyof typeof designImages]} alt={`${design} design`} width={200} height={100} className="rounded-sm object-cover aspect-video" />
                                                                <span className="block text-center text-sm p-1">{design}</span>
                                                            </Label>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="amount" render={({ field }) => (
                                            <FormItem><FormLabel>2. Enter Amount (OMR)</FormLabel><FormControl><Input type="number" min="5" max="500" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                         <FormField control={form.control} name="message" render={({ field }) => (
                                            <FormItem><FormLabel>3. Add a Message (Optional)</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                    </div>
                                    <div className="space-y-6">
                                         <FormField control={form.control} name="recipientName" render={({ field }) => (
                                            <FormItem><FormLabel>4. Recipient's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                         <FormField control={form.control} name="recipientEmail" render={({ field }) => (
                                            <FormItem><FormLabel>5. Recipient's Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                         <FormField control={form.control} name="senderName" render={({ field }) => (
                                            <FormItem><FormLabel>6. Your Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                         <Button type="submit" className="w-full !mt-10" size="lg" disabled={isLoading}>
                                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : <><Send className="mr-2 h-4 w-4"/> Purchase & Send Gift Card</>}
                                         </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                   )}
                </div>
            </div>
        </div>
    );
}
