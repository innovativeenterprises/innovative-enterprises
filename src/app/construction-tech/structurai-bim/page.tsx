'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, FileUp, Cpu, Layers } from 'lucide-react';
import { detectBimClashes, type BimClashDetectionOutput, type Clash } from '@/ai/flows/bim-clash-detection';
import { fileToDataURI } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const FormSchema = z.object({
  modelFile: z.any().refine(file => file?.length == 1, 'A BIM model file is required.'),
});
type FormValues = z.infer<typeof FormSchema>;

const severityMap = {
    'High': 'destructive',
    'Medium': 'default',
    'Low': 'secondary'
} as const;

export default function StructurAiBimPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<BimClashDetectionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const modelFileUri = await fileToDataURI(data.modelFile[0]);
      
      const result = await detectBimClashes({ 
        modelFileUri,
        fileName: data.modelFile[0].name,
       });
       
      setResponse(result);
      toast({
        title: 'Clash Detection Complete!',
        description: `Found ${result.clashes.length} potential clashes in your model.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the BIM model. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Cpu className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">StructurAI BIM</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Automated clash detection and material optimization for Building Information Models. Upload your BIM file (.ifc, .rvt) and our AI will identify potential conflicts between structural, MEP, and architectural elements.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Analyze BIM Model</CardTitle>
                    <CardDescription>Upload your model file to begin the automated clash detection process.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="modelFile"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BIM Model File (.ifc, .rvt, etc.)</FormLabel>
                                    <FormControl>
                                    <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                                {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Model...</>
                                ) : (
                                <><Sparkles className="mr-2 h-4 w-4" />Detect Clashes</>
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
                        <p className="mt-4 text-muted-foreground">StructurAI is analyzing millions of data points in your model...</p>
                    </CardContent>
                </Card>
            )}

            {response && (
                <Card>
                    <CardHeader>
                        <CardTitle>Clash Detection Report</CardTitle>
                        <CardDescription>
                            Analysis of <span className="font-semibold">{response.fileName}</span> completed. Found <span className="font-bold text-primary">{response.clashes.length}</span> potential clashes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Element IDs</TableHead>
                                    <TableHead>Recommendation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {response.clashes.map((clash: Clash, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell><Badge variant={severityMap[clash.severity]}>{clash.severity}</Badge></TableCell>
                                        <TableCell>{clash.description}</TableCell>
                                        <TableCell className="font-mono text-xs">{clash.elementIds.join(', ')}</TableCell>
                                        <TableCell>{clash.recommendation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
