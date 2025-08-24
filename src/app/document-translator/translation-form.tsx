
'use client';

import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { translateDocument } from '@/ai/flows/document-translation';
import { type DocumentTranslationOutput } from '@/ai/flows/document-translation.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Download, Languages, FileCheck2, ShieldCheck, Checkbox, Stamp } from 'lucide-react';
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
  requestSealedCopy: z.boolean().default(false),
  translationOffice: z.string().optional(),
}).refine(data => {
    if (data.requestSealedCopy && !data.translationOffice) {
        return false;
    }
    return true;
}, {
    message: "Please select a translation office.",
    path: ["translationOffice"],
});


type FormValues = z.infer<typeof FormSchema>;

const languageOptions = [
    "English", "Arabic", "French", "Spanish", "German", "Chinese", "Russian", "Japanese", "Portuguese", "Italian"
];
const documentTypeOptions: FormValues['documentType'][] = [
    'Contract', 'Invoice', 'Medical Report', 'Certificate', 'Other'
];
const translationOffices = [
    "Al-Mutarjim Al-Awal Translation Services",
    "Global Horizons Certified Translators",
    "Muscat Legal & Business Translation",
];

const BASE_PRICE = 25; // Base price for AI translation
const SEALED_COPY_PRICE = 50; // Extra charge for sealed physical copy

export default function TranslationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DocumentTranslationOutput | null>(null);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceLanguage: 'English',
      targetLanguage: 'Arabic',
      documentType: 'Contract',
      requestSealedCopy: false,
    },
  });

  const requestSealedCopy = form.watch("requestSealedCopy");
  const price = useMemo(() => {
    return BASE_PRICE + (requestSealedCopy ? SEALED_COPY_PRICE : 0);
  }, [requestSealedCopy]);


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    setSubmittedData(null);
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
      setSubmittedData(data);

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

                <FormField
                  control={form.control}
                  name="requestSealedCopy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Request Sealed Physical Copy from an Approved Office
                        </FormLabel>
                        <FormDescription>
                          An official, sealed document will be delivered to your address within 2 business days for an additional fee.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {requestSealedCopy && (
                  <FormField
                    control={form.control}
                    name="translationOffice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Approved Translation Office</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an office..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {translationOffices.map(office => (
                              <SelectItem key={office} value={office}>{office}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...</>
                  ) : (
                     <><Sparkles className="mr-2 h-4 w-4" /> {`Translate Document ($${price.toFixed(2)})`}</>
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
             {submittedData?.requestSealedCopy && (
              <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                <Stamp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle>Physical Document Delivery</AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Your sealed, physical copy will be prepared and delivered by <strong>{submittedData.translationOffice}</strong> within 2 business days.
                </AlertDescription>
              </Alert>
            )}
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
           <CardFooter className="flex justify-between items-center">
             <Button onClick={() => { setResponse(null); setSubmittedData(null); form.reset();}}>Translate Another</Button>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload}><Download className="mr-2 h-4 w-4"/> Download</Button>
                <Button variant="outline" onClick={handleCopy}><Copy className="mr-2 h-4 w-4"/> Copy All</Button>
            </div>
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
