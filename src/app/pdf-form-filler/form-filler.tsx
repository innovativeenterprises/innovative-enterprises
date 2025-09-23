
'use client';

import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileUp, Download } from 'lucide-react';
import { fileToDataURI } from '@/lib/utils';
import jsPDF from 'jspdf';
import { fillPdfForm, type FilledFormData } from '@/ai/flows/pdf-form-filler';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FormSchema = z.object({
  pdfFile: z.any().refine(file => file?.length == 1, 'A PDF file is required.'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function FormFiller() {
  const [isLoading, setIsLoading] = useState(false);
  const [filledData, setFilledData] = useState<FilledFormData | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const pdfDisplayRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setFilledData(null);
    setPdfPreviewUrl(null);
    try {
      const pdfDataUri = await fileToDataURI(data.pdfFile[0]);
      setPdfPreviewUrl(pdfDataUri);

      const result = await fillPdfForm({ pdfDataUri });
      setFilledData(result);
      toast({ title: 'Form Analyzed!', description: 'The AI has identified and mapped the form fields.' });
    } catch (error) {
      console.error("PDF analysis failed:", error);
      toast({ title: "Analysis Failed", description: "Could not process the PDF form.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfDisplayRef.current || !filledData) return;

    toast({ title: 'Generating PDF...', description: 'Please wait while we create your filled document.' });

    try {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = doc.internal.pageSize.getWidth();
        
        // Add the image first
        const pdfImage = new Image();
        pdfImage.src = pdfPreviewUrl!;
        await new Promise(resolve => { pdfImage.onload = resolve; });
        
        const canvas = document.createElement('canvas');
        canvas.width = pdfImage.width;
        canvas.height = pdfImage.height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(pdfImage, 0, 0);
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;
        const ratio = imgWidth / imgHeight;
        let finalWidth = pdfWidth;
        let finalHeight = finalWidth / ratio;
        
        doc.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);

        // Add text on top
        filledData.forEach(field => {
            doc.setFontSize(field.fontSize);
            doc.setTextColor('#0000FF'); // Blue color for filled text
            doc.text(field.value, field.x, field.y, { align: 'left' });
        });

        doc.save('filled-form.pdf');
    } catch (e) {
        toast({ title: "Download Failed", description: "Could not generate the PDF.", variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your PDF Form</CardTitle>
          <CardDescription>Select the PDF document you want to fill automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pdfFile"
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
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze & Fill Form</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /><p className="mt-2 text-muted-foreground">AI is reading the form...</p></CardContent></Card>
      )}

      {filledData && pdfPreviewUrl && (
        <Card>
            <CardHeader>
                <CardTitle>Review Filled Form</CardTitle>
                <CardDescription>The AI has filled the form based on your profile. Review the results below.</CardDescription>
            </CardHeader>
            <CardContent ref={pdfDisplayRef} className="relative">
                <img src={pdfPreviewUrl} alt="PDF Preview" className="w-full rounded-md" />
                {filledData.map((field, index) => (
                    <div
                        key={index}
                        className="absolute text-blue-600 font-sans"
                        style={{
                            left: `${field.x}px`,
                            top: `${field.y}px`,
                            fontSize: `${field.fontSize}px`,
                        }}
                        title={`Field: ${field.fieldName}\nReason: ${field.reasoning}`}
                    >
                        {field.value}
                    </div>
                ))}
            </CardContent>
            <CardContent>
                <Alert>
                    <AlertTitle>Identified Fields & Values</AlertTitle>
                    <AlertDescription>Review the data extracted and mapped by the AI.</AlertDescription>
                    <div className="max-h-60 overflow-y-auto mt-4">
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Field Name</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filledData.map((field, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{field.fieldName}</TableCell>
                                        <TableCell>{field.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Alert>
            </CardContent>
             <CardFooter>
                 <Button onClick={handleDownload} className="w-full"><Download className="mr-2 h-4 w-4"/>Download Filled PDF</Button>
             </CardFooter>
        </Card>
      )}
    </div>
  );
}
