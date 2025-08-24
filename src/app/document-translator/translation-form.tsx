'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { translateDocument } from '@/ai/flows/document-translation';
import { type DocumentTranslationOutput } from '@/ai/flows/document-translation.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Download, Languages, FileCheck2, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  documentFile: z.any().refine(file => file?.length == 1, 'Document file is required.'),
  sourceLanguage: z.string().min(1, "Source language is required."),
  targetLanguage: z.string().min(1, "Target language is required."),
  documentType: z.enum(['Contract', 'Invoice', 'Medical Report', 'Certificate', 'Other']),
});

type FormValues = z.infer<typeof FormSchema>;

const languageOptions = [
    "English", "Arabic", "French", "Spanish", "German", "Chinese", "Russian", "Japanese", "Portuguese", "Italian"
];
const documentTypeOptions: FormValues['documentType'][] = [
    'Contract', 'Invoice', 'Medical Report', 'Certificate', 'Other'
];

export default function TranslationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DocumentTranslationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceLanguage: 'English',
      targetLanguage: 'Arabic',
      documentType: 'Contract',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const file = data.documentFile[0];
      const documentDataUri = await fileToDataURI(file);

      const result = await translateDocument({
          documentDataUri,
          sourceLanguage: data.sourceLanguage,
          targetLanguage: data.targetLanguage,
          documentType: data.documentType,
      });

      setResponse(result);
      toast({
        title: 'Translation Complete!',
        description: 'Your document has been successfully translated.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to translate the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!response) return;
    const element = document.createElement("a");
    const file = new Blob([response.translatedContent + "\n\n" + response.verificationStatement], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `translated-document.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: 'Downloaded!', description: `Your translated document has been downloaded.`});
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response.translatedContent + "\n\n" + response.verificationStatement);
    toast({ title: 'Copied!', description: 'Translated content copied to clipboard.'});
  };
  
  const targetLanguage = form.watch("targetLanguage");

  return (
    <div className="space-y-8">
      {!response ? (
        <Card>
          <CardHeader>
            <CardTitle>Translate a Document</CardTitle>
            <CardDescription>Upload your document and specify the translation details. Your document is processed securely and is not stored.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="documentFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document to Translate</FormLabel>
                      <FormControl>
                        <Input type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypeOptions.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sourceLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {languageOptions.map(lang => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {languageOptions.map(lang => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...</>
                  ) : (
                     <><Sparkles className="mr-2 h-4 w-4" /> Translate Document</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileCheck2 /> Translation Complete</CardTitle>
            <CardDescription>Your document has been translated by Voxi. You can copy or download the result.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Translated Content</h3>
              <div 
                className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto"
                dir={targetLanguage === 'Arabic' ? 'rtl' : 'ltr'}
              >
                {response.translatedContent}
              </div>
            </div>
            <div>
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Statement of Translation Accuracy</AlertTitle>
                <AlertDescription>
                  {response.verificationStatement}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
           <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleDownload}><Download className="mr-2 h-4 w-4"/> Download</Button>
                <Button variant="outline" onClick={handleCopy}><Copy className="mr-2 h-4 w-4"/> Copy All</Button>
                <Button onClick={() => setResponse(null)}>Translate Another</Button>
            </CardFooter>
        </Card>
      )}

      {isLoading && !response && (
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Voxi is processing your document... This may take a moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
