
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Box, Store, Building2, VrHeadset } from "lucide-react";
import Link from "next/link";
import VmallIcon from "@/components/icons/vmall-icon";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "VMALL - Immersive VR/AR Shopping | Innovative Enterprises",
  description: "Experience the future of retail with VMALL. A revolutionary platform leveraging VR and AR to create immersive shopping experiences for retail, real estate, and more.",
};


const features = [
    {
        icon: Store,
        title: "Virtual Retail Stores",
        description: "Create a fully interactive, 3D virtual version of your physical store that customers can walk through and shop in from anywhere.",
    },
    {
        icon: Building2,
        title: "Immersive Property Tours",
        description: "Go beyond photos. Allow potential buyers or renters to experience a property in stunning virtual reality, complete with virtual staging.",
    },
    {
        icon: Box,
        title: "AR Product Visualization",
        description: "Let customers use their phone's camera to see how your products, from furniture to electronics, would look in their own space before they buy.",
    }
];

export default function VmallPage() {
    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <VmallIcon className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">VMALL: The Immersive Commerce Platform</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                       A revolutionary Web & Mobile application that leverages Virtual Reality (VR) and Augmented Reality (AR) technology to create immersive shopping and touring experiences.
                    </p>
                </div>

                 <div className="max-w-5xl mx-auto mt-20">
                     <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <Card key={feature.title} className="text-center bg-card flex flex-col">
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
                            <CardTitle className="text-2xl text-accent">Step into the Future of Commerce</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                               VMALL is currently in development. Contact us to learn how your business can leverage immersive technology to captivate customers and drive sales.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-center">
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/partner">Become a Pilot Partner</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

            </div>
        </div>
    )
}
