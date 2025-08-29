
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ShieldCheck, Search, SlidersHorizontal, Bot, Briefcase } from "lucide-react";
import Link from "next/link";
import HomeWorkforceIcon from "@/components/icons/home-workforce-icon";

const problems = [
    { title: "Match Inefficiency", description: "Traditional methods of finding domestic helpers are slow and rely on limited agency databases." },
    { title: "Lack of Transparency", description: "Clients can't access detailed profiles, and agencies struggle to manage candidate availability." },
    { title: "Complex Management", description: "Managing orders, scheduling, and paperwork is cumbersome for both agencies and clients." },
];

const solutions = [
    {
        icon: Search,
        title: "AI-Powered Smart Matching",
        description: "Our AI analyzes client needs and candidate profiles to provide highly relevant matches, increasing placement success.",
    },
    {
        icon: ShieldCheck,
        title: "Enhanced Transparency & Trust",
        description: "Access comprehensive candidate profiles with background checks, certified skills, and verified ratings.",
    },
    {
        icon: SlidersHorizontal,
        title: "Simplified Management Tools",
        description: "A full suite of tools for order management, interview scheduling, contract handling, and payment processing.",
    },
    {
        icon: Bot,
        title: "White-Label & API Integration",
        description: "Seamlessly integrate our platform into your existing website with your own branding, enhancing your service delivery.",
    },
];

export default function RaahaPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <HomeWorkforceIcon className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">RAAHA (راحة): The Future of Domestic Workforce Management</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An AI-powered, white-label platform designed to empower home workforce agencies, streamline recruitment, and build trust with clients.
          </p>
           <div className="mt-8 flex justify-center gap-4">
               <Button asChild size="lg">
                    <Link href="/raaha/find-a-helper">Find a Helper (Client View)</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/raaha/agency-dashboard">Agency Dashboard</Link>
                </Button>
           </div>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">The Challenge</h2>
                <p className="mt-4 text-lg text-muted-foreground">The domestic staffing industry faces significant challenges.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {problems.map((problem) => (
                    <Card key={problem.title} className="text-center bg-muted/50 border-l-4 border-destructive/50">
                        <CardHeader>
                            <CardTitle>{problem.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{problem.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Solution</h2>
                <p className="mt-4 text-lg text-muted-foreground">RAAHA provides a comprehensive, AI-driven solution.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {solutions.map((solution) => (
                    <Card key={solution.title} className="bg-card border-l-4 border-primary/50">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <solution.icon className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>{solution.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{solution.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">Empower Your Agency Today</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                        Interested in offering a state-of-the-art digital experience to your clients? Let's discuss how RAAHA can be tailored for your business.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">Request a Demo</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
