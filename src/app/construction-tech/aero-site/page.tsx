
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Eye, HardHat, Map, Layers } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AeroSite AI (DaaS) | Innovative Enterprises",
  description: "Drone-as-a-Service for automated aerial surveys, 3D mapping, and real-time construction progress tracking. Turn site data into actionable insights.",
};

const features = [
  {
    icon: Eye,
    title: "Automated Progress Tracking",
    description: "Schedule regular, autonomous drone flights to capture high-resolution imagery and video of your construction site, creating a visual timeline of your project's progress."
  },
  {
    icon: Map,
    title: "3D Terrain & Site Mapping",
    description: "Generate accurate 3D models and topographical maps of your site for better planning, volume calculations, and safety assessments."
  },
  {
    icon: CheckCircle,
    title: "AI-Powered Analysis",
    description: "Our AI agents analyze the captured data to detect safety hazards, track material quantities, and compare as-built progress against your BIM models."
  }
];

export default function AeroSitePage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/construction-tech">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Construction Tech
                    </Link>
                </Button>
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <HardHat className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">AeroSite AI (Drone-as-a-Service)</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Leverage the power of autonomous drones and AI to get a bird's-eye view of your construction projects. Turn raw site data into actionable intelligence.
                    </p>
                </div>
            </div>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1519672102930-99a6a1f1035b?q=80&w=2070&auto=format&fit=crop" alt="Drone flying over a construction site" fill className="object-cover" data-ai-hint="drone construction" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="space-y-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">Our Capabilities</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index}>
                            <CardHeader className="items-center text-center">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="pt-2">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Card className="bg-accent/10 border-accent mt-16">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-accent">Service Currently in Private Beta</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                        This advanced service requires specialized hardware and is currently available to select partners. Contact us for a consultation on how AeroSite AI can benefit your projects.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">Request Consultation</Link>
                    </Button>
                </CardFooter>
            </Card>

        </div>
      </div>
    </div>
  );
}
