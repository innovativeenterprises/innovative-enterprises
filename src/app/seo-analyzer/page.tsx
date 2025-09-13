
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Search, CheckCircle, XCircle } from 'lucide-react';
import { SeoAnalysisInputSchema, type SeoAnalysisOutput } from '@/ai/flows/seo-analyzer.schema';
import { analyzeSeo } from '@/ai/flows/seo-analyzer';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const FormSchema = SeoAnalysisInputSchema;
type FormValues = z.infer<typeof FormSchema>;

const RecommendationCard = ({ title, analysis }: { title: string, analysis: { isCompliant: boolean, recommendation: string } }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                 {analysis.isCompliant ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
        </CardContent>
    </Card>
);

export default function SeoAnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SeoAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
      keyword: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeSeo(data);
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your SEO report is ready below.' });
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error Analyzing URL',
        description: error.message || 'Please check the URL and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Search className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI SEO Analyzer</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter a webpage URL and a target keyword. Serp, our SEO agent, will perform a detailed on-page analysis and provide actionable recommendations.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Start New Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="url" render={({ field }) => (
                                <FormItem><FormLabel>Webpage URL</FormLabel><FormControl><Input placeholder="https://example.com/your-page" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="keyword" render={({ field }) => (
                                <FormItem><FormLabel>Target Keyword</FormLabel><FormControl><Input placeholder="e.g., 'Oman tour packages'" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analyzing Page...</> : <><Sparkles className="mr-2 h-4 w-4"/> Analyze SEO</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isLoading && (
                <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto"/><p className="mt-2 text-muted-foreground">Serp is analyzing the page...</p></CardContent></Card>
            )}

            {response && (
                <Card>
                    <CardHeader>
                        <CardTitle>SEO Analysis Report</CardTitle>
                        <CardDescription>Generated for your target keyword: "{form.getValues('keyword')}"</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold mb-2">Overall SEO Score</h3>
                            <div className="flex items-center gap-4">
                                <Progress value={response.seoScore} className="h-4"/>
                                <span className="font-bold text-xl text-primary">{response.seoScore}/100</span>
                            </div>
                        </div>
                        <Alert>
                            <AlertTitle>AI Summary</AlertTitle>
                            <AlertDescription>{response.summary}</AlertDescription>
                        </Alert>
                         <div className="grid md:grid-cols-2 gap-6">
                            <RecommendationCard title="Page Title" analysis={response.titleAnalysis} />
                            <RecommendationCard title="Meta Description" analysis={response.metaDescriptionAnalysis} />
                        </div>
                         <RecommendationCard title="Headings (H1, H2)" analysis={response.headingsAnalysis} />
                         <Card>
                            <CardHeader><CardTitle className="text-lg">Content Analysis</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-sm"><strong>Keyword Density:</strong> <Badge variant="secondary">{response.contentAnalysis.keywordDensity}</Badge></p>
                                <p className="text-sm mt-4 text-muted-foreground">{response.contentAnalysis.contentAnalysis.recommendation}</p>
                            </CardContent>
                         </Card>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
