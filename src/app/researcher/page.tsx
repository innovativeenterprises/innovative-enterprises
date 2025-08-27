
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
import { Loader2, Sparkles, Search, Globe, FileText, ListChecks } from 'lucide-react';
import { WebScraperInputSchema, type WebScraperInput, type WebScraperOutput } from '@/ai/flows/web-scraper-agent.schema';
import { scrapeAndSummarize } from '@/ai/flows/web-scraper-agent';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function ResearcherPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<WebScraperOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<WebScraperInput>({
    resolver: zodResolver(WebScraperInputSchema.extend({ source: z.string().min(3) })),
    defaultValues: {
      source: '',
      isUrl: false,
    },
  });

  const onSubmit: SubmitHandler<WebScraperInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);

    // Simple check to see if the input is likely a URL
    const isUrl = data.source.startsWith('http://') || data.source.startsWith('https://');
    const inputData: WebScraperInput = {
      source: data.source,
      isUrl: isUrl,
    };

    try {
      const result = await scrapeAndSummarize(inputData);
      setResponse(result);
      toast({
        title: 'Research Complete!',
        description: 'The content has been scraped and summarized.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to process the request. Please check the URL or your query.',
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
              <Search className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Data Miner</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your AI-powered research assistant. Scrape data from any URL or perform a web search to gather and summarize information quickly. This tool is powered by Rami, our Strategy & Research Agent.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Start Your Research</CardTitle>
                <CardDescription>Enter a URL to scrape a specific page, or type a query to search the web.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL or Search Query</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g., https://www.innovativeenterprises.tech or 'market trends in AI'" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching...</>
                            ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Scrape & Summarize</>
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
                        <p className="mt-4 text-muted-foreground">Rami is gathering data. This may take a moment...</p>
                    </CardContent>
                </Card>
            )}

            {response && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <FileText className="h-6 w-6"/> {response.title || "Research Summary"}
                        </CardTitle>
                        {response.source && (
                            <CardDescription>
                                Source: <Link href={response.source} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">{response.source}</Link>
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Summary</h3>
                            <div className="prose prose-sm max-w-full text-foreground whitespace-pre-wrap p-4 bg-muted rounded-md border">
                                {response.summary}
                            </div>
                        </div>
                        {response.keyPoints && response.keyPoints.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><ListChecks className="h-5 w-5"/> Key Points</h3>
                                <Alert>
                                    <AlertDescription>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {response.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

        </div>
      </div>
    </div>
  );
}
