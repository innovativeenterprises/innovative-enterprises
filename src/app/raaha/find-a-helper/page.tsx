
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, UserSearch, ArrowLeft, Check, Star } from 'lucide-react';
import { RaahaMatcherInputSchema, type RaahaMatcherOutput, type Worker } from '@/ai/flows/raaha-matcher.schema';
import { findHelpers } from '@/ai/flows/raaha-matcher';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { store } from '@/lib/global-store';

const FormSchema = RaahaMatcherInputSchema;
type FormValues = z.infer<typeof FormSchema>;

const HireRequestSchema = z.object({
    clientName: z.string().min(3, "Name is required."),
    clientContact: z.string().min(5, "A valid contact (phone or email) is required."),
});
type HireRequestValues = z.infer<typeof HireRequestSchema>;

const HireRequestDialog = ({ worker, onHired }: { worker: Worker, onHired: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const form = useForm<HireRequestValues>({
        resolver: zodResolver(HireRequestSchema),
    });

    const onSubmit: SubmitHandler<HireRequestValues> = (data) => {
        store.set(state => ({
            ...state,
            raahaRequests: [
                ...state.raahaRequests,
                {
                    id: `req_${Date.now()}`,
                    workerId: worker.id,
                    workerName: worker.name,
                    clientName: data.clientName,
                    clientContact: data.clientContact,
                    requestDate: new Date().toISOString(),
                    status: 'Pending'
                }
            ]
        }));
        toast({
            title: "Request Submitted!",
            description: `Your interest in ${worker.name} has been sent to the agency. They will contact you shortly.`,
        });
        setIsOpen(false);
        onHired();
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full"><Check className="mr-2 h-4 w-4"/> Request to Hire</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request to Hire {worker.name}</DialogTitle>
                    <DialogDescription>
                        Please provide your contact information. The agency will contact you to proceed with the hiring process.
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

const WorkerCard = ({ worker, onHired }: { worker: Worker, onHired: () => void }) => {
    return (
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                <Image src={worker.photo} alt={worker.name} width={80} height={80} className="rounded-full object-cover border-2 border-primary/10" />
                <div>
                    <CardTitle className="text-xl">{worker.name}</CardTitle>
                    <CardDescription>{worker.nationality}, {worker.age} years old</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                    {worker.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {worker.experience}
                </p>
                 <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                    <span className="text-sm font-medium">{worker.rating.toFixed(1)} / 5.0</span>
                </div>
            </CardContent>
            <CardFooter>
                 <HireRequestDialog worker={worker} onHired={onHired} />
            </CardFooter>
        </Card>
    )
}


export default function FindAHelperPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<RaahaMatcherOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      requirements: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await findHelpers(data);
      setResponse(result);
      toast({
        title: 'Search Complete!',
        description: `Found ${result.recommendedWorkers.length} potential matches for you.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to find matches. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleHireRequestSubmitted = () => {
    // Optionally, you could add logic here, e.g., tracking hired candidates.
    // For now, it just serves to close the dialog.
    console.log("A hire request was submitted.");
  }

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <UserSearch className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Find a Helper</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Describe your family's needs, and our AI will search our network of vetted candidates to find the perfect match for you.
          </p>
           <Button asChild variant="link" className="mt-4">
              <Link href="/raaha"><ArrowLeft className="mr-2 h-4 w-4" /> Back to RAAHA Platform</Link>
           </Button>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>Describe Your Requirements</CardTitle>
                    <CardDescription>Be as specific as possible. Mention required skills (e.g., cooking, childcare), language preferences, and years of experience.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="requirements"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Needs</FormLabel>
                                <FormControl>
                                <Textarea
                                    placeholder="e.g., 'I need a full-time housemaid who is an excellent cook, speaks English, and has at least 5 years of experience working with families with young children.'"
                                    rows={6}
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching for Matches...</>
                            ) : (
                                <><Sparkles className="mr-2 h-4 w-4" /> Find Best Matches</>
                            )}
                        </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

             {isLoading && (
                <Card>
                    <CardContent className="p-6 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Our AI is searching through thousands of profiles...</p>
                    </CardContent>
                </Card>
            )}
            
            {response && (
                <div>
                     <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-primary">{response.title}</h2>
                        <p className="mt-2 text-muted-foreground">{response.summary}</p>
                    </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {response.recommendedWorkers.map(worker => <WorkerCard key={worker.id} worker={worker} onHired={handleHireRequestSubmitted} />)}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
