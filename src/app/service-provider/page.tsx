import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, MessageSquareQuote, Bot, Scale, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { initialStaffData } from "@/lib/agents";

export default function ServiceProviderPage() {
    const { agentCategories } = initialStaffData;
    // Dynamically select a few key agents to feature
    const allAgents = agentCategories.flatMap(cat => cat.agents);
    const featuredAgentNames = ["Aida", "Lexi", "Rami", "Sage"];
    const featuredAgents = featuredAgentNames.map(name => allAgents.find(agent => agent.name === name)).filter(Boolean);

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">Accelerate with AI</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Leverage our powerful AI tools and agents to streamline your workflows, get instant answers, and automate your business processes.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {featuredAgents.map((agent) => (
                         <Card key={agent!.name} className="text-center group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit transition-colors group-hover:bg-accent">
                                    <agent!.icon className="w-8 h-8 text-primary transition-colors group-hover:text-accent-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardTitle>{agent!.name}</CardTitle>
                                <CardDescription className="mt-2">
                                    {agent!.role}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                    <Link href={agent!.href || '#'}>Use {agent!.name}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
