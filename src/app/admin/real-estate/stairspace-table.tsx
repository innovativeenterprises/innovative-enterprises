'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Opportunity, OpportunityBadgeVariant } from "@/lib/opportunities.schema";
import { opportunityIconMap } from "@/lib/opportunities";
import { OpportunitySchema, type OpportunityValues } from "@/lib/opportunities.schema";
import { PlusCircle, Edit, Trash2, Trophy, Loader2, Sparkles, Bot, FileText, BadgePercent, TrendingUp, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOpportunitiesData } from "@/hooks/use-global-store-data";
import { analyzeWorkOrder, type WorkOrderAnalysisOutput, WorkOrderInputSchema } from '@/ai/flows/work-order-analysis';
import { fileToDataURI } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// WorkOrderForm Logic
const WorkOrderFormSchema = WorkOrderInputSchema.extend({
  documentFile: z.any().optional(),
});
type WorkOrderFormValues = z.infer<typeof WorkOrderFormSchema>;

function WorkOrderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<WorkOrderAnalysisOutput | null>(null);
  const { toast } = useToast();
  const { setOpportunities } = useOpportunitiesData();


  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(WorkOrderFormSchema),
    defaultValues: {
        title: '',
        description: '',
        budget: '',
        timeline: '',
    },
  });

  const onSubmit: SubmitHandler<WorkOrderFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      let documentDataUri: string | undefined;
      if (data.documentFile && data.documentFile.length > 0) {
        documentDataUri = await fileToDataURI(data.documentFile[0]);
      }
      
      const result = await analyzeWorkOrder({ 
          ...data,
          documentDataUri,
      });
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your idea has been analyzed by our AI.' });

      const iconName = Object.keys(opportunityIconMap).find(key => key.toLowerCase().includes(result.category.split(" ")[0].toLowerCase())) as keyof typeof opportunityIconMap || 'Trophy';

      const newOpportunity: Opportunity = {
          id: `opp_${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          title: data.title,
          type: result.category,
          prize: data.budget || 'Negotiable',
          deadline: data.timeline || 'To be determined',
          description: result.summary,
          iconName,
          badgeVariant: 'outline',
          status: 'Open',
          questions: result.generatedQuestions,
      };
      setOpportunities(prev => [newOpportunity, ...prev]);

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the submission. Please try again.',
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
          <CardTitle>Submit Your Idea</CardTitle>
          <CardDescription>Provide details about your project, task, or startup idea. Our AI will analyze it for categorization and potential.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title / Project Name</FormLabel><FormControl><Input placeholder="e.g., AI-powered personal finance app" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Detailed Description</FormLabel><FormControl><Textarea placeholder="Describe the problem, your proposed solution, and the target audience." rows={8} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="budget" render={({ field }) => (<FormItem><FormLabel>Estimated Budget (Optional)</FormLabel><FormControl><Input placeholder="e.g., 10,000 OMR" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="timeline" render={({ field }) => (<FormItem><FormLabel>Expected Timeline (Optional)</FormLabel><FormControl><Input placeholder="e.g., 3-6 months" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
                <FormField control={form.control} name="documentFile" render={({ field }) => (
                  <FormItem><FormLabel>Attach Supporting Document (Optional)</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Submission...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze Idea with AI</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {isLoading && <Card><CardContent className="p-6 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /><p className="mt-4 text-muted-foreground">Our AI agents are analyzing your submission...</p></CardContent></Card>}
      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6"/> AI Analysis Report</CardTitle>
            <CardDescription>Your submission has been categorized as a <span className="font-semibold text-primary">{response.category}</span> and added to the Opportunities table below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div><h3 className="font-semibold text-lg mb-2">Opportunity Summary</h3><p className="text-sm text-muted-foreground p-4 bg-muted rounded-md border">{response.summary}</p></div>
            <div><h3 className="font-semibold text-lg mb-2">Potential Scores</h3><div className="grid grid-cols-3 gap-4">
                <Card className="text-center p-3"><BadgePercent className="mx-auto h-6 w-6 text-primary mb-1"/><p className="text-2xl font-bold">{response.noveltyScore}</p><p className="text-xs text-muted-foreground">Novelty</p></Card>
                <Card className="text-center p-3"><TrendingUp className="mx-auto h-6 w-6 text-primary mb-1"/><p className="text-2xl font-bold">{response.marketPotentialScore}</p><p className="text-xs text-muted-foreground">Market Potential</p></Card>
                <Card className="text-center p-3"><Lightbulb className="mx-auto h-6 w-6 text-primary mb-1"/><p className="text-2xl font-bold">{response.impactScore}</p><p className="text-xs text-muted-foreground">Impact</p></Card>
            </div></div>
            <div><h3 className="font-semibold text-lg mb-2">Clarifying Questions for Providers</h3><ul className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">{response.generatedQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
            <Alert><AlertTitle>Next Steps</AlertTitle><AlertDescription>{response.recommendedNextSteps}</AlertDescription></Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// AddEditOpportunityDialog Logic
const AddEditOpportunityDialog = ({ 
    opportunity, onSave, children, isOpen, onOpenChange,
}: { 
    opportunity?: Opportunity, onSave: (values: OpportunityValues & { iconName: keyof typeof opportunityIconMap, badgeVariant: OpportunityBadgeVariant }, id?: string) => void, children: React.ReactNode, isOpen: boolean, onOpenChange: (open: boolean) => void,
}) => {
    const form = useForm<OpportunityValues>({ resolver: zodResolver(OpportunitySchema) });
    useEffect(() => { if(isOpen) form.reset(opportunity || { title: "", type: "", prize: "", deadline: "", description: "", status: "Open" }); }, [opportunity, form, isOpen]);
    const onSubmit: SubmitHandler<OpportunityValues> = (data) => {
        const iconName = Object.keys(opportunityIconMap).find(key => key.toLowerCase().includes(data.type.split(" ")[0].toLowerCase())) as keyof typeof opportunityIconMap || 'Trophy';
        const badgeVariant: OpportunityBadgeVariant = data.type.toLowerCase().includes('competition') ? 'default' : data.type.toLowerCase().includes('project') ? 'destructive' : 'secondary';
        onSave({ ...data, iconName, badgeVariant }, opportunity?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader><DialogTitle>{opportunity ? "Edit" : "Add"} Opportunity</DialogTitle><DialogDescription>{opportunity ? "Update the details for this opportunity." : "Enter the details for the new opportunity."}</DialogDescription></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="type" render={({ field }) => <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., Design Competition" {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="status" render={({ field }) => <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Open">Open</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="prize" render={({ field }) => <FormItem><FormLabel>Prize / Budget</FormLabel><FormControl><Input placeholder="e.g., 5,000 OMR" {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="deadline" render={({ field }) => <FormItem><FormLabel>Deadline</FormLabel><FormControl><Input placeholder="e.g., 2024-09-01" {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                    <FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>} />
                    <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save Opportunity</Button></DialogFooter>
                </form></Form>
            </DialogContent>
        </Dialog>
    )
}

export default function AdminOpportunitiesPage() {
    const { opportunities, setOpportunities, isClient } = useOpportunitiesData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | undefined>(undefined);

    const openDialog = (opp?: Opportunity) => { setSelectedOpp(opp); setIsDialogOpen(true); }

    const handleSave = (values: OpportunityValues & { iconName: keyof typeof opportunityIconMap, badgeVariant: OpportunityBadgeVariant }, id?: string) => {
        if (id) {
            setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, ...values } : opp));
            toast({ title: "Opportunity updated successfully." });
        } else {
            const newOpp: Opportunity = { ...values, id: `opp_${values.title.toLowerCase().replace(/\s+/g, '_')}` };
            setOpportunities(prev => [newOpp, ...prev]);
            toast({ title: "Opportunity added successfully." });
        }
    };
    
    const handleDelete = (id: string) => { setOpportunities(prev => prev.filter(opp => opp.id !== id)); toast({ title: "Opportunity removed.", variant: "destructive" }); };
    
    return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">Manage all open projects, tasks, and competitions available to your partner network.</p>
        </div>
        <WorkOrderForm />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Opportunities & Competitions</CardTitle><CardDescription>Manage the open tasks and projects available to your partner network.</CardDescription></div>
                <Button onClick={() => openDialog()}><PlusCircle /> Add Opportunity</Button>
            </CardHeader>
            <CardContent>
                <AddEditOpportunityDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} opportunity={selectedOpp} onSave={handleSave}><div /></AddEditOpportunityDialog>
                <Table>
                    <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Prize/Budget</TableHead><TableHead>Deadline</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {!isClient ? <TableRow><TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell></TableRow> : opportunities.map(opp => (
                            <TableRow key={opp.id}>
                                <TableCell className="font-medium">{opp.title}</TableCell><TableCell>{opp.type}</TableCell><TableCell>{opp.prize}</TableCell><TableCell>{opp.deadline}</TableCell><TableCell>{opp.status}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openDialog(opp)}><Edit /></Button>
                                        <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Delete Opportunity?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{opp.title}".</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(opp.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent></AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
    );
}