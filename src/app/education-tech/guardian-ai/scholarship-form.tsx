
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, BookCopy, FileText } from 'lucide-react';
import { ScholarshipFinderInputSchema, type ScholarshipFinderInput, type ScholarshipFinderOutput, type Scholarship } from '@/ai/flows/scholarship-agent.schema';
import { findScholarships } from '@/ai/flows/scholarship-agent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ScholarshipEssayAssistant } from './scholarship-essay-assistant';
import { useStudentsData } from '@/hooks/use-global-store-data';

export default function ScholarshipFinderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ScholarshipFinderOutput | null>(null);
  const { toast } = useToast();
  const { students } = useStudentsData();

  const form = useForm<ScholarshipFinderInput>({
    resolver: zodResolver(ScholarshipFinderInputSchema),
    defaultValues: {
      fieldOfStudy: "Artificial Intelligence",
      studyLevel: "Bachelor's Degree",
      country: "Oman",
    },
  });

  const onSubmit: SubmitHandler<ScholarshipFinderInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await findScholarships(data);
      setResponse(result);
      toast({ title: 'Search Complete!', description: `Found ${result.scholarships.length} potential scholarships.` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to find scholarships. The research agent might be busy.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const ScholarshipCard = ({ scholarship }: { scholarship: Scholarship }) => (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>{scholarship.scholarshipName}</CardTitle>
        <CardDescription>{scholarship.institution} - {scholarship.country}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm"><strong>Field of Study:</strong> {scholarship.fieldOfStudy}</p>
        <p className="text-sm mt-2"><strong>Eligibility:</strong> {scholarship.eligibilitySummary}</p>
        <p className="text-sm mt-2"><strong>Deadline:</strong> {scholarship.deadline}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Draft Essay</Button>
            </DialogTrigger>
            <ScholarshipEssayAssistant student={students[0]} />
        </Dialog>
        <Button asChild>
          <a href={scholarship.sourceUrl} target="_blank" rel="noopener noreferrer">Visit Source</a>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Find Scholarship Opportunities</CardTitle>
          <CardDescription>Enter your study details and let our AI research agent find opportunities for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="fieldOfStudy" render={({ field }) => (
                        <FormItem><FormLabel>Field of Study</FormLabel><FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                     <FormField control={form.control} name="studyLevel" render={({ field }) => (
                        <FormItem><FormLabel>Study Level</FormLabel><FormControl><Input placeholder="e.g., Master's Degree" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                </div>
                 <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem><FormLabel>Preferred Country (Optional)</FormLabel><FormControl><Input placeholder="e.g., United Kingdom" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Searching...</> : <><Sparkles className="mr-2 h-4 w-4" /> Find Scholarships</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto"/><p className="mt-2 text-muted-foreground">Rami is searching the web for scholarships...</p></CardContent></Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>{response.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {response.scholarships.length > 0 ? (
                response.scholarships.map((scholarship, index) => <ScholarshipCard key={index} scholarship={scholarship} />)
            ) : (
                <p className="text-center text-muted-foreground">No matching scholarships found at this time.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
