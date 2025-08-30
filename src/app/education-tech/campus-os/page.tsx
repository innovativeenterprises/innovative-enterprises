
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Cpu, Thermometer, Lightbulb, Droplets, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Lightbulb,
        title: "Smart Lighting & Energy",
        description: "AI-optimized lighting and HVAC systems that reduce energy consumption by up to 30% based on real-time occupancy data."
    },
    {
        icon: Thermometer,
        title: "Predictive Maintenance",
        description: "IoT sensors monitor critical equipment (HVAC, elevators) to predict failures before they happen, minimizing downtime and repair costs."
    },
    {
        icon: Droplets,
        title: "Water Management",
        description: "Intelligent irrigation and leak detection systems to conserve water and reduce utility expenses across the campus."
    },
    {
        icon: Bell,
        title: "Integrated Security & Alerts",
        description: "A unified platform connecting cameras, access control, and alert systems for a safer campus environment."
    }
];

export default function CampusOsPage() {
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Cpu className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">CampusOS: The Smart Campus Operating System</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A centralized platform leveraging IoT and AI to create a more efficient, sustainable, and responsive educational environment.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">Key Capabilities</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Automate, analyze, and optimize your campus operations.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature) => (
                            <Card key={feature.title} className="text-center bg-card">
                                 <CardHeader className="items-center">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <feature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="pt-2">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-20 text-center">
                    <Card className="bg-accent/10 border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl text-accent">Build a Campus for the Future</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                               CampusOS is currently in the planning and development phase. Partner with us to pilot the technology and redefine campus management.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-center">
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/partner">Request a Consultation <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
