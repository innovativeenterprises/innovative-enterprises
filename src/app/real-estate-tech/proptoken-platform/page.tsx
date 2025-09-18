
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ShieldCheck, PieChart, Repeat, Layers, Handshake, Users, ArrowRight } from "lucide-react";
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PropToken Platform | Innovative Enterprises",
  description: "Democratizing real estate investment. Own fractions of high-value properties through secure, transparent blockchain technology.",
};


const benefits = [
    {
        icon: PieChart,
        title: "Lower Entry Barrier",
        description: "Invest in high-value properties with smaller capital amounts, making real estate accessible to more people."
    },
    {
        icon: Repeat,
        title: "Increased Liquidity",
        description: "Buy, sell, or trade your property shares easily on a secure digital marketplace, unlike traditional illiquid property assets."
    },
    {
        icon: ShieldCheck,
        title: "Enhanced Security & Transparency",
        description: "Ownership records and transactions are immutably stored on the blockchain, preventing fraud and ensuring clarity."
    }
];

const howItWorks = [
    {
        step: 1,
        title: "Property Tokenization",
        description: "A property is legally vetted and its ownership is converted into a number of digital tokens on the blockchain."
    },
    {
        step: 2,
        title: "Investor Purchase",
        description: "Investors buy tokens through our platform, each token representing a direct fractional share of the property."
    },
    {
        step: 3,
        title: "Smart Contract Management",
        description: "A smart contract automatically distributes rental income to token holders and governs all voting and selling rights."
    },
    {
        step: 4,
        title: "Secondary Trading",
        description: "Token holders can trade their shares with other investors on our secure, integrated marketplace."
    }
]

export default function PropTokenPlatformPage() {
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Layers className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">PropToken Platform</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Democratizing Real Estate Investment. Own fractions of high-value properties through secure, transparent blockchain technology.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">Why Fractional Ownership?</h2>
                        <p className="mt-4 text-lg text-muted-foreground">A modern approach to building your property portfolio.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit) => (
                            <Card key={benefit.title} className="text-center bg-card">
                                 <CardHeader className="items-center">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <benefit.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="pt-2">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                
                 <div className="max-w-4xl mx-auto mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">How It Works</h2>
                        <p className="mt-4 text-lg text-muted-foreground">A secure and transparent process powered by smart contracts.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute left-1/2 top-10 bottom-10 w-0.5 bg-border -translate-x-1/2 hidden md:block"></div>
                        {howItWorks.map((item, index) => (
                            <div key={item.step} className="flex md:items-center gap-6 md:gap-12 mb-12 flex-col md:flex-row">
                                 <div className={`flex md:justify-center w-full ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                    <Card className="w-full md:w-4/5">
                                        <CardHeader>
                                            <CardTitle>{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="relative flex-shrink-0 md:order-1">
                                     <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold z-10 relative">
                                        {item.step}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-20 text-center">
                    <Card className="bg-accent/10 border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl text-accent">A New Era of Real Estate Investment is Coming</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                               This platform is currently in the research phase. Join our waitlist to get early access and be notified when we launch.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-center">
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/partner">Join the Waitlist</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
