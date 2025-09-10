
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileText, Download } from 'lucide-react';
import { fillPdfForm } from '@/ai/flows/pdf-form-filler';
import { type FilledFormData } from '@/ai/flows/pdf-form-filler.schema';
import { fileToDataURI } from '@/lib/utils';

const FormSchema = z.object({
  pdfDocument: z.any().refine(file => file?.length == 1, 'PDF document is required.'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function FormFiller() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FilledFormData[] | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const pdfDataUri = await fileToDataURI(data.pdfDocument[0]);
        const result = await fillPdfForm({ pdfDataUri });
        setResponse(result);
        toast({ title: 'Form Filled!', description: 'AI has filled the form. Please review the results.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to fill the PDF form. Please ensure it is a valid, machine-readable PDF.',
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
          <CardTitle>Upload PDF Form</CardTitle>
          <CardDescription>Upload a PDF form you want to fill out. The AI will use your stored briefcase data to populate it.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pdfDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDF Document</FormLabel>
                    <FormControl>
                      <Input type="file" accept=".pdf" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Filling Form...</> : <><Sparkles className="mr-2 h-4 w-4" /> Fill Form with AI</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">The AI is analyzing and filling your form...</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Download</CardTitle>
            <CardDescription>The AI has filled the form. Review the results below and download the completed data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {response.map((field, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-center">
                <Label htmlFor={`field-${index}`} className="text-right col-span-1">{field.fieldName}</Label>
                <Input id={`field-${index}`} defaultValue={field.value} className="col-span-2" />
              </div>
            ))}
          </CardContent>
           <CardFooter className="justify-end">
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" /> Download Filled PDF (Coming Soon)
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
