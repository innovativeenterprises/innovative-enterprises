
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Send, Loader2 } from "lucide-react";
import Image from 'next/image';
import type { Asset } from "@/lib/assets.schema";
import { Skeleton } from '@/components/ui/skeleton';
import AssetRentalAgentForm from '@/app/admin/operations/asset-rental-agent-form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';

// --- RentalRequestForm Logic ---
const RentalRequestSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  companyName: z.string().optional(),
  contactEmail: z.string().email("A valid email is required."),
  rentalDurationMonths: z.coerce.number().min(1, "Rental duration must be at least 1 month."),
  deliveryAddress: z.string().min(10, "A delivery address is required."),
});
type RentalRequestValues = z.infer<typeof RentalRequestSchema>;

const RentalRequestForm = ({ asset, isOpen, onOpenChange, onClose }: {
    asset: Asset;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
}) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<RentalRequestValues>({ resolver: zodResolver(RentalRequestSchema) });

    const onSubmit: SubmitHandler<RentalRequestValues> = async (data) => {
        setIsSubmitting(true);
        console.log("Rental Request:", { assetId: asset.id, ...data });
        await new Promise(res => setTimeout(res, 1500));
        toast({
            title: "Request Sent!",
            description: "Your rental request has been submitted. Our team will contact you shortly.",
        });
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request to Rent: {asset.name}</DialogTitle>
                    <DialogDescription>
                        Please provide your details below. Our team will contact you to finalize the rental agreement.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="companyName" render={({ field }) => (
                            <FormItem><FormLabel>Company Name (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactEmail" render={({ field }) => (
                            <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="rentalDurationMonths" render={({ field }) => (
                            <FormItem><FormLabel>Rental Duration (Months)</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                            <FormItem><FormLabel>Delivery Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><Send className="mr-2 h-4 w-4"/>Submit Request</>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

// --- AssetCard Component ---
const AssetCard = ({ asset, onRent }: { asset: Asset; onRent: (asset: Asset) => void }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Available": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Available</Badge>;
            case "Rented": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Rented</Badge>;
            case "Maintenance": return <Badge variant="destructive" className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30">Maintenance</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }
    
    return (
        <Card className="flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={asset.aiHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <Badge variant="outline">{asset.type}</Badge>
                    {getStatusBadge(asset.status)}
                </div>
                <CardTitle className="mt-2">{asset.name}</CardTitle>
                <CardDescription className="text-sm mt-1">{asset.specs}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
                <div>
                    <p className="text-xl font-bold text-primary">OMR {asset.monthlyPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">/ month</p>
                </div>
                <Button onClick={() => onRent(asset)} disabled={asset.status !== 'Available'}>
                    Rent Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

// --- Main Page Component ---
export default function AssetRentalsClientPage({ initialAssets }: { initialAssets: Asset[] }) {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const handleRentClick = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedAsset(null);
    };
    
    const availableAssets = assets.filter(asset => asset.status === 'Available');

    return (
        <div className="space-y-16">
             <div className="max-w-4xl mx-auto">
                 <AssetRentalAgentForm />
            </div>

            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Available Assets</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {availableAssets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} onRent={handleRentClick} />
                    ))}
                </div>
            </div>

            {selectedAsset && (
                <RentalRequestForm
                    asset={selectedAsset}
                    isOpen={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}
