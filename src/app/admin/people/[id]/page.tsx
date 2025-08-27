
'use client';

import { useParams } from 'next/navigation';
import { useProvidersData } from '@/app/admin/provider-table';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Globe, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ProviderDetailPage() {
    const params = useParams();
    const { id } = params;
    const { providers } = useProvidersData();

    const provider = providers.find(p => p.id === id);

    if (!provider) {
        return notFound();
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
                    <Link href="/admin/people">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to People & Network
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl">{provider.name}</CardTitle>
                        <CardDescription className="text-base">{provider.services}</CardDescription>
                        <div className="mt-4 flex flex-wrap gap-2">
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
                    <div>
                        {getStatusBadge(provider.status)}
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
