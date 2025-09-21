
'use client';

import { useParams, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Globe, Check, Star } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Provider } from '@/lib/providers.schema';
import { useProvidersData } from '@/hooks/use-data-hooks';


const SubscriptionStatus = ({ tier, expiry }: { tier: string, expiry?: Date | string }) => {
    const [clientState, setClientState] = useState<{
        daysUntilExpiry: number | null;
        progressValue: number;
    } | null>(null);

    useEffect(() => {
        if (!expiry) {
            setClientState({ daysUntilExpiry: null, progressValue: 0 });
            return;
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const expiryDate = new Date(expiry);
        expiryDate.setHours(0, 0, 0, 0);

        const timeDiff = expiryDate.getTime() - now.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let totalDuration = 365; // Default for Yearly
        if (tier === 'Monthly') totalDuration = 30;

        const progress = Math.max(0, (days / totalDuration) * 100);

        setClientState({ daysUntilExpiry: days, progressValue: progress });

    }, [expiry, tier]);


    if (tier === 'None') {
        return <Badge variant="secondary">No Subscription</Badge>;
    }
    if (tier === 'Lifetime') {
        return (
             <div className="flex items-center gap-2 text-purple-700 font-semibold">
                <Star className="h-5 w-5 fill-purple-500 text-purple-500" /> Lifetime
             </div>
        )
    }
    
    if (!expiry || clientState === null) {
         return <Skeleton className="h-10 w-full" />;
    }
    
    return (
        <div className="w-full min-w-[200px] space-y-2">
            <div className="flex justify-between items-center">
                <Badge variant="outline">{tier}</Badge>
                <p className="text-sm text-muted-foreground">Expires: {new Date(expiry).toLocaleDateString()}</p>
            </div>
            <Progress value={clientState.progressValue} className="h-2 [&>div]:bg-green-500" />
        </div>
    )
}

export default function ProviderProfilePage() {
    const params = useParams();
    const { id } = params;
    const { providers, isClient } = useProvidersData();
    const [provider, setProvider] = useState<Provider | undefined>(undefined);

    useEffect(() => {
        if (isClient && id) {
            const foundProvider = providers.find(p => p.id === id);
            if (foundProvider) {
                setProvider(foundProvider);
            } else {
                notFound();
            }
        }
    }, [id, providers, isClient]);

     if (!isClient || !provider) {
        return (
             <div className="bg-background min-h-[calc(100vh-8rem)]">
                <div className="container mx-auto py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        )
    }
    
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Vetted": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Vetted</Badge>;
            case "Pending Review": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending Review</Badge>;
            case "On Hold": return <Badge variant="destructive" className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30">On Hold</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }
    
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto py-16 px-4">
                <div className="max-w-4xl mx-auto">
                     <div className="space-y-8">
                        <div>
                            <Button asChild variant="outline">
                                <Link href="/business-hub">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Business Hub
                                </Link>
                            </Button>
                        </div>
                        <Card>
                            <CardHeader className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                    <CardTitle className="text-3xl">{provider.name}</CardTitle>
                                    {getStatusBadge(provider.status)}
                                    </div>
                                    <CardDescription className="text-base">{provider.services}</CardDescription>
                                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                                        <a href={`mailto:${"'" + provider.email + "'"}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                            <Mail className="h-4 w-4" /> {provider.email}
                                        </a>
                                        {provider.portfolio && 
                                            <a href={provider.portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                                <Globe className="h-4 w-4" /> Portfolio
                                            </a>
                                        }
                                    </div>
                                </div>
                                <div className="w-full md:w-auto">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Subscription Status</h3>
                                    <SubscriptionStatus tier={provider.subscriptionTier} expiry={provider.subscriptionExpiry} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-lg font-semibold mb-2">Internal Notes</h3>
                                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-md border italic">
                                    {provider.notes || "No notes for this provider yet."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
