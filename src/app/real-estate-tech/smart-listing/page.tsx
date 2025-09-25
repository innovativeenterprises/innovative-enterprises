
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Home, Building2 } from 'lucide-react';
import { PropertyMatcherInputSchema, type PropertyMatcherInput, type PropertyMatcherOutput } from '@/ai/flows/property-matcher.schema';
import { findBestPropertyMatch } from '@/ai/flows/property-matcher';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/properties.schema';

const PropertyCard = ({ property }: { property: Property }) => (
    <Link href={`/real-estate-tech/listings/${property.id}`} className="block">
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-48 w-full">
                <Image src={property.imageUrl} alt={property.title} fill className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <CardHeader>
                <CardTitle className="text-lg truncate">{property.title}</CardTitle>
                <CardDescription>{property.location}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between text-sm">
                    <span className="font-semibold">{property.bedrooms} Beds | {property.bathrooms} Baths</span>
                    <span className="font-bold text-primary">OMR {property.price.toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
    </Link>
)

export default function SmartListingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<PropertyMatcherOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<PropertyMatcherInput>({
    resolver: zodResolver(PropertyMatcherInputSchema),
    defaultValues: {
      userRequirements: "I'm looking for a modern 3-bedroom villa in Muscat with a garden, suitable for a family.",
    },
  });

  const onSubmit: SubmitHandler<PropertyMatcherInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await findBestPropertyMatch(data);
      setResponse(result);
      toast({
        title: 'Search Complete!',
        description: 'I\'ve found the best matching properties for you.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to find a match. Please try again with a different description.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Smart Listing &amp; Matching</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Describe your dream property, and let our AI search our listings to find the perfect match for you.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Describe Your Dream Property</CardTitle>
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
                                    <VoiceEnabledTextarea
                                        placeholder="e.g., 'A spacious 3-bedroom apartment with a sea view and a gym in the building, under OMR 800/month.'"
                                        rows={5}
                                        {...field}
                                    />
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
                <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /><p className="mt-2 text-muted-foreground">Our AI is searching listings now...</p></CardContent></Card>
            )}

            {response && (
                <div className="space-y-8">
                     <Card className="border-2 border-primary">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                 <CardTitle>Top Match</CardTitle>
                                 <Badge>{response.bestMatch.confidenceScore}% Match</Badge>
                            </div>
                            <CardDescription>{response.bestMatch.reasoning}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <PropertyCard property={response.bestMatch.property} />
                        </CardContent>
                    </Card>
                    
                    {response.otherMatches && response.otherMatches.length > 0 && (
                        <div>
                             <h3 className="text-2xl font-bold text-center mb-4">Other Suggestions</h3>
                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {response.otherMatches.map((id) => {
                                     // This is a temporary way to find the property from the response.
                                     // In a real app, you might fetch full details or have them in the response.
                                     const prop = response.bestMatch.property; // This is a placeholder
                                     return <PropertyCard key={id} property={prop} />;
                                 })}
                             </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
