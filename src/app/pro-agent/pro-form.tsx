'use client';

import { useState, useRef } from 'react';
import { useForm, type SubmitHandler, useFieldArray } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const locationVisitSchema = z.object({
  name: z.string().min(1, "Please select an institution."),
  purpose: z.string().min(3, "Please enter a purpose for the visit."),
});

const FormSchema = z.object({
  governorate: z.enum(OMAN_GOVERNORATES, { required_error: "Please select a governorate." }),
  startLocationName: z.string().min(3, "Please provide a name for the start location."),
  startLocationCoords: z.object({
      lat: z.number(),
      lon: z.number()
  }, { required_error: "Please select a valid start location on the map."}),
  visits: z.array(locationVisitSchema).min(1, "Please add at least one location to visit."),
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
        governorate: 'Muscat',
        startLocationName: 'Innovative Enterprises HQ',
        startLocationCoords: { lat: 23.5518, lon: 58.5024 },
        visits: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "visits",
  });
  
  const [currentVisit, setCurrentVisit] = useState({ name: '', purpose: '' });


  const handleAddVisit = () => {
    const result = locationVisitSchema.safeParse(currentVisit);
    if (result.success) {
      append(currentVisit);
      setCurrentVisit({ name: '', purpose: '' });
    } else {
      toast({
        variant: "destructive",
        title: "Incomplete Visit Details",
        description: result.error.errors[0].message,
      })
    }
  };


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const institutionNames = data.visits.map(v => v.name);
      const result = await analyzeProTask({
          governorate: data.governorate,
          startLocationName: data.startLocationName,
          startLocationCoords: data.startLocationCoords,
          institutionNames,
      });
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
        newWindow?.document.write('<style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background-color:#f2f2f2;} h1,h2,h3{color:#293462; border-bottom: 1px solid #ccc; padding-bottom: 5px;} .no-print{display:none !important;} .purpose-note{background-color:#f9f9f9; border-left: 3px solid #ccc; padding: 5px; margin-top: 5px; font-style: italic;}</style>');
        newWindow?.document.write('</head><body>');
        newWindow?.document.write(printContent.innerHTML);
        newWindow?.document.write('</body></html>');
        newWindow?.document.close();
        newWindow?.print();
    }
  };
  
  const handleDownload = handlePrint; // Alias for consistency

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New PRO Trip Sheet</CardTitle>
          <CardDescription>Add the institutions your PRO needs to visit to generate a trip plan and allowance estimate.</CardDescription>
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

                 <Card className="bg-muted/50 p-6">
                     <CardTitle className="text-lg mb-4 flex items-center gap-2"><ListTodo/> Places to Visit</CardTitle>
                      <div className="space-y-4">
                          {fields.map((field, index) => (
                              <div key={field.id} className="flex items-start gap-2 p-3 rounded-md border bg-background">
                                  <div className="flex-grow">
                                      <p className="font-semibold">{index + 1}. {field.name}</p>
                                      <p className="text-sm text-muted-foreground pl-4">- {field.purpose}</p>
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-muted-foreground hover:text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              </div>
                          ))}
                          {fields.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No locations added yet.</p>}
                      </div>

                     <Separator className="my-6" />

                     <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel>Institution</FormLabel>
                                 <Select onValueChange={(value) => setCurrentVisit(v => ({...v, name: value}))} value={currentVisit.name}>
                                    <SelectTrigger><SelectValue placeholder="Select an institution..." /></SelectTrigger>
                                    <SelectContent>
                                        {OMAN_MINISTRIES.map(inst => <SelectItem key={inst} value={inst}>{inst}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                            <FormItem>
                                <FormLabel>Purpose of Visit</FormLabel>
                                <Input 
                                    placeholder="e.g., Renew Commercial Registration" 
                                    value={currentVisit.purpose}
                                    onChange={(e) => setCurrentVisit(v => ({...v, purpose: e.target.value}))}
                                />
                            </FormItem>
                        </div>
                        <Button type="button" variant="outline" onClick={handleAddVisit} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Add Place to Visit
                        </Button>
                     </div>
                 </Card>
                
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

      {response && form.getValues('visits').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Assignment Sheet: {new Date().toLocaleDateString()}</CardTitle>
            <CardDescription>Review the consolidated assignment below. You can print this page for your PRO.</CardDescription>
          </CardHeader>
          <CardContent ref={printRef} className="space-y-8 print-content">
             <Card className="bg-muted">
                <CardHeader><CardTitle>Trip Plan & Total Estimated Cost</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{response.tripDescription}</p>
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
             <Card>
                <CardHeader><CardTitle>Itinerary & Tasks</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {form.getValues('visits').map((visit, index) => (
                        <div key={index} className="p-3 border rounded-md">
                            <h3 className="font-semibold">{index + 1}. {visit.name}</h3>
                            <p className="text-sm text-muted-foreground purpose-note">Purpose: {visit.purpose}</p>
                            <div className="no-print mt-4">
                               <Textarea placeholder="Add notes for this task... (e.g., reason for non-completion)" rows={2} />
                            </div>
                        </div>
                    ))}
                </CardContent>
             </Card>
            <div className="no-print">
                <h3 className="font-semibold mb-2">General Notes for Today's Assignment</h3>
                <Textarea className="mt-2" placeholder="Add any general notes for the PRO for today's assignment..." />
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={handlePrint} className="w-full sm:w-auto">
                <Printer className="mr-2 h-4 w-4"/> Print Assignment
            </Button>
            <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto">
                <FileDown className="mr-2 h-4 w-4"/> Download as PDF
            </Button>
            <Button onClick={() => { setResponse(null); form.reset({ ...form.getValues(), visits: []}) }} variant="secondary" className="w-full sm:w-auto ml-auto">
                Start New Assignment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
