'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BrainCircuit, X, PlusCircle, CheckCircle, FileText, HelpCircle, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trainAgent } from '@/ai/flows/train-agent';
import { type TrainAgentOutput } from '@/ai/flows/train-agent.schema';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  agentId: z.string().min(1, "Please select an agent to train."),
  knowledgeDocuments: z.any().optional(),
  qaPairs: z.array(z.object({
    question: z.string().min(1, 'Question cannot be empty.'),
    answer: z.string().min(1, 'Answer cannot be empty.'),
  })).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const availableAgents = [
    { id: 'Aida_FAQ', name: 'Aida - FAQ Bot' },
    { id: 'Lexi_Legal', name: 'Lexi - Legal & Contracts Agent' },
    { id: 'Hira_HR', name: 'Hira - HR & Recruitment Agent' },
    { id: 'Noor_Copywriting', name: 'Noor - Copywriting Agent' },
];

export default function TrainingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<TrainAgentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      agentId: '',
      qaPairs: [{ question: '', answer: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "qaPairs",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);

    if ((!data.knowledgeDocuments || data.knowledgeDocuments.length === 0) && (!data.qaPairs || data.qaPairs.length === 0 || data.qaPairs.every(p => !p.question && !p.answer)))) {
        toast({
            title: 'No Training Data',
            description: 'Please upload at least one knowledge document or provide at least one Q&A pair.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }

    try {
      let knowledgeDocuments: string[] = [];
      if (data.knowledgeDocuments && data.knowledgeDocuments.length > 0) {
        knowledgeDocuments = await Promise.all(
          Array.from(data.knowledgeDocuments as FileList).map(file => fileToDataURI(file))
        );
      }
      
      const nonEmptyQaPairs = data.qaPairs?.filter(p => p.question && p.answer);

      const result = await trainAgent({
        agentId: data.agentId,
        knowledgeDocuments,
        qaPairs: nonEmptyQaPairs,
      });

      setResponse(result);
      toast({
        title: 'Training Job Submitted!',
        description: `Job ID: ${result.jobId} is now queued.`,
      });

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to submit training job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {!response ? (
        <Card>
          <CardHeader>
            <CardTitle>Submit a New Training Job</CardTitle>
            <CardDescription>Select an agent and provide training data. You can provide documents, Q&A pairs, or both.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="agentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Agent to Train</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select from available agents..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableAgents.map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><UploadCloud /> Knowledge Documents</CardTitle>
                        <CardDescription>Upload PDF, TXT, or DOCX files containing information you want the agent to learn.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <FormField
                            control={form.control}
                            name="knowledgeDocuments"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="file" multiple accept=".pdf,.txt,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><HelpCircle /> Question & Answer Pairs</CardTitle>
                        <CardDescription>Provide specific questions and the exact answers you want the agent to give. This is highly effective for training.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-background">
                            <div className="flex-grow space-y-2">
                                <FormField
                                    control={form.control}
                                    name={`qaPairs.${index}.question`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question</FormLabel>
                                        <FormControl>
                                            <Input placeholder={`Question ${index + 1}`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`qaPairs.${index}.answer`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Answer</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={`Answer ${index + 1}`} {...field} rows={3} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-6 text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ question: '', answer: '' })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Q&A Pair
                        </Button>
                    </CardContent>
                </Card>
                
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Training Job...</>
                  ) : (
                    <><BrainCircuit className="mr-2 h-5 w-5" /> Start Training Job</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader className="items-center text-center">
                <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-2xl">Training Job Submitted Successfully</CardTitle>
                <CardDescription>{response.message}</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertTitle>Job Details</AlertTitle>
                    <AlertDescription>
                        <div className="flex justify-between"><span>Job ID:</span> <span className="font-mono text-xs">{response.jobId}</span></div>
                        <div className="flex justify-between"><span>Status:</span> <span>{response.status}</span></div>
                        <div className="flex justify-between"><span>Agent:</span> <span>{form.getValues('agentId')}</span></div>
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <p className="text-sm text-muted-foreground text-center">
                    Neo will now process the data. You can submit another job or navigate away from this page.
                </p>
                <Button onClick={() => { setResponse(null); form.reset({ agentId: '', qaPairs: [{ question: '', answer: '' }]}); }} className="w-full">
                    Submit Another Training Job
                </Button>
            </CardFooter>
        </Card>
      )}

      {isLoading && !response && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Submitting job to Neo... This may take a moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
