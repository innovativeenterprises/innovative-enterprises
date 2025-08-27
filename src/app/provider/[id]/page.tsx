
'use client';

import { useParams, notFound } from 'next/navigation';
import { useProvidersData } from '@/app/admin/provider-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Globe, Check, Star } from 'lucide-react';
import Link from 'next/link';

export default function ProviderProfilePage() {
    const params = useParams();
    const { id } = params;
    const { providers } = useProvidersData();

    const provider = providers.find(p => p.id === id);

    if (!provider) {
        return notFound();
    }
    
    const getStatusBadge = () => {
        if (provider.status === 'Vetted') {
            return (
                <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30 flex items-center gap-1 text-sm">
                    <Check className="h-4 w-4" /> Vetted Partner
                </Badge>
            );
        }
        return <Badge variant="secondary">{provider.status}</Badge>;
    }

    return (
        <div className="bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Button asChild variant="outline">
                            <Link href="/business-hub">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Business Hub
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader className="text-center items-center pt-10">
                            {getStatusBadge()}
                            <CardTitle className="text-4xl font-bold pt-2">{provider.name}</CardTitle>
                            <CardDescription className="text-lg text-primary font-medium">{provider.services}</CardDescription>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 justify-center">
                                <a href={`mailto:${provider.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                    <Mail className="h-4 w-4" /> {provider.email}
                                </a>
                                {provider.portfolio && (
                                    <a href={provider.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                        <Globe className="h-4 w-4" /> View Portfolio
                                    </a>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                             <div className="prose prose-lg max-w-full text-center mx-auto">
                                <p className="lead text-muted-foreground">
                                   {provider.notes || `A trusted partner specializing in ${provider.services}. Reach out to discuss your project needs.`}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-center pb-10">
                            <Button size="lg" asChild>
                               <a href={`mailto:${provider.email}`}>Contact {provider.name}</a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
