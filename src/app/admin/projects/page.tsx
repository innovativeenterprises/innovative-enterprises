
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, Bot, Users, Target, Shield, ListChecks, Milestone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generateProjectPlan } from '@/ai/flows/project-inception';
import type { ProjectInceptionInput, ProjectInceptionOutput } from '@/ai/flows/project-inception.schema';

const FormSchema = z.object({
  idea: z.string().min(10, 'Please describe your idea in at least 10 characters.'),
});
type FormValues = z.infer<typeof FormSchema>;

const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
            {icon}
            {title}
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">{children}</div>
    </div>
);

const PlanDisplay = ({ plan }: { plan: ProjectInceptionOutput }) => (
    <Card>
        <CardHeader>
            <CardTitle>{plan.projectName}</CardTitle>
            <CardDescription>{plan.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Section icon={<Target />} title="Target Audience">
                    <p>{plan.targetAudience}</p>
                </Section>
                <Section icon={<Milestone />} title="Value Proposition">
                    <p>{plan.valueProposition}</p>
                </Section>
            </div>
             <Section icon={<ListChecks />} title="Core Features (MVP)">
                <ul className="list-disc pl-5 space-y-1">
                    {plan.coreFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
                </ul>
            </Section>
            <div className="grid md:grid-cols-2 gap-6">
                 <Section icon={<Shield />} title="Potential Risks">
                    <ul className="list-disc pl-5 space-y-1">
                        {plan.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                    </ul>
                </Section>
                <Section icon={<Users />} title="Recommended Agents">
                    <div className="flex flex-wrap gap-2">
                         {plan.recommendedAgents.map((agent, i) => <Badge key={i} variant="secondary">{agent}</Badge>)}
                    </div>
                </Section>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full">Create Project & Assign Tasks</Button>
        </CardFooter>
    </Card>
);


export default function ProjectsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<ProjectInceptionOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: { idea: '' },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await generateProjectPlan(data);
            setAnalysis(result);
            toast({ title: "Project Plan Generated!", description: "Navi has created the initial project analysis." });
        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Could not generate project plan. Please try again.", variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Project Inception</h1>
                <p className="text-muted-foreground">
                    Transform a simple idea into a structured project plan with the help of Navi, our AI Innovation Agent.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Submit a New Idea</CardTitle>
                    <CardDescription>Describe your new project or product idea below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="idea"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Idea</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., A mobile app that uses AI to create personalized travel itineraries based on a user's budget and interests."
                                                rows={5}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Idea...</>
                                ) : (
                                    <><Wand2 className="mr-2 h-4 w-4" />Generate Project Plan</>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isLoading && (
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-4 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p>Navi is analyzing your idea and researching the market... This may take a moment.</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {analysis && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-center">Generated Project Plan</h2>
                    <PlanDisplay plan={analysis} />
                </div>
            )}
        </div>
    );
}
