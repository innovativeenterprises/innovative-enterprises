
'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Building2, Store, Tag, MapPin, HandCoins, Ticket, Filter, Loader2, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useStairspaceData } from '@/hooks/use-global-store-data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { StairspaceMatcherInputSchema, type StairspaceMatcherInput, type StairspaceMatcherOutput } from '@/ai/flows/stairspace-matcher.schema';
import { findBestStairspaceMatch } from '@/ai/flows/stairspace-matcher';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from "@/components/ui/progress";
import type { StairspaceListing } from '@/lib/stairspace.schema';
import { Skeleton } from "@/components/ui/skeleton";

const AiMatcher = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<StairspaceMatcherOutput | null>(null);
    const { toast } = useToast();
    
    const form = useForm<StairspaceMatcherInput>({
        resolver: zodResolver(StairspaceMatcherInputSchema),
        defaultValues: { userRequirements: '' },
    });

    const onSubmit: SubmitHandler<StairspaceMatcherInput> = async (data) => {
        setIsLoading(true);
        setResponse(null);
        try {
            const result = await findBestStairspaceMatch(data);
            setResponse(result);
            toast({ title: 'Match Found!', description: 'Our AI has found the best space for your needs.' });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to find a match. Please try again.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const bestMatchListing = useMemo(() => {
        if (!response) return null;
        return response.bestMatch.property;
    }, [response]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Space Matcher</CardTitle>
                <CardDescription>Describe what you need, and our AI will find the best space for you.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userRequirements"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Requirements</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g., 'I need a small space with high foot traffic for a pop-up coffee stand.'" rows={4} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</> : <><Sparkles className="mr-2 h-4 w-4" />Find My Space</>}
                        </Button>
                    </form>
                </Form>
                 {isLoading && (
                    <div className="text-center p-6"><Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /></div>
                )}
                 {response && bestMatchListing && (
                    <div className="mt-6 space-y-4">
                         <Alert>
                            <AlertTitle className="font-semibold">AI Recommendation</AlertTitle>
                            <AlertDescription>{response.bestMatch.reasoning}</AlertDescription>
                            <div className="pt-2 mt-2 border-t">
                                <p className="text-xs text-muted-foreground">Confidence Score: {response.bestMatch.confidenceScore}%</p>
                                <Progress value={response.bestMatch.confidenceScore} className="h-2 mt-1" />
                            </div>
                        </Alert>
                        <SpaceCard space={bestMatchListing} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const SpaceCard = ({ space }: { space: StairspaceListing }) => (
     <Link href={`/real-estate-tech/stairspace/${space.id}`} className="flex">
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col w-full">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image src={space.imageUrl} alt={space.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={space.aiHint} />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="flex flex-wrap gap-2 mb-2">
                    {space.tags.map(tag => <div key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</div>)}
                </div>
                <CardTitle className="text-lg">{space.title}</CardTitle>
                <CardDescription className="text-sm flex items-center gap-1 mt-1"><MapPin className="h-4 w-4"/> {space.location}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <p className="text-lg font-bold text-primary">{space.price}</p>
                <Button variant="secondary">View Details</Button>
            </CardFooter>
        </Card>
    </Link>
);


export default function StairspacePage() {
    const { stairspaceListings } = useStairspaceData();
    const [selectedTag, setSelectedTag] = useState('All');
    
    const allTags = useMemo(() => {
        const tags = new Set<string>(['All']);
        stairspaceListings.forEach(space => {
            space.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [stairspaceListings]);

    const filteredSpaces = useMemo(() => {
        if (selectedTag === 'All') {
            return stairspaceListings;
        }
        return stairspaceListings.filter(space => space.tags.includes(selectedTag));
    }, [stairspaceListings, selectedTag]);

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Store className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">StairSpace: Your Micro-Retail Revolution</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Unlock the hidden potential of underutilized spaces. StairSpace is a marketplace that connects property owners with entrepreneurs looking for affordable, flexible, and high-visibility micro-retail and storage spots.
          </p>
           <div className="mt-8 flex justify-center gap-4">
               <Button asChild size="lg">
                    <a href="#browse-spaces">Browse Spaces</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/real-estate-tech/stairspace/my-requests">
                        <Ticket className="mr-2 h-4 w-4" /> My Booking Requests
                    </Link>
                </Button>
           </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-20">
            <AiMatcher />
        </div>

        <div id="browse-spaces" className="max-w-6xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Or, Browse All Available Spaces</h2>
                <p className="mt-4 text-lg text-muted-foreground">Discover unique opportunities available right now.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {allTags.map(tag => (
                    <Button 
                        key={tag}
                        variant={selectedTag === tag ? 'default' : 'outline'}
                        onClick={() => setSelectedTag(tag)}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        {tag}
                    </Button>
                ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSpaces.map((space) => (
                    <SpaceCard key={space.id} space={space} />
                ))}
            </div>
        </div>

        <div className="max-w-4xl mx-auto mt-20 grid md:grid-cols-2 gap-8">
             <Card className="bg-accent/10 border-accent text-center">
                <CardHeader className="items-center">
                    <div className="bg-accent p-3 rounded-full">
                        <HandCoins className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl text-accent pt-2">For Property Owners</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-accent-foreground/80">
                       Have an empty space under a staircase, in a lobby, or a wide corridor? Turn your unused liability into a revenue-generating asset.
                    </p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/real-estate-tech/stairspace/list-your-space">List Your Space <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card className="bg-muted/50 text-center">
                <CardHeader className="items-center">
                    <div className="bg-primary/20 p-3 rounded-full">
                        <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl pt-2">For Entrepreneurs</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">
                       Launch your pop-up shop, test a new product, or secure convenient micro-storage without the cost of a full retail lease.
                    </p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" variant="secondary">
                        <a href="#browse-spaces">Browse All Spaces</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
