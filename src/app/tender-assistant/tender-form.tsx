'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateTenderResponse, type GenerateTenderResponseOutput } from '@/ai/flows/tender-response-assistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy } from 'lucide-react';

const FormSchema = z.object({
  tenderDocuments: z.any().refine(file => file?.length == 1, 'Tender document is required.'),
  projectRequirements: z.string().min(10, 'Project requirements must be at least 10 characters.'),
});

type FormValues = z.infer<typeof FormSchema>;

// Helper function to convert a file to a data URI
const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function TenderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateTenderResponseOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectRequirements: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const file = data.tenderDocuments[0];
        const tenderDocuments = await fileToDataURI(file);
      
        const result = await generateTenderResponse({
            tenderDocuments,
            projectRequirements: data.projectRequirements,
        });

        setResponse(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate tender response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generate Draft Response</CardTitle>
          <CardDescription>Fill in the details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="tenderDocuments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tender Document</FormLabel>
                    <FormControl>
                        <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the key project requirements, objectives, and evaluation criteria..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                   <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Response
                   </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card className="mt-8">
            <CardContent className="p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your documents and crafting a response... This may take a moment.</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Draft Response</CardTitle>
            <CardDescription>Review and refine the AI-generated draft below. You can copy and paste it into your proposal document.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                readOnly
                value={response.draftResponse}
                rows={20}
                className="bg-muted pr-12"
              />
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(response.draftResponse);
                    toast({ title: "Copied!", description: "The draft response has been copied to your clipboard." });
                  }}
                >
                  <Copy className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
