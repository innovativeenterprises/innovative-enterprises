
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, BrainCircuit, LineChart, Users, Shield, Target, Lightbulb } from 'lucide-react';
import { FeasibilityStudyInputSchema, type FeasibilityStudyInput, type FeasibilityStudyOutput } from '@/ai/flows/feasibility-study.schema';
import { generateFeasibilityStudy } from '@/ai/flows/feasibility-study';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export default function FeasibilityStudyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FeasibilityStudyOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FeasibilityStudyInput>({
    resolver: zodResolver(FeasibilityStudyInputSchema),
    defaultValues: {
      businessIdea: '',
    },
  });

  const onSubmit: SubmitHandler<FeasibilityStudyInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    toast({ title: "Generating Study...", description: "Sage and Rami are conducting research. This may take a few moments." });
    try {
      const result = await generateFeasibilityStudy(data);
      setResponse(result);
      toast({
        title: 'Feasibility Study Complete!',
        description: 'Your analysis is ready for review.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the study. The research agents might be busy. Please try again.',
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
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI-Powered Feasibility Study Builder</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter your business idea, and let Sage, our AI Business Strategist, conduct market research and generate a comprehensive feasibility study for you.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Describe Your Business Idea</CardTitle>
                    <CardDescription>Be as specific as possible. The more detail you provide, the better the analysis will be.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="businessIdea"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Idea or Concept</FormLabel>
                                <FormControl>
                                <Textarea placeholder="e.g., A subscription box service for rare and exotic coffees, sourced directly from farmers." rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                            ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Feasibility Study</>
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
                        <p className="mt-4 text-muted-foreground">Sage is directing our research agents... This can take up to a minute.</p>
                    </CardContent>
                </Card>
            )}

            {response && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{response.title}</CardTitle>
                        <CardDescription>
                           <p className="mt-2">{response.executiveSummary}</p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                         <section>
                            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2"><LineChart className="h-5 w-5 text-primary" /> Market Analysis</h3>
                            <div className="space-y-4">
                               <p className="text-muted-foreground text-sm italic">{response.marketAnalysis.summary}</p>
                               <ul className="list-disc pl-5 space-y-2 text-sm">
                                    {response.marketAnalysis.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
                                </ul>
                            </div>
                        </section>
                         <section>
                            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Competitive Landscape</h3>
                            <div className="space-y-4">
                                <p className="text-muted-foreground text-sm italic">{response.competitiveLandscape.summary}</p>
                                <div className="space-y-3">
                                    {response.competitiveLandscape.competitors.map((c, index) => (
                                        <div key={index} className="p-3 bg-muted/50 rounded-md border">
                                            <p className="font-semibold text-sm">{c.name}</p>
                                            <p className="text-xs mt-1"><strong className="text-green-600">Strengths:</strong> {c.strengths}</p>
                                            <p className="text-xs mt-1"><strong className="text-red-600">Weaknesses:</strong> {c.weaknesses}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                         <section>
                            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Target Audience</h3>
                            <div className="space-y-4">
                                <p className="text-muted-foreground text-sm italic">{response.targetAudience.summary}</p>
                               <ul className="list-disc pl-5 space-y-2 text-sm">
                                    {response.targetAudience.keyCharacteristics.map((point, index) => <li key={index}>{point}</li>)}
                                </ul>
                            </div>
                        </section>
                         <section>
                            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Recommendation</h3>
                             <Alert className="bg-primary/5 border-primary/20">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                <AlertTitle>Conclusion</AlertTitle>
                                <AlertDescription>
                                   <p className="mb-4">{response.recommendation.conclusion}</p>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Confidence Score: {response.recommendation.confidenceScore}%</p>
                                        <Progress value={response.recommendation.confidenceScore} className="h-3" />
                                    </div>
                                </AlertDescription>
                            </Alert>
                        </section>
                    </CardContent>
                </Card>
            )}

        </div>
      </div>
    </div>
  );
}
