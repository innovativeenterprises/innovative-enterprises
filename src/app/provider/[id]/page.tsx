
'use client';

import { useParams, notFound } from 'next/navigation';
import { useProvidersData } from '@/hooks/use-global-store-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Globe, Check, Star } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Provider } from '@/lib/providers';
import type { Metadata } from 'next';
import { initialProviders } from '@/lib/providers';

export async function generateStaticParams() {
  return initialProviders.map((provider) => ({
    id: provider.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const provider = initialProviders.find(p => p.id === params.id);

  if (!provider) {
    return {
      title: 'Provider Not Found',
    };
  }

  return {
    title: `${provider.name} | Partner Profile`,
    description: `Service provider profile for ${provider.name}, specializing in ${provider.services}.`,
  };
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
    
    const SubscriptionStatus = ({ tier, expiry }: { tier: string, expiry?: Date }) => {
        const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | null>(null);
        
        useEffect(() => {
            if (!expiry) {
                setDaysUntilExpiry(null);
                return;
            }
            const now = new Date();
            const diffTime = new Date(expiry).getTime() - now.getTime();
            setDaysUntilExpiry(Math.ceil(diffTime / (1000 * 3600 * 24)));
        }, [expiry]);


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
        
        if (daysUntilExpiry === null) {
             return <Badge variant="outline">{tier}</Badge>;
        }
        
        const totalDuration = tier === 'Yearly' ? 365 : 30;
        const progressValue = Math.max(0, (daysUntilExpiry / totalDuration) * 100);

        return (
            <div className="w-full min-w-[200px] space-y-2">
                <div className="flex justify-between items-center">
                    <Badge variant="outline">{tier}</Badge>
                    <p className="text-xs text-muted-foreground">
                        {daysUntilExpiry > 0 ? `Expires in ${Math.ceil(daysUntilExpiry)} days` : 'Expired'}
                    </p>
                </div>
                <Progress value={progressValue} className="h-2 [&>div]:bg-green-500" />
            </div>
        )
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
                                        <a href={`mailto:${provider.email}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
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
