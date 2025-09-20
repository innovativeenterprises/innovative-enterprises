
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
import { Loader2, Search, Link as LinkIcon, BookCopy, GraduationCap } from 'lucide-react';
import { ScholarshipFinderInputSchema, type ScholarshipFinderInput, type ScholarshipFinderOutput, type Scholarship } from '@/ai/flows/scholarship-agent.schema';
import { findScholarships } from '@/ai/flows/scholarship-agent';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Scholarship Finder | Innovative Enterprises",
  description: "Enter your field of study and desired level to let our AI search for relevant scholarship opportunities.",
};

const FormSchema = ScholarshipFinderInputSchema;
type FormValues = z.infer<typeof FormSchema>;

function ScholarshipFinderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ScholarshipFinderOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fieldOfStudy: '',
      studyLevel: 'Bachelors',
      country: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    toast({ title: "Searching for Scholarships...", description: "Rami is searching the web. This may take a minute." });
    try {
      const result = await findScholarships(data);
      setResponse(result);
      toast({ title: 'Search Complete!', description: `Found ${result.scholarships.length} potential scholarships.` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to find scholarships. Please try a different query.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const ScholarshipCard = ({ scholarship }: { scholarship: Scholarship }) => (
    <Card>
        <CardHeader>
            <CardTitle>{scholarship.scholarshipName}</CardTitle>
            <CardDescription>{scholarship.institution}, {scholarship.country}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm"><strong>Field of Study:</strong> {scholarship.fieldOfStudy}</p>
            <p className="text-sm mt-2"><strong>Eligibility:</strong> {scholarship.eligibilitySummary}</p>
            <p className="text-sm mt-2"><strong>Deadline:</strong> {scholarship.deadline}</p>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href={scholarship.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="mr-2 h-4 w-4" /> Visit Scholarship Page
                </Link>
            </Button>
        </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Find Scholarship Opportunities</CardTitle>
          <CardDescription>Specify your study preferences below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <div className="grid md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="fieldOfStudy" render={({ field }) => (
                    <FormItem><FormLabel>Field of Study</FormLabel><FormControl><Input placeholder="e.g., Artificial Intelligence" {...field} /></FormControl><FormMessage/></FormItem>
                 )}/>
                 <FormField control={form.control} name="studyLevel" render={({ field }) => (
                    <FormItem><FormLabel>Study Level</FormLabel><FormControl><Input placeholder="e.g., Bachelors, Masters, PhD" {...field} /></FormControl><FormMessage/></FormItem>
                 )}/>
              </div>
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem><FormLabel>Preferred Country (Optional)</FormLabel><FormControl><Input placeholder="e.g., UK, USA, Oman" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Searching...</> : <><Search className="mr-2 h-4 w-4" /> Find Scholarships</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <Card><CardContent className="p-6 text-center space-y-4"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="text-muted-foreground">The AI is searching the web for opportunities...</p></CardContent></Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>{response.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            {response.scholarships.length > 0 ? (
                 <div className="grid md:grid-cols-2 gap-6">
                    {response.scholarships.map((scholarship, index) => <ScholarshipCard key={index} scholarship={scholarship} />)}
                </div>
            ) : (
                <Alert>
                    <BookCopy className="h-4 w-4"/>
                    <AlertTitle>No Matches Found</AlertTitle>
                    <AlertDescription>We couldn't find any scholarships matching your criteria. Try broadening your search terms.</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ScholarshipFinderPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
         <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto space-y-8">
                 <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <GraduationCap className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Scholarship Finder</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Enter your field of study and desired level to let our AI search for relevant scholarship opportunities.
                    </p>
                </div>
                <ScholarshipFinderForm />
            </div>
        </div>
    </div>
  );
}
