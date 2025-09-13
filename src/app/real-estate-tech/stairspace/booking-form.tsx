

'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from "lucide-react";
import Image from 'next/image';
import { store } from '@/lib/global-store';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import { setStairspaceRequests } from '@/hooks/use-global-store-data';


const BookingSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(5, "A valid phone number is required"),
  message: z.string().optional(),
});
type BookingValues = z.infer<typeof BookingSchema>;

// For demonstration purposes, we'll simulate a logged-in user's data.
// In a real application, this would come from your authentication context.
const loggedInUser = {
    fullName: "Anwar Ahmed",
    email: "anwar.ahmed@example.com",
    phone: "+968 99887766"
};

export const BookingRequestForm = ({ listing, isOpen, onOpenChange, onClose }: { listing: StairspaceListing, isOpen: boolean, onOpenChange: (open: boolean) => void, onClose: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<BookingValues>({
        resolver: zodResolver(BookingSchema),
        // Pre-fill the form with the logged-in user's data
        defaultValues: {
            fullName: loggedInUser.fullName,
            email: loggedInUser.email,
            phone: loggedInUser.phone,
            message: "",
        }
    });

    // Reset form when the dialog opens/closes
    useEffect(() => {
        if(isOpen) {
            form.reset({
                fullName: loggedInUser.fullName,
                email: loggedInUser.email,
                phone: loggedInUser.phone,
                message: "",
            });
        }
    }, [isOpen, form]);

    const onSubmit: SubmitHandler<BookingValues> = async (data) => {
        setIsLoading(true);
        console.log("Submitting booking request for:", listing.title, "Data:", data);
        
        const newRequest: BookingRequest = {
            id: `req_${listing.id}_${Date.now()}`,
            listingId: listing.id,
            listingTitle: listing.title,
            clientName: data.fullName,
            clientEmail: data.email,
            clientPhone: data.phone,
            message: data.message,
            requestDate: new Date().toISOString(),
            status: 'Pending'
        };

        setStairspaceRequests(prev => [newRequest, ...prev]);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({ title: "Booking Request Submitted!", description: `Your request for "${listing.title}" has been sent. The owner will contact you shortly.` });
        setIsLoading(false);
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) onClose();
        }}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Request to Book: {listing.title}</DialogTitle>
                    <DialogDescription>
                        Please confirm your contact information. The space owner will contact you to confirm availability and payment.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <div className="relative h-48 w-full overflow-hidden rounded-lg">
                             <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground">{listing.location}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">{listing.price}</p>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="message" render={({ field }) => (
                                <FormItem><FormLabel>Message (Optional)</FormLabel><FormControl><Textarea rows={3} placeholder="Any specific dates or questions?" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <DialogFooter className="pt-4">
                                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Submit Request</>}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
