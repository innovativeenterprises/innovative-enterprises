
'use client';

import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, FileText, Printer, FileDown, AlertTriangle, ListTodo, Plus, Trash2, MapPin } from 'lucide-react';
import { OMAN_GOVERNORATES, OMAN_MINISTRIES } from '@/lib/oman-locations';
import { analyzeProTask } from '@/ai/flows/pro-task-analysis';
import type { ProTaskAnalysisOutput } from '@/ai/flows/pro-task-analysis.schema';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';


const FormSchema = z.object({
  institutionNames: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one institution to visit.",
  }),
  governorate: z.enum(OMAN_GOVERNORATES, { required_error: "Please select a governorate." }),
  startLocationName: z.string().min(3, "Please provide a name for the start location."),
  startLocationCoords: z.object({
      lat: z.number(),
      lon: z.number()
  }, { required_error: "Please select a valid start location on the map."}),
});

type FormValues = z.infer<typeof FormSchema>;


export default function ProForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ProTaskAnalysisOutput | null>(null);
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);


  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        institutionNames: [],
        governorate: 'Muscat',
        startLocationName: 'Innovative Enterprises HQ',
        startLocationCoords: { lat: 23.5518, lon: 58.5024 },
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeProTask(data);
      setResponse(result);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Could not calculate the trip plan.',
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
        newWindow?.document.write('<style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background-color:#f2f2f2;} h1,h2,h3{color:#293462; border-bottom: 1px solid #ccc; padding-bottom: 5px;} .no-print{display:none !important;}</style>');
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
          <CardTitle>Create New PRO Trip Sheet</CardTitle>
          <CardDescription>Select the institutions your PRO needs to visit today to generate a trip plan and allowance estimate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="bg-muted/50 p-6">
                     <CardTitle className="text-lg mb-4 flex items-center gap-2"><MapPin/> Trip Details</CardTitle>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="governorate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Governorate</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {OMAN_GOVERNORATES.map(gov => <SelectItem key={gov} value={gov}>{gov}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="startLocationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Location Name</FormLabel>
                                    <FormControl><Input placeholder="e.g., Head Office" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <p className="text-sm text-muted-foreground mt-4">Note: The PRO's starting GPS coordinates are currently fixed to our Head Office. Map-based location selection will be available in a future update.</p>
                </Card>
                <FormField
                control={form.control}
                name="institutionNames"
                render={() => (
                    <FormItem>
                        <FormLabel className="text-lg font-semibold">Select Institutions to Visit</FormLabel>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                            {OMAN_MINISTRIES.map((institution) => (
                                <FormField
                                key={institution}
                                control={form.control}
                                name="institutionNames"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={institution}
                                        className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-md border bg-background hover:bg-muted/50"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(institution)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...field.value, institution])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value) => value !== institution
                                                    )
                                                )
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal w-full cursor-pointer text-xs">
                                            {institution}
                                        </FormLabel>
                                    </FormItem>
                                    )
                                }}
                                />
                            ))}
                        </div>
                      <FormMessage />
                    </FormItem>
                )}
                />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Trip Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Fahim is calculating the optimal route and allowances...</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Assignment Sheet: {new Date().toLocaleDateString()}</CardTitle>
            <CardDescription>Review the consolidated assignment below. You can print this page for your PRO.</CardDescription>
          </CardHeader>
          <CardContent ref={printRef} className="space-y-8 print-content">
             <Card className="bg-muted">
                <CardHeader><CardTitle>Trip Plan & Total Estimated Cost</CardTitle></CardHeader>
                <CardContent>
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount (OMR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {response.allowances.map((allowance, i) => (
                                <TableRow key={i}>
                                    <TableCell>{allowance.description}</TableCell>
                                    <TableCell className="text-right font-medium">{allowance.amount.toFixed(3)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="bg-background hover:bg-background font-bold">
                                <TableCell>Grand Total Estimated Cost</TableCell>
                                <TableCell className="text-right text-base text-primary">{response.grandTotal.toFixed(3)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
            <div className="no-print">
                <h3 className="font-semibold mb-2">Assignment Notes</h3>
                <Textarea className="mt-2" placeholder="Add any general notes for the PRO for today's assignment..." />
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
