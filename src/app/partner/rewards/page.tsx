
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Shield, CheckCircle, Download, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { partnerKits, freelancerKits, type WelcomeKit } from '@/lib/rewards';
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Partner Rewards Program | Innovative Enterprises",
  description: "Explore the benefits and rewards of joining our partner network. View welcome kits, digital certificates, and level-wise badges for our valued partners.",
};

const KitCard = ({ kit, isCurrent }: { kit: WelcomeKit, isCurrent: boolean }) => (
    <Card className={`relative flex flex-col h-full transition-all duration-300 ${isCurrent ? 'border-primary ring-2 ring-primary shadow-2xl' : 'opacity-70 hover:opacity-100'}`}>
        {isCurrent && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Your Current Tier</Badge>}
        <CardHeader className="text-center items-center">
            <div className="bg-primary/10 p-3 rounded-full">
                <kit.icon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl pt-2">{kit.level} Partner</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-center font-semibold text-primary mb-4">Welcome Kit Includes:</p>
            <ul className="space-y-3 text-sm">
                {kit.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);


export default function PartnerRewardsPage() {
    // In a real app, this would come from the user's session/profile
    const currentPartnerTier = "Gold"; 

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                 <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                         <Button asChild variant="outline">
                            <Link href="/partner">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Partner Hub
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <Award className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">Partner Rewards Program</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We value our partners. Explore the exclusive benefits and rewards you receive as a member of the Innovative Enterprises network.
                        </p>
                    </div>

                    <div className="my-16">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Digital Assets</CardTitle>
                                <CardDescription>Download your personalized certificate and tier badge to showcase your partnership.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-6">
                                <div className="flex flex-col items-center justify-center gap-4 p-6 bg-muted rounded-lg">
                                    <Shield className="w-24 h-24 text-primary/70" />
                                    <Button><Download className="mr-2 h-4 w-4"/> Download Tier Badge</Button>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-4 p-6 bg-muted rounded-lg">
                                    <Award className="w-24 h-24 text-primary/70" />
                                    <Button><Download className="mr-2 h-4 w-4"/> Download Certificate</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="space-y-16">
                        <div>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary">Company & Subcontractor Welcome Kits</h2>
                                <p className="mt-4 text-lg text-muted-foreground">Tangible rewards to welcome you to our network, based on your partnership level.</p>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                {partnerKits.map(kit => (
                                    <KitCard key={kit.level} kit={kit} isCurrent={kit.level === currentPartnerTier} />
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary">Freelancer Welcome Kits</h2>
                                <p className="mt-4 text-lg text-muted-foreground">A special kit designed for our individual freelance partners.</p>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                {freelancerKits.map(kit => (
                                    <KitCard key={kit.level} kit={kit} isCurrent={kit.level === currentPartnerTier} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
