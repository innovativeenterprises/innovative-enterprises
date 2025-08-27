
'use client';

import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, FileText, Printer, FileDown, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { sanadServiceGroups, sanadServiceIcons } from '@/lib/sanad-services';
import { analyzeProTask, type ProTaskAnalysisOutput } from '@/ai/flows/pro-task-analysis.schema';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

const FormSchema = z.object({
  serviceName: z.string({ required_error: 'Please select a service.' }),
});

type FormValues = z.infer<typeof FormSchema>;

const AssignmentProgress = () => {
    const steps = ["Pending", "In Progress", "Govt. Portal", "Completed"];
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="w-full">
             <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                    <div key={step} className="flex-1 text-center">
                        <p className={`text-sm font-medium ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{step}</p>
                    </div>
                ))}
            </div>
            <div className="relative w-full h-2 bg-muted rounded-full">
                <div 
                    className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
                 <div className="absolute w-full flex justify-between top-1/2 -translate-y-1/2">
                    {steps.map((_, index) => (
                        <div key={index} className={`h-4 w-4 rounded-full border-2 ${index <= currentStep ? 'bg-primary border-primary-foreground' : 'bg-muted border-muted-foreground'}`} />
                    ))}
                </div>
            </div>
            <div className="text-center mt-4">
                 <Button onClick={() => setCurrentStep(s => (s + 1) % steps.length)}>Update Progress</Button>
            </div>
        </div>
    )
}

export default function ProForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ProTaskAnalysisOutput | null>(null);
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);


  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeProTask({ serviceName: data.serviceName });
      setResponse(result);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Could not get details for the selected service.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        newWindow?.document.write('<html><head><title>Print Assignment</title>');
        newWindow?.document.write('<style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background-color:#f2f2f2;}</style>');
        newWindow?.document.write('</head><body>');
        newWindow?.document.write(printContent.innerHTML);
        newWindow?.document.write('</body></html>');
        newWindow?.document.close();
        newWindow?.print();
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New PRO Assignment</CardTitle>
          <CardDescription>Select a government service to generate an assignment brief for your PRO.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Government Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a service..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(sanadServiceGroups).map(([group, services]) => (
                            <SelectGroup key={group}>
                                <SelectLabel>{group}</SelectLabel>
                                {services.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}
                            </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Task & Estimate Fees
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Fahim is analyzing the requirements and estimating fees...</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details: {form.getValues('serviceName')}</CardTitle>
            <CardDescription>Review the details below. You can print this page for your PRO.</CardDescription>
          </CardHeader>
          <CardContent ref={printRef} className="space-y-6 print-content">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Required Documents</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {response.documentList.map((doc, i) => <li key={i}>{doc}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 text-lg">Fee & Allowance Estimate</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount (OMR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {response.fees.map((fee, i) => (
                                <TableRow key={i}>
                                    <TableCell>{fee.description}</TableCell>
                                    <TableCell className="text-right font-medium">{fee.amount.toFixed(3)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="bg-muted hover:bg-muted font-bold">
                                <TableCell>Total Estimated Cost</TableCell>
                                <TableCell className="text-right text-base text-primary">{response.totalEstimatedCost.toFixed(3)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            
            {response.notes && (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important Notes</AlertTitle>
                    <AlertDescription>
                        {response.notes}
                    </AlertDescription>
                </Alert>
            )}

            <Separator />
            
             <div>
                <h3 className="font-semibold mb-4 text-lg text-center">Assignment Progress Tracker</h3>
                <AssignmentProgress />
            </div>

          </CardContent>
          <CardFooter>
            <Button onClick={handlePrint} className="w-full">
                <Printer className="mr-2 h-4 w-4"/> Print Today's Assignment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
