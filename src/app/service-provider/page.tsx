import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, MessageSquareQuote, Bot, Scale, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function AiToolsCta() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">Accelerate with AI</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Leverage our powerful AI tools and agents to streamline your workflows, get instant answers, and automate your business processes.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <Card className="text-center group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit transition-colors group-hover:bg-accent">
                                <Bot className="w-8 h-8 text-primary transition-colors group-hover:text-accent-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle>Automation Agents</CardTitle>
                            <CardDescription className="mt-2">
                                Automate tasks like social media marketing with our intelligent AI agents.
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/automation">Explore Agents</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="text-center group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                        <CardHeader>
                             <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit transition-colors group-hover:bg-accent">
                                <MessageSquareQuote className="w-8 h-8 text-primary transition-colors group-hover:text-accent-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle>AI-Powered FAQ</CardTitle>
                            <CardDescription className="mt-2">
                                Get instant, accurate answers to your questions about our services.
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/faq">Ask our AI</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="text-center group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                        <CardHeader>
                             <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit transition-colors group-hover:bg-accent">
                                <BrainCircuit className="w-8 h-8 text-primary transition-colors group-hover:text-accent-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle>Feasibility Studies</CardTitle>
                            <CardDescription className="mt-2">
                               Let our AI research and generate a comprehensive feasibility study for your next big idea.
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/feasibility-study">Build a Study</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    )
}
