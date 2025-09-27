
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Check, TrendingUp, Banknote, MapPin, Building, BedDouble, Bath } from 'lucide-react';
import { PropertyValuationInputSchema, type PropertyValuationInput, type PropertyValuationOutput } from '@/ai/flows/property-valuation.schema';
import { evaluateProperty } from '@/ai/flows/property-valuation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fileToDataURI } from '@/lib/utils';

const FormSchema = PropertyValuationInputSchema.extend({
    propertyImageFile: z.any().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

export default function ValuationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<PropertyValuationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      propertyType: 'Villa',
      location: 'Al Mouj, Muscat',
      description: 'A well-maintained family home with a small garden and private pool.',
      bedrooms: 4,
      bathrooms: 5,
      sizeSqM: 350,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        let propertyImageUri: string | undefined;
        if (data.propertyImageFile && data.propertyImageFile.length > 0) {
            propertyImageUri = await fileToDataURI(data.propertyImageFile[0]).catch(err => {
                console.error(err);
                toast({ title: 'Error reading file', description: 'Could not process the uploaded image.', variant: 'destructive'});
                return undefined;
            });
        }
      
        const result = await evaluateProperty({
            ...data,
            propertyImageUri,
        });
        
      setResponse(result);
      toast({
        title: 'Valuation Complete!',
        description: 'Your property analysis is ready.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the valuation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>Provide as much detail as possible for the most accurate valuation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a property type..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Villa"><div className="flex items-center gap-2"><Building className="h-4 w-4"/>Villa</div></SelectItem>
                                <SelectItem value="Apartment"><div className="flex items-center gap-2"><Building className="h-4 w-4"/>Apartment</div></SelectItem>
                                <SelectItem value="Townhouse"><div className="flex items-center gap-2"><Building className="h-4 w-4"/>Townhouse</div></SelectItem>
                                <SelectItem value="Land"><div className="flex items-center gap-2"><MapPin className="h-4 w-4"/>Land</div></SelectItem>
                                <SelectItem value="Commercial Space"><div className="flex items-center gap-2"><Building className="h-4 w-4"/>Commercial Space</div></SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location / Neighborhood</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g., Al Mouj, Muscat" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="sizeSqM"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size (sq. meters)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bedrooms</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bathrooms</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Property Description</FormLabel>
                            <FormControl><Textarea placeholder="e.g., 'Modern villa with sea views, a private swimming pool, and upgraded kitchen...'" rows={4} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="propertyImageFile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Property Image (Optional)</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                            </FormControl>
                            <FormDescription>An image helps the AI provide a more accurate valuation.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Market Data...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Valuation</>
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
            <p className="mt-4 text-muted-foreground">Our AI is analyzing market data and comparable sales...</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader className="text-center items-center">
            <p className="text-muted-foreground">Estimated Market Value</p>
            <CardTitle className="text-5xl font-extrabold text-primary">OMR {response.estimatedValue.toLocaleString()}</CardTitle>
             <div className="pt-2 w-full max-w-sm">
                <p className="text-sm text-muted-foreground">Confidence: {response.confidenceScore}%</p>
                <Progress value={response.confidenceScore} className="h-2 mt-1" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
                <Banknote className="h-4 w-4" />
                <AlertTitle>Valuation Summary</AlertTitle>
                <AlertDescription>{response.valuationSummary}</AlertDescription>
            </Alert>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Check className="text-green-500"/> Positive Value Factors</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {response.positiveFeatures.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><TrendingUp className="text-blue-500"/> Improvement Suggestions</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                         {response.improvementSuggestions.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
            <div>
                 <h3 className="font-semibold mb-2">Comparable Sales Analysis</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Property</TableHead>
                            <TableHead>Size (sq. m)</TableHead>
                            <TableHead className="text-right">Sale Price (OMR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.comparableProperties.map((prop, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <p className="font-medium">{prop.address}</p>
                                    <p className="text-xs text-muted-foreground">{prop.notes}</p>
                                </TableCell>
                                <TableCell>{prop.sizeSqM}</TableCell>
                                <TableCell className="text-right font-mono">{prop.price.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
