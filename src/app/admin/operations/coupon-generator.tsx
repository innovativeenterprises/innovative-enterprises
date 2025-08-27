
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Ticket } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CouponGeneratorInputSchema, type CouponGeneratorInput, type CouponGeneratorOutput } from '@/ai/flows/coupon-generator.schema';
import { generateCouponCode } from '@/ai/flows/coupon-generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const FormSchema = z.object({
  description: z.string().min(5, "Please describe the promotion (e.g., 'Summer Sale')."),
  discountType: z.enum(['percentage', 'fixed'], {
    required_error: "You need to select a discount type.",
  }),
  discountValue: z.coerce.number().positive("Discount value must be a positive number."),
  usageLimit: z.coerce.number().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

interface GeneratedCoupon extends FormValues {
    code: string;
}

export default function CouponGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<GeneratedCoupon | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        discountType: 'percentage',
        discountValue: 10,
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedCoupon(null);
    try {
      const result = await generateCouponCode(data);
      setGeneratedCoupon({ ...data, code: result.couponCode });
      toast({
        title: 'Coupon Generated!',
        description: `Your new code "${result.couponCode}" has been created.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate coupon code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyCode = () => {
    if (generatedCoupon) {
        navigator.clipboard.writeText(generatedCoupon.code);
        toast({ title: 'Copied!', description: `Coupon code "${generatedCoupon.code}" copied to clipboard.`});
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Coupon Code Generator</CardTitle>
          <CardDescription>Create a new promotional coupon code for your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Promotion Description</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 'Summer Sale 2024' or 'New User Welcome Offer'" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Discount Type</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-4"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="percentage" />
                                </FormControl>
                                <FormLabel className="font-normal">Percentage (%)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="fixed" />
                                </FormControl>
                                <FormLabel className="font-normal">Fixed Amount (OMR)</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount Value</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 25 or 10.50" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="usageLimit"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Usage Limit (Optional)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 100" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Code...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Generate Coupon</>
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
                <p className="mt-4 text-muted-foreground">Mira is thinking of a catchy code...</p>
            </CardContent>
         </Card>
      )}

      {generatedCoupon && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>New Coupon Created!</CardTitle>
             <CardDescription>
                Share this code with your customers. It is now active.
             </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
                <Ticket className="h-4 w-4"/>
                <AlertTitle className="flex justify-between items-center">
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold tracking-widest font-mono text-primary">{generatedCoupon.code}</span>
                        <span className="text-sm text-muted-foreground pb-1">({generatedCoupon.description})</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopyCode}><Copy className="mr-2 h-4 w-4"/> Copy Code</Button>
                </AlertTitle>
                <AlertDescription className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                        <p className="font-semibold">Discount</p>
                        <p>{generatedCoupon.discountValue}{generatedCoupon.discountType === 'percentage' ? '%' : ' OMR'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Usage Limit</p>
                        <p>{generatedCoupon.usageLimit || 'Unlimited'}</p>
                    </div>
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
