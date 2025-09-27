
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { opportunityIconMap, type Opportunity } from "@/lib/opportunities";
import { notFound } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, DollarSign, ArrowRight, HelpCircle, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const NegotiationSchema = z.object({
  proposedPrice: z.coerce.number().positive("Proposed price must be a positive number."),
  justification: z.string().min(10, "Please provide a brief justification for your proposal."),
});
type NegotiationValues = z.infer<typeof NegotiationSchema>;


const PriceNegotiationDialog = ({ opportunity }: { opportunity: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const form = useForm<NegotiationValues>({
        resolver: zodResolver(NegotiationSchema),
    });

    const onSubmit: SubmitHandler<NegotiationValues> = (data) => {
        console.log("Submitting counter-offer:", data);
        toast({
            title: "Proposal Submitted!",
            description: "Your counter-offer has been sent to the opportunity poster.",
        });
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary"><Handshake className="mr-2 h-4 w-4"/> Propose a Different Price</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Negotiate Price for "{opportunity.title}"</DialogTitle>
                    <DialogDescription>
                        The current budget is {opportunity.prize}. Submit your counter-offer below.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="proposedPrice" render={({ field }) => (
                            <FormItem><FormLabel>Your Proposed Price (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="justification" render={({ field }) => (
                            <FormItem><FormLabel>Justification</FormLabel><FormControl><Textarea placeholder="Briefly explain why your proposed price is different. e.g., 'The project scope requires additional design revisions not mentioned in the brief.'" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Submit Proposal</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function OpportunityDetailClientPage({ opportunity }: { opportunity?: Opportunity }) {

    if (!opportunity) {
        notFound();
    }
    
    const Icon = opportunityIconMap[opportunity.iconName] || Trophy;

    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <Badge variant={opportunity.badgeVariant}>{opportunity.type}</Badge>
                                    <CardTitle className="text-3xl mt-1">{opportunity.title}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6 text-lg">
                                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                    <DollarSign className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Prize / Budget</p>
                                        <p className="font-bold text-primary">{opportunity.prize}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                    <Calendar className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                                        <p className="font-bold">{opportunity.deadline}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.description}</p>
                            </div>
                             {opportunity.questions && opportunity.questions.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Key Questions</h3>
                                    <Alert>
                                        <HelpCircle className="h-4 w-4" />
                                        <AlertTitle>Address These in Your Proposal</AlertTitle>
                                        <AlertDescription>
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                {opportunity.questions.map((q, i) => <li key={i}>{q}</li>)}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col sm:flex-row justify-center gap-4">
                            <Button asChild size="lg" className="w-full sm:w-auto">
                                <Link href="/submit-work">
                                    Submit Proposal <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <PriceNegotiationDialog opportunity={opportunity} />
                        </CardFooter>
                    </Card>
                </div>
            </div>
         </div>
    );
}
