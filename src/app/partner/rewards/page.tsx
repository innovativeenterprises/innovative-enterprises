
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Award, Shield, CheckCircle, Download, ArrowLeft, Trophy, Crown, Gem } from "lucide-react";
import Link from "next/link";
import { partnerKits, freelancerKits, type WelcomeKit } from '@/lib/rewards';
import { Badge } from "@/components/ui/badge";

const KitCard = ({ kit, currentTier }: { kit: WelcomeKit, currentTier: string }) => {
    const isCurrent = kit.level === currentTier;
    const isUnlocked = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"].indexOf(kit.level) <= ["Bronze", "Silver", "Gold", "Platinum", "Diamond"].indexOf(currentTier);

    return (
        <Card className={`flex flex-col ${isCurrent ? 'border-primary ring-2 ring-primary' : ''} ${!isUnlocked ? 'opacity-50' : ''}`}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <kit.icon className={`w-8 h-8 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                    {isCurrent && <Badge>Your Current Tier</Badge>}
                </div>
                <CardTitle className="pt-2 text-2xl">{kit.level} Tier</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="space-y-3">
                    {kit.items.map(item => (
                         <li key={item} className="flex items-center gap-2">
                             <CheckCircle className="h-5 w-5 text-green-500" />
                             <span className="text-muted-foreground">{item}</span>
                         </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled={!isUnlocked}>
                    <Download className="mr-2 h-4 w-4" /> Download Digital Assets
                </Button>
            </CardFooter>
        </Card>
    )
};


export default function PartnerRewardsPage() {
    // In a real app, this would come from the user's session/profile
    const currentPartnerTier = "Gold"; 

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto">
                <div>
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/partner">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Partner Hub
                        </Link>
                    </Button>
                    <div className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <Award className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">Partner Rewards Program</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We value our partners. Explore the benefits and rewards available as you collaborate with us.
                        </p>
                    </div>
                </div>

                 <div className="mt-16 space-y-12">
                    <div>
                        <h2 className="text-3xl font-bold text-center text-primary mb-8">For Companies & Agencies</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {partnerKits.map(kit => <KitCard key={kit.level} kit={kit} currentTier={currentPartnerTier} />)}
                        </div>
                    </div>
                     <div>
                        <h2 className="text-3xl font-bold text-center text-primary mb-8">For Individual Freelancers</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {freelancerKits.map(kit => <KitCard key={kit.level} kit={kit} currentTier={currentPartnerTier} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

