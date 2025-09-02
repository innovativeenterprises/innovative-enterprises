
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Asset } from "@/lib/assets";
import { Loader2, Send } from "lucide-react";
import Image from 'next/image';

const RentalSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  companyName: z.string().optional(),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(5, "A valid phone number is required"),
  rentalMonths: z.coerce.number().min(1, "Minimum rental is 1 month"),
  notes: z.string().optional(),
});
type RentalValues = z.infer<typeof RentalSchema>;

export const RentalRequestForm = ({ asset, isOpen, onOpenChange, onClose }: { asset: Asset, isOpen: boolean, onOpenChange: (open: boolean) => void, onClose: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<RentalValues>({
        resolver: zodResolver(RentalSchema),
        defaultValues: {
            fullName: "",
            companyName: "",
            email: "",
            phone: "",
            rentalMonths: 1,
            notes: "",
        }
    });

    const onSubmit: SubmitHandler<RentalValues> = async (data) => {
        setIsLoading(true);
        console.log("Submitting rental request for:", asset.name, "Data:", data);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({ title: "Rental Request Submitted!", description: `Your request for the ${asset.name} has been received. Our team will contact you shortly.` });
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
                    <DialogTitle>Request to Rent: {asset.name}</DialogTitle>
                    <DialogDescription>
                        Please fill out your details below to submit a rental request.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <div className="relative h-48 w-full overflow-hidden rounded-lg">
                             <Image src={asset.image} alt={asset.name} fill className="object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold">{asset.name}</h3>
                            <p className="text-sm text-muted-foreground">{asset.specs}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">OMR {asset.monthlyPrice.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">per month</p>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="companyName" render={({ field }) => (
                                    <FormItem><FormLabel>Company (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name="rentalMonths" render={({ field }) => (
                                <FormItem><FormLabel>Rental Duration (Months)</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem><FormLabel>Additional Notes</FormLabel><FormControl><Textarea rows={2} placeholder="Any specific requirements or questions?" {...field} /></FormControl><FormMessage /></FormItem>
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
