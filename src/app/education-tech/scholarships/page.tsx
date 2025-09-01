
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
import { Loader2, Sparkles, BrainCircuit, BookOpen, MapPin, Calendar, Check, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { ScholarshipFinderInputSchema, type ScholarshipFinderInput, type ScholarshipFinderOutput, type Scholarship } from '@/ai/flows/scholarship-agent.schema';
import { findScholarships } from '@/ai/flows/scholarship-agent';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function ScholarshipPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ScholarshipFinderOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ScholarshipFinderInput>({
    resolver: zodResolver(ScholarshipFinderInputSchema),
    defaultValues: {
      fieldOfStudy: '',
      studyLevel: 'Bachelors',
      country: '',
    },
  });

  const onSubmit: SubmitHandler<ScholarshipFinderInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    toast({ title: "Finding Scholarships...", description: "Our AI is researching opportunities for you. This may take a moment." });
    try {
      const result = await findScholarships(data);
      setResponse(result);
      if (result.scholarships.length > 0) {
          toast({ title: 'Success!', description: `Found ${result.scholarships.length} potential scholarship opportunities.` });
      } else {
          toast({ title: 'No Results', description: 'Could not find any matching scholarships based on your query.', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to find scholarships. The research agents might be busy. Please try again.',
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
              <BrainCircuit className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Scholarship Finder</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us your academic goals, and our AI will search the web to find relevant scholarship opportunities for you.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Start Your Search</CardTitle>
                    <CardDescription>Enter your field of study and desired level to begin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="fieldOfStudy"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Field of Study</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Computer Science, Medicine" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="studyLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Study Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Bachelors">Bachelors</SelectItem>
                                                <SelectItem value="Masters">Masters</SelectItem>
                                                <SelectItem value="PhD">PhD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Oman, UK, Germany" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching...</>
                            ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Find Scholarships</>
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
                        <p className="mt-4 text-muted-foreground">Our AI agents are searching for opportunities...</p>
                    </CardContent>
                </Card>
            )}

            {response && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Scholarship Opportunities Found</CardTitle>
                        <CardDescription>{response.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {response.scholarships.length === 0 && (
                             <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>No Results</AlertTitle>
                                <AlertDescription>We couldn't find any scholarships matching your specific criteria at this time. Please try a broader search.</AlertDescription>
                            </Alert>
                        )}
                        {response.scholarships.map((scholarship, index) => (
                            <Card key={index} className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">{scholarship.scholarshipName}</CardTitle>
                                    <CardDescription>{scholarship.institution} - {scholarship.country}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary"/><span><strong>Field:</strong> {scholarship.fieldOfStudy}</span></div>
                                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary"/><span><strong>Deadline:</strong> {scholarship.deadline}</span></div>
                                    <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-1 flex-shrink-0"/><span><strong>Eligibility:</strong> {scholarship.eligibilitySummary}</span></div>
                                </CardContent>
                                <CardFooter>
                                     {scholarship.sourceUrl && (
                                        <Button asChild variant="outline" size="sm">
                                            <a href={scholarship.sourceUrl} target="_blank" rel="noopener noreferrer"><LinkIcon className="mr-2 h-4 w-4"/> View Official Source</a>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}

        </div>
      </div>
    </div>
  );
}

    