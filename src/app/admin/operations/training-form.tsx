
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trainAgent } from '@/ai/flows/train-agent';
import { type TrainAgentInput, type TrainAgentOutput } from '@/ai/flows/train-agent.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Bot, PlusCircle, Trash2, CheckCircle, FileUp, ListChecks } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initialAgentCategories } from '@/lib/agents';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const QaPairSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty.'),
  answer: z.string().min(1, 'Answer cannot be empty.'),
});

const FormSchema = z.object({
  agentId: z.string().min(1, "Please select an agent to train."),
  knowledgeDocuments: z.any().optional(),
  qaPairs: z.array(QaPairSchema).optional(),
});
type FormValues = z.infer<typeof FormSchema>;

const allAgents = initialAgentCategories.flatMap(category => category.agents);

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
    name: "qaPairs"
  });


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);

    try {
      let knowledgeDocuments: string[] | undefined;
      if (data.knowledgeDocuments && data.knowledgeDocuments.length > 0) {
        const docPromises = Array.from(data.knowledgeDocuments as FileList).map(fileToDataURI);
        knowledgeDocuments = await Promise.all(docPromises);
      }
      
      const result = await trainAgent({ 
        agentId: data.agentId,
        qaPairs: data.qaPairs,
        knowledgeDocuments: knowledgeDocuments,
      });

      setResponse(result);
      toast({ title: 'Training Job Submitted', description: result.message });

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
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Training Center</CardTitle>
          <CardDescription>Fine-tune your AI agents by providing them with new knowledge documents or specific question-answer pairs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="agentId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Select Agent to Train</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an AI agent..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {allAgents.map(agent => (
                                <SelectItem key={agent.name} value={agent.name}>{agent.name} ({agent.role})</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="knowledgeDocuments"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileUp className="h-5 w-5"/> Upload Knowledge Documents (Optional)</FormLabel>
                        <FormControl>
                            <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <div>
                    <Label className="flex items-center gap-2 mb-4"><ListChecks className="h-5 w-5"/> Add Question & Answer Pairs (Optional)</Label>
                    <div className="space-y-4">
                    {fields.map((field, index) => (
                         <Card key={field.id} className="p-4 bg-muted/50 relative">
                            <div className="space-y-2">
                                <FormField
                                control={form.control}
                                name={`qaPairs.${index}.question`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question</FormLabel>
                                        <FormControl><Input placeholder="What is the capital of Oman?" {...field} /></FormControl>
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
                                        <FormControl><Textarea placeholder="The capital of Oman is Muscat." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ question: '', answer: '' })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Q&A Pair
                    </Button>
                    </div>
                </div>


              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Training Job...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Start Training</>
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
                <p className="mt-4 text-muted-foreground">Submitting your data to the training pipeline...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
            <CardContent className="p-6">
                 <Alert>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Training Job Submitted Successfully</AlertTitle>
                    <AlertDescription className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                        <span className="font-semibold">Agent:</span><span>{form.getValues('agentId')}</span>
                        <span className="font-semibold">Job ID:</span><span className="font-mono text-xs">{response.jobId}</span>
                        <span className="font-semibold">Status:</span><span><Badge>{response.status}</Badge></span>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
