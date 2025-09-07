
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, TrendingUp, Home, PieChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const RoiSchema = z.object({
  purchasePrice: z.coerce.number().positive(),
  monthlyRent: z.coerce.number().positive(),
  yearlyExpenses: z.coerce.number().nonnegative(),
});
type RoiValues = z.infer<typeof RoiSchema>;

const MortgageSchema = z.object({
  loanAmount: z.coerce.number().positive(),
  interestRate: z.coerce.number().positive(),
  loanTerm: z.coerce.number().int().positive(),
});
type MortgageValues = z.infer<typeof MortgageSchema>;

export default function InvestisightForm() {
  const [roiResult, setRoiResult] = useState<{ annualReturn: number; netYield: number } | null>(null);
  const [mortgageResult, setMortgageResult] = useState<{ monthlyPayment: number; totalPayment: number; totalInterest: number } | null>(null);
  const [chartData, setChartData] = useState<{name: string, principal: number, interest: number}[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const roiForm = useForm<RoiValues>({
    resolver: zodResolver(RoiSchema),
    defaultValues: { purchasePrice: 100000, monthlyRent: 600, yearlyExpenses: 1200 },
  });

  const mortgageForm = useForm<MortgageValues>({
    resolver: zodResolver(MortgageSchema),
    defaultValues: { loanAmount: 80000, interestRate: 5.5, loanTerm: 25 },
  });

  const handleRoiCalculate: SubmitHandler<RoiValues> = (data) => {
    const { purchasePrice, monthlyRent, yearlyExpenses } = data;
    const grossAnnualRent = monthlyRent * 12;
    const netAnnualIncome = grossAnnualRent - yearlyExpenses;
    const netYield = (netAnnualIncome / purchasePrice) * 100;
    
    setRoiResult({ annualReturn: netAnnualIncome, netYield });
  };

  const handleMortgageCalculate: SubmitHandler<MortgageValues> = (data) => {
    const { loanAmount, interestRate, loanTerm } = data;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    setMortgageResult({ monthlyPayment, totalPayment, totalInterest });

    // Generate chart data
    const newChartData = [];
    let remainingBalance = loanAmount;
    for (let year = 1; year <= loanTerm; year++) {
        let principalPaid = 0;
        let interestPaid = 0;
        for (let month = 1; month <= 12; month++) {
            const monthlyInterest = remainingBalance * monthlyRate;
            const monthlyPrincipal = monthlyPayment - monthlyInterest;
            principalPaid += monthlyPrincipal;
            interestPaid += monthlyInterest;
            remainingBalance -= monthlyPrincipal;
        }
        newChartData.push({ name: `Year ${year}`, principal: Math.round(principalPaid), interest: Math.round(interestPaid) });
    }
    setChartData(newChartData);
  };

  const chartConfig = {
      principal: { label: "Principal", color: "hsl(var(--chart-1))" },
      interest: { label: "Interest", color: "hsl(var(--chart-2))" },
  };

  return (
    <Tabs defaultValue="roi" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="roi"><PieChart className="mr-2 h-4 w-4"/>Rental Yield & ROI</TabsTrigger>
        <TabsTrigger value="mortgage"><Home className="mr-2 h-4 w-4"/>Mortgage Calculator</TabsTrigger>
      </TabsList>
      <TabsContent value="roi">
        <Card>
          <CardHeader>
            <CardTitle>Rental Yield & ROI Calculator</CardTitle>
            <CardDescription>Estimate the return on investment for a rental property.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...roiForm}>
              <form onSubmit={roiForm.handleSubmit(handleRoiCalculate)} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField control={roiForm.control} name="purchasePrice" render={({ field }) => (
                      <FormItem><FormLabel>Purchase Price (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={roiForm.control} name="monthlyRent" render={({ field }) => (
                      <FormItem><FormLabel>Monthly Rent (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={roiForm.control} name="yearlyExpenses" render={({ field }) => (
                      <FormItem><FormLabel>Yearly Expenses (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                <Button type="submit" className="w-full"><Sparkles className="mr-2 h-4 w-4" />Calculate ROI</Button>
              </form>
            </Form>
            {isClient && roiResult && (
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <Card className="bg-muted/50">
                        <CardHeader><CardTitle>Annual Net Return</CardTitle></CardHeader>
                        <CardContent className="text-3xl font-bold text-primary">OMR {roiResult.annualReturn.toLocaleString()}</CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                        <CardHeader><CardTitle>Net Rental Yield</CardTitle></CardHeader>
                        <CardContent className="text-3xl font-bold text-primary">{roiResult.netYield.toFixed(2)}%</CardContent>
                    </Card>
                </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="mortgage">
        <Card>
            <CardHeader>
                <CardTitle>Mortgage Calculator</CardTitle>
                <CardDescription>Simulate mortgage payments for a property loan.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...mortgageForm}>
                    <form onSubmit={mortgageForm.handleSubmit(handleMortgageCalculate)} className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <FormField control={mortgageForm.control} name="loanAmount" render={({ field }) => (
                                <FormItem><FormLabel>Loan Amount (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={mortgageForm.control} name="interestRate" render={({ field }) => (
                                <FormItem><FormLabel>Interest Rate (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={mortgageForm.control} name="loanTerm" render={({ field }) => (
                                <FormItem><FormLabel>Loan Term (Years)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <Button type="submit" className="w-full"><Sparkles className="mr-2 h-4 w-4" />Calculate Mortgage</Button>
                    </form>
                </Form>
                {isClient && mortgageResult && (
                    <div className="mt-8 space-y-6">
                         <div className="grid md:grid-cols-3 gap-6 text-center">
                            <Card className="bg-muted/50"><CardHeader><CardTitle>Monthly Payment</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-primary">OMR {mortgageResult.monthlyPayment.toFixed(2)}</CardContent></Card>
                            <Card className="bg-muted/50"><CardHeader><CardTitle>Total Payment</CardTitle></CardHeader><CardContent className="text-2xl font-bold">OMR {mortgageResult.totalPayment.toLocaleString()}</CardContent></Card>
                            <Card className="bg-muted/50"><CardHeader><CardTitle>Total Interest</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-destructive">OMR {mortgageResult.totalInterest.toLocaleString()}</CardContent></Card>
                        </div>
                        <div>
                             <h3 className="font-semibold text-lg text-center mb-4">Payment Breakdown Over Time</h3>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <BarChart data={chartData} stackOffset="sign">
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis />
                                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                    <Legend />
                                    <Bar dataKey="principal" fill="var(--color-principal)" stackId="a" radius={4} />
                                    <Bar dataKey="interest" fill="var(--color-interest)" stackId="a" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
