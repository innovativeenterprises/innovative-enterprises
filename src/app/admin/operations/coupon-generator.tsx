
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { generateCouponCode } from '@/ai/flows/coupon-generator';
import { CouponGeneratorInputSchema, type CouponGeneratorOutput } from '@/ai/flows/coupon-generator.schema';

const CouponFormSchema = CouponGeneratorInputSchema;
type CouponFormValues = z.infer<typeof CouponFormSchema>;

export default function CouponGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<CouponGeneratorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(CouponFormSchema),
  });

  const onSubmit: SubmitHandler<CouponFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateCouponCode(data);
      setResponse(result);
      toast({ title: 'Coupon Generated!', description: 'Your new coupon code is ready.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate coupon.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4 items-end">
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Promotion Description</FormLabel><FormControl><Input placeholder="e.g., 'Summer Sale'" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="discountType" render={({ field }) => (
                    <FormItem><FormLabel>Discount Type</FormLabel><FormControl><Input placeholder="Percentage or Fixed" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="discountValue" render={({ field }) => (
                    <FormItem><FormLabel>Value</FormLabel><FormControl><Input placeholder="e.g., 25 or 10OMR" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Code
            </Button>
        </form>
      </Form>
      {response && (
        <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Generated Coupon Code:</p>
            <p className="text-2xl font-bold font-mono bg-muted p-2 rounded-md inline-block">{response.couponCode}</p>
        </div>
      )}
    </div>
  );
}
