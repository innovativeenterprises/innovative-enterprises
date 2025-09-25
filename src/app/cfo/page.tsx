'use server';

import CfoDashboardPageClient from './client-page';
import type { Metadata } from 'next';
import { getCfoData } from '@/lib/firestore';
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Bot } from 'lucide-react';

export const metadata: Metadata = {
  title: "Fintech Super-App | CFO Dashboard",
  description: "Financial overview and analysis for your business operations.",
};

export default async function CfoPage() {
    const cfoData = await getCfoData();

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                 <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Fintech Super-App</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        An integrated financial services application providing AI-driven auditing, financial analysis, and CFO dashboard capabilities.
                    </p>
                </div>
                
                 <div className="max-w-4xl mx-auto mb-12">
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center justify-center gap-2"><Bot className="h-6 w-6"/> AI Audit Assistant</CardTitle>
                            <CardDescription className="text-center">
                            Use our standalone tool to upload financial documents and get a preliminary audit from Finley.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-center">
                            <Button asChild size="lg">
                                <Link href="/cfo/audit">Launch Audit Tool <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <CfoDashboardPageClient initialData={cfoData} />
            </div>
        </div>
    );
}
