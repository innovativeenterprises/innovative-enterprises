
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Globe, Check, Star } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Provider } from '@/lib/providers';
import { initialProviders } from '@/lib/providers';
import { DueDateDisplay } from '@/components/due-date-display';

const ProviderDetailClient = ({ provider }: { provider: Provider | undefined }) => {
    if (!provider) {
        return (
            <div className="space-y-8">
                <div><Skeleton className="h-10 w-40" /></div>
                <Skeleton className="h-64 w-full" />
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
        <div className="space-y-8">
             <div>
                <Button asChild variant="outline">
                    <Link href="/admin/network">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Network
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
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Subscription Expiry</h3>
                        {provider.subscriptionExpiry ? (
                            <DueDateDisplay date={provider.subscriptionExpiry.toISOString()} prefix="Expires:" />
                        ) : (
                             <Badge variant="secondary">No Subscription</Badge>
                        )}
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
    );
}


export default function ProviderDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const provider = initialProviders.find(p => p.id === id);

    if (!provider) {
        notFound();
    }

    return <ProviderDetailClient provider={provider} />;
}
