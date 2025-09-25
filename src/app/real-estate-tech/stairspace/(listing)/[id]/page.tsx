
'use client';

import { useParams, notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { ArrowLeft, MapPin, DollarSign, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import { Skeleton } from '@/components/ui/skeleton';
import { getStairspaceListings } from '@/lib/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// --- BookingRequestForm Logic ---
const RequestSchema = z.object({
  clientName: z.string().min(3, "Name is required."),
  clientEmail: z.string().email("A valid email is required."),
  clientPhone: z.string().min(8, "A valid phone number is required."),
  message: z.string().optional(),
});
type RequestValues = z.infer<typeof RequestSchema>;

const BookingRequestForm = ({ listing, isOpen, onOpenChange, onClose }: {
    listing: StairspaceListing;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
}) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<RequestValues>({
        resolver: zodResolver(RequestSchema),
    });

    const onSubmit: SubmitHandler<RequestValues> = async (data) => {
        setIsSubmitting(true);
        console.log("Booking Request:", { listingId: listing.id, ...data });
        await new Promise(res => setTimeout(res, 1500));
        toast({
            title: "Request Sent!",
            description: "Your booking request has been sent to the space owner. They will contact you shortly.",
        });
        setIsSubmitting(false);
        onClose();
        router.push('/real-estate-tech/stairspace/my-requests');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request to Book: {listing.title}</DialogTitle>
                    <DialogDescription>
                        Please provide your contact details. The space owner will contact you to confirm availability and arrange payment.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="clientName" render={({ field }) => (
                            <FormItem><FormLabel>Your Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="clientEmail" render={({ field }) => (
                            <FormItem><FormLabel>Your Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="clientPhone" render={({ field }) => (
                            <FormItem><FormLabel>Your Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem><FormLabel>Message (Optional)</FormLabel><FormControl><Textarea placeholder="Include any questions or specific requirements you have..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><Send className="mr-2 h-4 w-4"/>Send Request</>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};


// --- Main Page Component ---
export default function StairspaceDetailPage() {
    const params = useParams();
    const { id } = params;
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [listing, setListing] = useState<StairspaceListing | undefined>(undefined);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        async function fetchListing() {
            const listings = await getStairspaceListings();
            const foundListing = listings.find(l => l.id === id);
            if (foundListing) {
                setListing(foundListing);
            } else {
                notFound();
            }
        }
        if (id) {
            fetchListing();
        }
    }, [id]);

    if (!isClient || !listing) {
        return (
             <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-[500px] w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                        <Button asChild variant="outline">
                            <Link href="/real-estate-tech/stairspace">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Listings
                            </Link>
                        </Button>
                    </div>
                    <Card className="overflow-hidden">
                        <div className="grid lg:grid-cols-5">
                            <div className="lg:col-span-3 relative min-h-[300px] lg:min-h-[500px]">
                                <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover" />
                            </div>
                            <div className="lg:col-span-2 p-8 flex flex-col">
                                <div className="flex-grow">
                                    <CardHeader className="p-0">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {listing.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                                        </div>
                                        <CardTitle className="text-3xl font-bold">{listing.title}</CardTitle>
                                        <CardDescription className="text-lg flex items-center gap-2 pt-1 text-muted-foreground">
                                            <MapPin className="h-5 w-5" /> {listing.location}
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="py-6 space-y-4">
                                        <p className="text-foreground/80">
                                            This unique space is perfect for entrepreneurs looking to launch a pop-up, test a product, or operate a micro-business with high visibility and low overhead.
                                        </p>
                                        <div className="border-t pt-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Availability:</span>
                                                <span className="font-semibold">Immediate</span>
                                            </div>
                                             <div className="flex justify-between">
                                                <span className="text-muted-foreground">Minimum Rental:</span>
                                                <span className="font-semibold">1 Day</span>
                                            </div>
                                             <div className="flex justify-between">
                                                <span className="text-muted-foreground">Ideal For:</span>
                                                <span className="font-semibold">Retail, Showcases, Art</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t">
                                    <p className="text-sm text-muted-foreground">Rental Price</p>
                                    <p className="text-4xl font-extrabold text-primary">{listing.price}</p>
                                    <CardFooter className="p-0 pt-6">
                                        <Button size="lg" className="w-full" onClick={() => setIsFormOpen(true)}>
                                            <DollarSign className="mr-2 h-5 w-5" /> Request to Book
                                        </Button>
                                    </CardFooter>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                 {isFormOpen && (
                    <BookingRequestForm 
                        listing={listing}
                        isOpen={isFormOpen}
                        onOpenChange={setIsFormOpen}
                        onClose={() => setIsFormOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
