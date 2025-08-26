
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
import { generateImage } from '@/ai/flows/image-generator';
import type { Product } from '@/lib/products';
import { useProductsData } from '../product-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

const PlanDisplay = ({ plan, onCreateProject, isCreating }: { plan: ProjectInceptionOutput, onCreateProject: (plan: ProjectInceptionOutput) => void, isCreating: boolean }) => (
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
                <Accordion type="single" collapsible className="w-full">
                    {plan.coreFeatures.map((feature, i) => (
                        <AccordionItem value={`item-${i}`} key={i}>
                            <AccordionTrigger className="font-medium text-sm text-foreground">{feature.title}</AccordionTrigger>
                            <AccordionContent className="space-y-2 pl-2">
                                <p className="text-muted-foreground">{feature.description}</p>
                                <p className="text-xs font-semibold text-foreground">Acceptance Criteria: <span className="font-normal text-muted-foreground">{feature.acceptanceCriteria}</span></p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Section>
            <div className="grid md:grid-cols-2 gap-6">
                 <Section icon={<Shield />} title="Potential Risks">
                    <div className="space-y-2">
                        {plan.risks.map((risk, i) => {
                            const likelihoodColor = risk.likelihood === 'High' ? 'bg-destructive/80' : risk.likelihood === 'Medium' ? 'bg-yellow-500 text-black' : 'bg-green-500';
                            return (
                                <div key={i} className="p-3 border rounded-md">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-foreground text-sm">{risk.risk}</p>
                                        <Badge variant="default" className={likelihoodColor}>{risk.likelihood}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1"><strong>Mitigation:</strong> {risk.mitigation}</p>
                                </div>
                            )
                        })}
                    </div>
                </Section>
                <Section icon={<Users />} title="Recommended Agents">
                    <div className="flex flex-wrap gap-2">
                         {plan.recommendedAgents.map((agent, i) => <Badge key={i} variant="secondary">{agent}</Badge>)}
                    </div>
                </Section>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={() => onCreateProject(plan)} disabled={isCreating}>
                {isCreating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Project...</>
                ) : "Create Project & Add to Products"}
            </Button>
        </CardFooter>
    </Card>
);


export default function ProjectsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [analysis, setAnalysis] = useState<ProjectInceptionOutput | null>(null);
    const { setProducts } = useProductsData();
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
    
    const handleCreateProject = async (plan: ProjectInceptionOutput) => {
        setIsCreating(true);
        try {
            toast({ title: "Generating project image...", description: "Lina is creating a visual for your new project." });
            const imageUrl = await generateImage({ prompt: plan.imagePrompt });

            const newProduct: Product = {
                id: `prod_${Date.now()}`,
                name: plan.projectName,
                description: plan.summary,
                image: imageUrl,
                aiHint: plan.imagePrompt,
                enabled: true,
                stage: 'Idea Phase', // Default starting stage
            };

            setProducts(prev => [newProduct, ...prev]);
            
            toast({ title: "Project Created!", description: `${plan.projectName} has been added to your product list.` });
            setAnalysis(null); // Clear the plan display after creation
        } catch (error) {
            console.error(error);
            toast({ title: "Project Creation Failed", description: "Could not create the project. Please try again.", variant: 'destructive' });
        } finally {
            setIsCreating(false);
        }
    }

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
                    <PlanDisplay plan={analysis} onCreateProject={handleCreateProject} isCreating={isCreating}/>
                </div>
            )}
        </div>
    );
}
