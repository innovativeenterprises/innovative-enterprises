
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileText, Bot, DollarSign } from 'lucide-react';
import { generateAssetRentalProposal, AssetRentalInquiryInputSchema, type AssetRentalProposalOutput } from '@/ai/flows/asset-rental-agent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AssetRentalFormSchema = AssetRentalInquiryInputSchema;
type AssetRentalFormValues = z.infer<typeof AssetRentalFormSchema>;

export default function AssetRentalAgentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AssetRentalProposalOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AssetRentalFormValues>({
    resolver: zodResolver(AssetRentalFormSchema),
    defaultValues: {
      projectName: 'New Office Setup',
      purposeOfRental: 'To equip a temporary project office for 15 staff members.',
      numberOfWorkers: 15,
      rentalDurationMonths: 6,
    },
  });

  const onSubmit: SubmitHandler<AssetRentalFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateAssetRentalProposal(data);
      setResponse(result);
      toast({
        title: 'Proposal Generated!',
        description: 'Your custom asset rental proposal is ready.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate proposal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
    const totalRentalCost = response?.costBreakdown.totalRentalCostForDuration || 0;
    const totalPurchaseCost = response?.costBreakdown.totalPurchaseCost || 0;
    const softwareCost = response?.costBreakdown.softwareCost || 0;
    const grandTotalRental = response?.costBreakdown.grandTotalForRentalOption || 0;
    const grandTotalPurchase = response?.costBreakdown.grandTotalForPurchaseOption || 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>InfraRent AI Solutions Architect</CardTitle>
          <CardDescription>Describe your project needs, and our AI agent, A.S.A, will generate a tailored IT and equipment rental proposal for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="projectName" render={({ field }) => (
                        <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="purposeOfRental" render={({ field }) => (
                        <FormItem><FormLabel>Purpose of Rental</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <div className="grid md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="numberOfWorkers" render={({ field }) => (
                        <FormItem><FormLabel>Number of Workers/Users</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="rentalDurationMonths" render={({ field }) => (
                        <FormItem><FormLabel>Rental Duration (Months)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="budget" render={({ field }) => (
                        <FormItem><FormLabel>Monthly Budget (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="existingInfrastructure" render={({ field }) => (
                    <FormItem><FormLabel>Existing Infrastructure (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., 'We already have 5 laptops and a basic network switch...'" rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="missingComponents" render={({ field }) => (
                    <FormItem><FormLabel>Specifically Missing Components (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., 'We definitely need a powerful server and 10 workstations...'" rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Proposal...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Generate Proposal</>
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
                <p className="mt-4 text-muted-foreground">A.S.A is designing the optimal infrastructure package...</p>
            </CardContent>
         </Card>
      )}
      
      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{response.proposalTitle}</CardTitle>
            <CardDescription>{response.executiveSummary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(response.rentedAssets.length > 0 || response.purchasedAssets.length > 0) && (
              <div>
                <h3 className="font-semibold mb-2">Recommended Hardware</h3>
                <Table>
                  <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead>Type</TableHead><TableHead className="text-center">Qty</TableHead><TableHead className="text-right">Rental (OMR/mo)</TableHead><TableHead className="text-right">Purchase (OMR)</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {response.rentedAssets.map((asset, index) => (
                      <TableRow key={`rent-${index}`}>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell className="text-center">{asset.quantity}</TableCell>
                        <TableCell className="text-right font-mono">{asset.monthlyPrice?.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell className="text-right font-mono">{response.purchasedAssets.find(p => p.id === asset.id)?.purchasePrice?.toFixed(2) || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
             {response.surveillanceSystem.equipmentList.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Surveillance System (Purchase Only)</h3>
                 <Table>
                    <TableHeader><TableRow><TableHead>Equipment</TableHead><TableHead className="text-center">Qty</TableHead><TableHead className="text-right">Total Price (OMR)</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {response.surveillanceSystem.equipmentList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.item}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right font-mono">{item.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            )}
            {response.recommendedSoftware.length > 0 && (
               <div>
                <h3 className="font-semibold mb-2">Recommended Software</h3>
                <Table>
                    <TableHeader><TableRow><TableHead>Software</TableHead><TableHead>License Type</TableHead><TableHead className="text-right">Estimated Cost (OMR)</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {response.recommendedSoftware.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.licenseType}</TableCell>
                                <TableCell className="text-right font-mono">{item.estimatedCost.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            )}
             <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Rental Option</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>IT Hardware (per month)</span><span>OMR {response.costBreakdown.totalRentalCostPerMonth.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>IT Hardware (for {response.costBreakdown.totalRentalCostPerMonth > 0 ? form.getValues('rentalDurationMonths') : 0} months)</span><span>OMR {totalRentalCost.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Surveillance System (one-time)</span><span>OMR {totalPurchaseCost.toFixed(2)}</span></div>
                         <div className="flex justify-between"><span>Software Licenses (one-time)</span><span>OMR {softwareCost.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total Rental Option</span><span>OMR {grandTotalRental.toFixed(2)}</span></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-lg">Purchase Option</CardTitle></CardHeader>
                     <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>IT Hardware (one-time)</span><span>OMR {response.costBreakdown.totalPurchaseCost.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Surveillance System (one-time)</span><span>OMR {totalPurchaseCost.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Software Licenses (one-time)</span><span>OMR {softwareCost.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total Purchase Option</span><span>OMR {grandTotalPurchase.toFixed(2)}</span></div>
                    </CardContent>
                </Card>
             </div>
             <div className="prose prose-sm max-w-full dark:prose-invert">
                <h3 className="font-semibold">Service Level Agreement</h3>
                <div dangerouslySetInnerHTML={{ __html: response.serviceAgreement.replace(/\n/g, '<br />') }}/>
             </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Accept Proposal & Proceed</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
