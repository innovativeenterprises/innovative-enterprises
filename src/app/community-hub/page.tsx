

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Users, Heart, PieChart, Landmark, UserCog, HandCoins } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community Hub",
  description: "A comprehensive digital solution for expatriate communities and charitable organizations to manage their affairs, foster engagement, and build a stronger, self-sufficient network.",
};

const platformPillars = [
    {
        icon: UserCog,
        title: "Membership Management",
        description: "Maintain a secure and up-to-date registry of all community members and their families.",
        href: "/community-hub/membership"
    },
    {
        icon: Landmark,
        title: "Committee Governance",
        description: "Run fair and transparent elections for committee members with our AI-powered election tools.",
        href: "/community-hub/elections"
    },
    {
        icon: HandCoins,
        title: "Events & Financials",
        description: "Organize community events, manage charitable funds, and coordinate volunteer efforts seamlessly.",
        href: "/community-hub/events-finance"
    },
    {
        icon: Users,
        title: "Public Member Directory",
        description: "A public directory for community members to connect and network with each other.",
        href: "/community-hub/directory"
    }
];

export default function CommunityHubPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Users className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Community Hub Platform</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive digital solution for expatriate communities and charitable organizations to manage their affairs, foster engagement, and build a stronger, self-sufficient network.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Empowering Self-Governance</h2>
                <p className="mt-4 text-lg text-muted-foreground">Tools designed to help your community thrive independently.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {platformPillars.map((pillar) => (
                    <Card key={pillar.title} className="text-center bg-card flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <Link href={pillar.href || '#'} className="flex flex-col flex-grow">
                            <CardHeader className="items-center">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <pillar.icon className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="pt-2">{pillar.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{pillar.description}</p>
                            </CardContent>
                             {pillar.href && (
                                <CardFooter className="justify-center">
                                    <Button variant="ghost" className="text-primary">Launch Tool <ArrowRight className="ml-2 h-4 w-4"/></Button>
                                </CardFooter>
                            )}
                        </Link>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">Onboard Your Community</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                      Interested in using the Community Hub for your organization? Contact us to get started.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">Request a Consultation</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
