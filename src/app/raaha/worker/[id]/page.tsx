
'use client';

import { useParams, notFound } from 'next/navigation';
import { useWorkersData, useAgenciesData, useRequestsData } from '@/hooks/use-global-store-data';
import type { Worker } from '@/lib/raaha-workers';
import type { Agency } from '@/lib/raaha-agencies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Globe, Check, Star, Briefcase, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { HireRequest } from '@/lib/raaha-requests.schema';
import type { Metadata } from 'next';
import { getRaahaData } from '@/lib/firestore';
import { useState, useEffect } from 'react';

export async function generateStaticParams() {
  const { raahaWorkers } = await getRaahaData();
  return raahaWorkers.map((worker) => ({
    id: worker.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { raahaWorkers } = await getRaahaData();
  const worker = raahaWorkers.find(w => w.id === params.id);

  if (!worker) {
    notFound();
  }

  return {
    title: `${worker.name} | Candidate Profile`,
    description: `Professional profile for ${worker.name}, a ${worker.nationality} domestic helper specializing in ${worker.skills.join(', ')}.`,
  };
}


const HireRequestSchema = z.object({
    clientName: z.string().min(3, "Name is required."),
    clientContact: z.string().min(5, "A valid contact (phone or email) is required."),
});
type HireRequestValues = z.infer<typeof HireRequestSchema>;

const HireRequestDialog = ({ worker, agency }: { worker: Worker, agency?: Agency }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { setRaahaRequests } = useRequestsData();
    const form = useForm<HireRequestValues>({
        resolver: zodResolver(HireRequestSchema),
    });

    const onSubmit: SubmitHandler<HireRequestValues> = (data) => {
        setRaahaRequests(prev => [
            ...prev,
            {
                id: `req_${worker.id}_${data.clientName.toLowerCase().replace(/\s+/g, '_')}`,
                workerId: worker.id,
                workerName: worker.name,
                clientName: data.clientName,
                clientContact: data.clientContact,
                requestDate: new Date().toISOString(),
                status: 'Pending',
                agencyId: worker.agencyId,
            }
        ]);
        toast({
            title: "Request Submitted!",
            description: `Your interest in ${worker.name} has been sent to ${agency?.name || 'the agency'}. They will contact you shortly.`,
        });
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto" size="lg"><Check className="mr-2 h-4 w-4"/> Request to Hire</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request to Hire {worker.name}</DialogTitle>
                    <DialogDescription>
                        Please provide your contact information. Your request will be sent to <strong>{agency?.name || 'the representing agency'}</strong>, who will contact you to proceed.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="clientName" render={({ field }) => (
                            <FormItem><FormLabel>Your Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="clientContact" render={({ field }) => (
                            <FormItem><FormLabel>Your Contact (Phone or Email)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

const AgencyInfoCard = ({ agency }: { agency: Agency }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Building2 className="h-6 w-6 text-primary"/> Represented By</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                <Image src={agency.logo} alt={`${agency.name} Logo`} width={64} height={64} className="rounded-md object-contain border p-1" />
                <div>
                    <h4 className="font-bold text-lg">{agency.name}</h4>
                    <p className="text-sm text-muted-foreground">{agency.description}</p>
                    <div className="flex gap-4 mt-2">
                        <a href={`mailto:${agency.contactEmail}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Mail className="h-3 w-3"/> Email</a>
                        <a href={`tel:${agency.contactPhone}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Phone className="h-3 w-3"/> Call</a>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function WorkerProfilePage() {
    const params = useParams();
    const { id } = params;
    const { workers, isClient: isWorkersClient } = useWorkersData();
    const { agencies, isClient: isAgenciesClient } = useAgenciesData();
    const [worker, setWorker] = useState<Worker | undefined>(undefined);
    const [agency, setAgency] = useState<Agency | undefined>(undefined);
    
    const isClient = isWorkersClient && isAgenciesClient;

    useEffect(() => {
        if(isClient && id) {
            const foundWorker = workers.find(p => p.id === id);
            if(foundWorker) {
                setWorker(foundWorker);
                const foundAgency = agencies.find(a => a.name === foundWorker.agencyId);
                setAgency(foundAgency);
            } else {
                notFound();
            }
        }
    }, [id, workers, agencies, isClient]);

    if (!isClient || !worker) {
        return (
            <div className="bg-muted/20 min-h-screen">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div><Skeleton className="h-10 w-40" /></div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Card><CardContent className="p-8"><Skeleton className="h-96 w-full" /></CardContent></Card>
                            </div>
                            <div className="lg:col-span-1 space-y-6">
                                <Card><CardContent className="p-8"><Skeleton className="h-24 w-full" /></CardContent></Card>
                                <Card><CardContent className="p-8"><Skeleton className="h-24 w-full" /></CardContent></Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <Button asChild variant="outline">
                            <Link href="/raaha/find-a-helper">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Search Results
                            </Link>
                        </Button>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <Card>
                                <CardContent className="p-8">
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="md:col-span-1 text-center">
                                            <Image src={worker.photo} alt={worker.name} width={200} height={200} className="rounded-full object-cover border-4 border-primary/20 mx-auto" />
                                            <div className="mt-4">
                                                <CardTitle className="text-3xl font-bold">{worker.name}</CardTitle>
                                                <CardDescription className="text-lg">{worker.nationality}</CardDescription>
                                            </div>
                                            <Badge variant={worker.availability === 'Available' ? 'default' : 'outline'} className={`mt-4 ${worker.availability === 'Available' ? 'bg-green-500/20 text-green-700' : ''}`}>
                                                {worker.availability}
                                            </Badge>
                                        </div>
                                        <div className="md:col-span-2 space-y-6">
                                            <div>
                                                <h3 className="font-semibold text-lg border-b pb-2 mb-2">Details</h3>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <p><strong>Age:</strong> {worker.age} years old</p>
                                                    <div className="flex items-center gap-1">
                                                        <strong>Rating:</strong> 
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 ml-1"/>
                                                        {worker.rating.toFixed(1)} / 5.0
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg border-b pb-2 mb-2">Skills</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {worker.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg border-b pb-2 mb-2">Experience</h3>
                                                <div className="text-muted-foreground text-sm">{worker.experience}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                         <div className="lg:col-span-1 space-y-6">
                            {agency && <AgencyInfoCard agency={agency} />}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Interested?</CardTitle>
                                    <CardDescription>Request to hire this candidate through their representing agency.</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <HireRequestDialog worker={worker} agency={agency} />
                                </CardFooter>
                            </Card>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
