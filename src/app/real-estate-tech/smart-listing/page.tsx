
'use client';

import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Search, BedDouble, Bath, MapPin, Filter } from 'lucide-react';
import { PropertyMatcherInputSchema, type PropertyMatcherInput, type PropertyMatcherOutput } from '@/ai/flows/property-matcher.schema';
import { findBestPropertyMatch } from '@/ai/flows/property-matcher';
import { initialProperties } from '@/lib/properties';
import type { Property } from '@/lib/properties';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const propertyCategories = ['All', 'Villa', 'Apartment', 'Townhouse'];

const PropertyCard = ({ property }: { property: Property }) => (
    <Link href={`/real-estate-tech/listings/${property.id}`}>
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
            <div className="relative h-48 w-full">
                <Image src={property.imageUrl} alt={property.title} fill className="object-cover transition-transform group-hover:scale-105" />
                 <Badge className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm">{property.listingType}</Badge>
            </div>
            <CardHeader>
                <CardTitle className="text-lg truncate">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm"><MapPin className="h-4 w-4"/> {property.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <div className="flex justify-start items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4"/> {property.bedrooms} Beds</span>
                    <span className="flex items-center gap-1.5"><Bath className="h-4 w-4"/> {property.bathrooms} Baths</span>
                </div>
            </CardContent>
            <CardFooter>
                 <p className="text-xl font-bold text-primary">OMR {property.price.toLocaleString()}</p>
            </CardFooter>
        </Card>
    </Link>
)

export default function SmartListingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<PropertyMatcherOutput | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { toast } = useToast();

    const form = useForm<PropertyMatcherInput>({
        resolver: zodResolver(PropertyMatcherInputSchema),
        defaultValues: {
            userRequirements: 'I am looking for a 3-bedroom villa for sale in Al Mouj with a garden.',
        },
    });
    
    const filteredProperties = useMemo(() => {
        const availableProperties = initialProperties.filter(p => p.status === 'Available');
        if (selectedCategory === 'All') {
            return availableProperties;
        }
        return availableProperties.filter(p => p.propertyType === selectedCategory);
    }, [selectedCategory]);


    const onSubmit: SubmitHandler<PropertyMatcherInput> = async (data) => {
        setIsLoading(true);
        setResponse(null);
        try {
            const result = await findBestPropertyMatch(data);
            setResponse(result);
            toast({
                title: 'Match Found!',
                description: 'Our AI has found the best property match for your needs.',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to find a match. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const bestMatchProperty = useMemo(() => {
        if (!response) return null;
        return initialProperties.find(p => p.id === response.bestMatch.propertyId);
    }, [response]);

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <Search className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary">Smart Listing &amp; Matching</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Describe your dream property, and let our AI search our listings to find the perfect match for you. Or, browse all available listings below.
                </p>
            </div>
            <div className="max-w-4xl mx-auto mt-12 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Find Your Perfect Property with AI</CardTitle>
                        <CardDescription>Tell us what you're looking for. Be as specific as you like.</CardDescription>
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
                                    <Textarea placeholder="e.g., 'A modern 2-bedroom apartment for rent in a quiet neighborhood, close to schools. Budget is around 500 OMR per month.'" rows={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                                {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
                                ) : (
                                <><Sparkles className="mr-2 h-4 w-4" /> Find My Match</>
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
                            <p className="mt-4 text-muted-foreground">Our AI is searching all available listings...</p>
                        </CardContent>
                    </Card>
                )}

                {response && bestMatchProperty && (
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Recommendation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Alert>
                                <AlertTitle className="font-semibold">AI Analysis</AlertTitle>
                                <AlertDescription>
                                    {response.bestMatch.reasoning}
                                </AlertDescription>
                                <div className="pt-2">
                                     <p className="text-sm text-muted-foreground">Confidence Score: {response.bestMatch.confidenceScore}%</p>
                                    <Progress value={response.bestMatch.confidenceScore} className="h-2 mt-1" />
                                </div>
                            </Alert>
                            <PropertyCard property={bestMatchProperty} />
                        </CardContent>
                    </Card>
                )}

                <div className="pt-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Browse All Available Listings</h2>
                    <div className="flex justify-center flex-wrap gap-2 mb-8">
                        {propertyCategories.map(category => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(category)}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                {category}
                            </Button>
                        ))}
                    </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
        </div>
    );
}
