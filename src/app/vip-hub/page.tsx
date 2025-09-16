import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Gem, ShieldCheck, Zap, Handshake, ArrowRight } from "lucide-react";
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The Majlis - VIP Hub",
  description: "An exclusive, invitation-only ecosystem for VIPs, executives, and their trusted networks to solve complex challenges with absolute confidentiality.",
};

const vipPillars = [
    {
        icon: ShieldCheck,
        title: "Discreet Problem-Solving",
        description: "Leverage a network of vetted experts and fixers to resolve complex business and personal challenges with absolute confidentiality."
    },
    {
        icon: Zap,
        title: "Priority Access",
        description: "Gain priority access to our suite of AI tools, new investment opportunities, and a dedicated human account manager."
    },
    {
        icon: Handshake,
        title: "Curated Networking",
        description: "Connect with a curated, invitation-only network of peers, industry leaders, and key decision-makers in a private digital environment."
    }
];

export default function VipHubPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Gem className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">The Majlis</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An Exclusive Hub for VIPs and Executives.
            <br />
            This is a private, AI-managed ecosystem designed to address the unique challenges of high-level professionals and their trusted networks.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Core Pillars of Service</h2>
                <p className="mt-4 text-lg text-muted-foreground">Confidentiality, Access, and Influence.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {vipPillars.map((pillar) => (
                    <Card key={pillar.title} className="text-center bg-card flex flex-col">
                        <CardHeader className="items-center">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <pillar.icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="pt-2">{pillar.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{pillar.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">An Invitation-Only Service</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                      Access to The Majlis is by referral only. If you are interested in learning more about this exclusive service, please contact our CEO's office.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <a href="mailto:ceo@innovative.om">Contact Us</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
