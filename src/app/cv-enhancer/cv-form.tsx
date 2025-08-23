'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { enhanceCv } from '@/ai/flows/cv-enhancement';
import { type CvEnhancementOutput } from '@/ai/flows/cv-enhancement.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

const FormSchema = z.object({
  cvDocument: z.any().refine(file => file?.length == 1, 'CV document is required.'),
});

type FormValues = z.infer<typeof FormSchema>;

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const SuggestionSection = ({ title, data }: { title: string; data: { isCompliant: boolean; suggestions: string[] } }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="border rounded-lg p-4">
                <CollapsibleTrigger className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        {data.isCompliant ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <h4 className="font-semibold">{title}</h4>
                        <Badge variant={data.isCompliant ? "default" : "destructive"}>
                            {data.isCompliant ? "Compliant" : "Needs Improvement"}
                        </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <ul className="list-disc pl-8 mt-2 space-y-1 text-sm text-muted-foreground">
                        {data.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}

export default function CvForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<CvEnhancementOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const file = data.cvDocument[0];
        const cvDataUri = await fileToDataURI(file);
      
        const result = await enhanceCv({ cvDataUri });

        setResponse(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to enhance CV. Please try again.',
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
          <CardTitle>Upload Your CV</CardTitle>
          <CardDescription>Our AI will analyze your CV for ATS compatibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cvDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CV Document</FormLabel>
                    <FormControl>
                        <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                   <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance My CV
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
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your CV... This may take a moment.</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>CV Enhancement Report</CardTitle>
            <CardDescription>{response.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Overall ATS Score</h3>
                <span className="font-bold text-lg text-primary">{response.overallScore}/100</span>
              </div>
              <Progress value={response.overallScore} className="w-full" />
            </div>

            <div className="space-y-4 pt-4">
                <SuggestionSection title="Contact Information" data={response.contactInfo} />
                <SuggestionSection title="Work Experience" data={response.workExperience} />
                <SuggestionSection title="Skills Section" data={response.skills} />
                <SuggestionSection title="Education" data={response.education} />
                <SuggestionSection title="Formatting & Parsing" data={response.formatting} />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              This report is AI-generated. Use these suggestions to improve your CV before applying for jobs.
            </p>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
