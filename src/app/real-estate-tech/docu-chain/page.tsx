
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ClipboardCheck, Download, Copy, FileText, CalendarIcon } from 'lucide-react';
import { RealEstateContractInputSchema, type RealEstateContractInput, type RealEstateContractOutput } from '@/ai/flows/real-estate-contract-generator.schema';
import { generateRealEstateContract } from '@/ai/flows/real-estate-contract-generator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const FormSchema = RealEstateContractInputSchema.omit({ 
    startDate: true, 
    endDate: true 
}).extend({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DocuChainPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<RealEstateContractOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        contractType: 'Tenancy Agreement',
        lessorName: '',
        lesseeName: '',
        propertyAddress: '',
        propertyType: '2-bedroom apartment',
        price: 0,
        pricePeriod: 'per month',
        additionalClauses: '',
    },
  });
  
  const watchContractType = form.watch('contractType');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    
    const submissionData: RealEstateContractInput = {
        ...data,
        startDate: data.startDate ? format(data.startDate, 'yyyy-MM-dd') : undefined,
        endDate: data.endDate ? format(data.endDate, 'yyyy-MM-dd') : undefined,
    }

    try {
      const result = await generateRealEstateContract(submissionData);
      setResponse(result);
      toast({
        title: 'Contract Generated!',
        description: 'Your legal document draft is ready for review.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the contract. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response?.contractContent) return;
    navigator.clipboard.writeText(response.contractContent);
    toast({ title: "Copied!", description: "The contract content has been copied to your clipboard." });
  };

  const handleDownload = () => {
    if (!response?.contractContent) return;
    const element = document.createElement("a");
    const file = new Blob([response.contractContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${form.getValues('contractType').replace(' ', '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ClipboardCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">DocuChain Compliance</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Automate your real estate paperwork. Fill in the details below to generate a professional Tenancy or Sale Agreement tailored to your needs.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Contract Generator</CardTitle>
                    <CardDescription>Enter the details for your agreement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                             <FormField
                                control={form.control}
                                name="contractType"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contract Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Tenancy Agreement">Tenancy Agreement</SelectItem>
                                        <SelectItem value="Sale Agreement">Sale Agreement</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="lessorName" render={({ field }) => (
                                    <FormItem><FormLabel>{watchContractType === 'Tenancy Agreement' ? 'Landlord / Lessor Name' : 'Seller Name'}</FormLabel><FormControl><Input placeholder="First Party Name" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="lesseeName" render={({ field }) => (
                                    <FormItem><FormLabel>{watchContractType === 'Tenancy Agreement' ? 'Tenant / Lessee Name' : 'Buyer Name'}</FormLabel><FormControl><Input placeholder="Second Party Name" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                            <FormField control={form.control} name="propertyAddress" render={({ field }) => (
                                <FormItem><FormLabel>Property Address</FormLabel><FormControl><Input placeholder="e.g., Villa 123, Al Mouj Street, Muscat" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="propertyType" render={({ field }) => (
                                    <FormItem><FormLabel>Property Type</FormLabel><FormControl><Input placeholder="e.g., Two-bedroom apartment" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="price" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{watchContractType === 'Tenancy Agreement' ? 'Rent Amount (OMR)' : 'Sale Price (OMR)'}</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl><Input type="number" {...field} /></FormControl>
                                            {watchContractType === 'Tenancy Agreement' && (
                                                 <FormField control={form.control} name="pricePeriod" render={({ field }) => (
                                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="per month">per month</SelectItem>
                                                            <SelectItem value="per year">per year</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}/>
                                            )}
                                        </div>
                                         <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                            {watchContractType === 'Tenancy Agreement' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="startDate" render={({ field }) => (
                                        <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover>
                                        <PopoverTrigger asChild><FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                        </PopoverContent></Popover><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="endDate" render={({ field }) => (
                                        <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover>
                                        <PopoverTrigger asChild><FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                        </PopoverContent></Popover><FormMessage /></FormItem>
                                    )}/>
                                </div>
                            )}
                            <FormField control={form.control} name="additionalClauses" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Clauses (Optional)</FormLabel>
                                    <FormControl><Textarea placeholder="e.g., 'The tenant is responsible for all utility bills.' or 'Property is sold as-is.'" rows={4} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Contract...</>
                            ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Document</>
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
                        <p className="mt-4 text-muted-foreground">Lexi, our AI Legal Assistant, is drafting your document...</p>
                    </CardContent>
                </Card>
            )}

            {response && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <FileText className="h-6 w-6"/> AI-Generated {form.getValues('contractType')}
                        </CardTitle>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                            <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2 h-4 w-4"/> Download</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="prose prose-sm max-w-full rounded-md border bg-muted p-6 whitespace-pre-wrap h-[60vh] overflow-y-auto">
                            {response.contractContent}
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
      </div>
    </div>
  );
}
