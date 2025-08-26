
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, Server, Laptop, Network, Database, Cloud } from "lucide-react";
import Link from "next/link";

const problems = [
    { title: "High Upfront Costs", description: "Heavy capital expenditure (CAPEX) on IT hardware is a major barrier for startups and SMEs." },
    { title: "Lack of Flexibility", description: "Purchasing equipment locks businesses into technology that may quickly become outdated or unsuitable for new projects." },
    { title: "Complex Management", description: "Procuring, setting up, and maintaining IT infrastructure is time-consuming and requires specialized expertise." },
];

const services = [
    {
        icon: Server,
        title: "Hardware Rentals",
        description: "Access a wide range of hardware, including laptops, workstations, servers, storage units, and networking gear.",
    },
    {
        icon: Cloud,
        title: "Cloud & Virtual Infrastructure",
        description: "Rent virtual machines, development/test environments, and backup or disaster recovery solutions on demand.",
    },
    {
        icon: Laptop,
        title: "Specialized Equipment",
        description: "Get access to high-performance hardware for specific needs like AI/ML, big data processing, and security.",
    },
    {
        icon: CheckCircle,
        title: "Value-Added Services",
        description: "We offer installation, delivery, remote support, monitoring, and insurance for all rented assets.",
    },
];

export default function InfraRentPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Server className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">InfraRent: On-Demand IT Infrastructure</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your digital platform for renting IT equipment and cloud solutions. Reduce costs, increase flexibility, and scale your business without the burden of ownership.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">The Challenge with Traditional IT</h2>
                <p className="mt-4 text-lg text-muted-foreground">Owning IT infrastructure comes with significant hurdles.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Services</h2>
                <p className="mt-4 text-lg text-muted-foreground">A comprehensive rental marketplace for all your IT needs.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {services.map((solution) => (
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
                    <CardTitle className="text-2xl text-accent">Become a Partner or Start Renting</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                       Whether you have IT assets to lease or need equipment for your next project, InfraRent is the platform for you.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center gap-4">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">Become a Vendor</Link>
                    </Button>
                     <Button asChild size="lg" variant="outline" >
                        <Link href="/rentals">Browse Rentals</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
