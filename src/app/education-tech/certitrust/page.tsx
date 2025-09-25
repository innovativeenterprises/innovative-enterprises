
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ShieldCheck, Camera, Bot, Layers, CheckSquare, ArrowRight } from "lucide-react";
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CertiTrust - Secure Digital Credentials | Innovative Enterprises",
  description: "A revolutionary platform combining AI proctoring with blockchain technology to deliver secure, verifiable digital credentials.",
};

const features = [
    {
        icon: Bot,
        title: "AI-Powered Proctoring",
        description: "Our advanced AI monitors exams for any irregularities, ensuring a fair and secure testing environment."
    },
    {
        icon: Layers,
        title: "Immutable Blockchain Credentials",
        description: "Every certificate is registered as a unique asset on the blockchain, making it tamper-proof and permanent."
    },
    {
        icon: CheckSquare,
        title: "Instant Verification",
        description: "Employers and institutions can instantly verify the authenticity of a certificate with a single click, eliminating fraud."
    }
];

export default function CertiTrustPage() {
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">CertiTrust: The Future of Academic Integrity</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A revolutionary platform combining AI proctoring with blockchain technology to deliver secure, verifiable digital credentials.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">Key Features</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Building a foundation of trust in education.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <Card key={feature.title} className="text-center bg-card flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                 <CardHeader className="items-center">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <feature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="pt-2">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                                {feature.title === "AI-Powered Proctoring" && (
                                     <CardFooter className="mt-auto">
                                         <Button asChild className="w-full">
                                            <Link href="/education-tech/certitrust/proctoring-session">Launch Proctoring Tool <ArrowRight className="ml-2 h-4 w-4"/></Link>
                                        </Button>
                                     </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-20 text-center">
                    <Card className="bg-accent/10 border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl text-accent">Secure Your Institution's Reputation</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                               CertiTrust is a demonstration platform. Contact us to learn how you can become a pilot partner and lead the charge in academic integrity.
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
