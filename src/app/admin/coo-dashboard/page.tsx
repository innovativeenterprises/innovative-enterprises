
'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/products.schema';
import type { Provider } from '@/lib/providers.schema';
import type { KpiData } from '@/lib/cfo-data.schema';
import { analyzeOperations } from '@/ai/flows/agentic-coo';
import type { CooAnalysisOutput } from '@/ai/flows/agentic-coo.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, Loader2, RefreshCw, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useProductsData } from '@/hooks/use-global-store-data';
import { useProvidersData } from '@/hooks/use-global-store-data';
import { useCfoData } from '@/hooks/use-global-store-data';

const RiskCard = ({ risk }: { risk: CooAnalysisOutput['identifiedRisks'][0] }) => {
    const severityMap = {
        'High': 'destructive',
        'Medium': 'default',
        'Low': 'secondary'
    } as const;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{risk.source}</CardTitle>
                    <Badge variant={severityMap[risk.severity]}>{risk.severity} Severity</Badge>
                </div>
                <CardDescription className="flex items-center gap-2 pt-2"><AlertTriangle className="h-4 w-4"/> {risk.risk}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{risk.recommendation}</p>
            </CardContent>
        </Card>
    )
}

export default function CooDashboardPage() {
    const { products } = useProductsData();
    const { providers } = useProvidersData();
    const { cfoData } = useCfoData();

    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<CooAnalysisOutput | null>(null);

    const runAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await analyzeOperations({ products, providers, kpiData: cfoData.kpiData });
            setAnalysis(result);
        } catch (error) {
            console.error("COO Analysis failed:", error);
            // Handle error state if necessary
        } finally {
            setIsLoading(false);
        }
    };

    // Run analysis on initial load
    useEffect(() => {
        runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3"><BrainCircuit className="h-8 w-8"/> AI COO Dashboard</h1>
                    <p className="text-muted-foreground">
                        JADE's real-time operational analysis of the entire business ecosystem.
                    </p>
                </div>
                <Button onClick={runAnalysis} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Refresh Analysis
                </Button>
            </div>
            
            {isLoading && !analysis && (
                <Card>
                    <CardContent className="p-10 text-center">
                        <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                        <p className="mt-4 text-lg text-muted-foreground">JADE is analyzing real-time operational data...</p>
                    </CardContent>
                </Card>
            )}

            {analysis && (
                 <div className="space-y-8">
                     <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Executive Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{analysis.executiveSummary}</p>
                        </CardContent>
                    </Card>

                     <div>
                        <h2 className="text-2xl font-bold mb-4">Identified Risks & Mitigations</h2>
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {analysis.identifiedRisks.length > 0 ? (
                                analysis.identifiedRisks.map((risk, index) => (
                                    <RiskCard key={index} risk={risk} />
                                ))
                            ) : (
                                 <div className="lg:col-span-3">
                                    <Alert>
                                        <CheckCircle className="h-4 w-4"/>
                                        <AlertTitle>No Major Risks Identified</AlertTitle>
                                        <AlertDescription>
                                            JADE's analysis did not find any critical operational risks at this time.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    </div>

                      <div>
                        <h2 className="text-2xl font-bold mb-4">Strategic Opportunities</h2>
                        <div className="space-y-4">
                            {analysis.strategicOpportunities.map((opportunity, index) => (
                                <Alert key={index}>
                                    <Lightbulb className="h-4 w-4" />
                                    <AlertTitle>Opportunity #{index + 1}</AlertTitle>
                                    <AlertDescription>{opportunity}</AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
}
