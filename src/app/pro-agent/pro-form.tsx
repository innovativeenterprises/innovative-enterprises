
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
import { sanadServiceGroups } from '@/lib/sanad-services';
import { OMAN_GOVERNORATES } from '@/lib/oman-locations';
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
  serviceNames: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one service.",
  }),
  governorate: z.enum(OMAN_GOVERNORATES, { required_error: "Please select a governorate." }),
  startLocationName: z.string().min(3, "Please provide a name for the start location."),
  startLocationCoords: z.object({
      lat: z.number(),
      lon: z.number()
  }, { required_error: "Please select a valid start location on the map."}),
});

type FormValues = z.infer<typeof FormSchema>;

const AssignmentProgress = () => {
    const steps = ["Pending", "In Progress", "Govt. Portal", "Completed"];
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="w-full pt-2">
             <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                    <div key={step} className="flex-1 text-center">
                        <p className={`text-xs font-medium ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{step}</p>
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
                 <Button size="sm" onClick={() => setCurrentStep(s => (s + 1) % steps.length)}>Update Status</Button>
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
    defaultValues: {
        serviceNames: [],
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
        description: 'Could not get details for the selected service(s).',
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
          <CardTitle>Create New PRO Assignment Sheet</CardTitle>
          <CardDescription>Select one or more government services to generate a consolidated assignment brief for your PRO.</CardDescription>
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
                name="serviceNames"
                render={() => (
                    <FormItem>
                        <FormLabel className="text-lg font-semibold">Select Tasks</FormLabel>
                         <Accordion type="multiple" className="w-full">
                            {Object.entries(sanadServiceGroups).map(([group, services]) => (
                                <AccordionItem value={group} key={group}>
                                    <AccordionTrigger className="font-semibold">{group}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        {services.map((service) => (
                                            <FormField
                                            key={service}
                                            control={form.control}
                                            name="serviceNames"
                                            render={({ field }) => {
                                                return (
                                                <FormItem
                                                    key={service}
                                                    className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-md border bg-background hover:bg-muted/50"
                                                >
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(service)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...field.value, service])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                (value) => value !== service
                                                                )
                                                            )
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal w-full cursor-pointer">
                                                        {service}
                                                    </FormLabel>
                                                </FormItem>
                                                )
                                            }}
                                            />
                                        ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                      <FormMessage />
                    </FormItem>
                )}
                />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Tasks & Build Assignment Sheet
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Fahim is analyzing the requirements for all selected tasks...</p>
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
            {response.tasks.map((task, index) => (
                 <div key={index} className="p-4 border rounded-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">Task {index + 1}: {task.serviceName}</h2>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Required Documents</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {task.documentList.map((doc, i) => <li key={i}>{doc}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Government Fees</h3>
                            <Table>
                                <TableBody>
                                    {task.fees.map((fee, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{fee.description}</TableCell>
                                            <TableCell className="text-right font-medium">{fee.amount.toFixed(3)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                     </div>
                      {task.notes && (
                        <Alert className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Important Notes for this task</AlertTitle>
                            <AlertDescription>{task.notes}</AlertDescription>
                        </Alert>
                    )}
                    <Separator className="my-4" />
                    <div className="no-print">
                        <Label htmlFor={`notes-${index}`} className="font-semibold">Follow-up Notes</Label>
                        <Textarea id={`notes-${index}`} className="mt-2" placeholder="Add notes on progress, reasons for non-completion, etc." />
                    </div>
                     <div className="no-print">
                        <h3 className="font-semibold mt-4 mb-2 text-center">Task Progress</h3>
                        <AssignmentProgress />
                     </div>
                 </div>
            ))}
             <Card className="bg-muted">
                <CardHeader><CardTitle>Total Estimated Cost</CardTitle></CardHeader>
                <CardContent>
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount (OMR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {response.totalFees.map((fee, i) => (
                                <TableRow key={i}>
                                    <TableCell>{fee.description}</TableCell>
                                    <TableCell className="text-right font-medium">{fee.amount.toFixed(3)}</TableCell>
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
