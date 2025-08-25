
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Download, FileSignature, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Agreement {
    ndaContent: string;
    serviceAgreementContent: string;
}

interface BriefcaseData {
    recordNumber: string;
    applicantName: string;
    agreements: Agreement;
    date: string;
}

export default function BriefcasePage() {
    const [briefcaseData, setBriefcaseData] = useState<BriefcaseData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('user_briefcase');
            if (storedData) {
                setBriefcaseData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Failed to load briefcase data from localStorage", error);
            toast({
                title: 'Error Loading Data',
                description: 'Could not retrieve your saved documents.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const handleDownloadAgreement = (type: 'nda' | 'service') => {
        if (!briefcaseData?.agreements) return;
        const content = type === 'nda' ? briefcaseData.agreements.ndaContent : briefcaseData.agreements.serviceAgreementContent;
        const filename = type === 'nda' ? `NDA-${briefcaseData.recordNumber}.txt` : `Service-Agreement-${briefcaseData.recordNumber}.txt`;
        
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast({ title: 'Downloaded!', description: `Your ${filename} has been downloaded.`});
    };
    
    const handleESign = () => {
        toast({ title: 'Agreements Already Signed', description: "Your agreements have been electronically signed and saved."});
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <p>Loading your E-Briefcase...</p>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Briefcase className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">My E-Briefcase</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Your personal, secure space for all documents related to your partnership with Innovative Enterprises.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto mt-12">
                    {briefcaseData ? (
                        <Card>
                             <CardHeader>
                                <CardTitle>Welcome, {briefcaseData.applicantName}</CardTitle>
                                <CardDescription>
                                    Record Number: <span className="font-mono">{briefcaseData.recordNumber}</span>
                                    <br />
                                    Generated on: {new Date(briefcaseData.date).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Tabs defaultValue="nda" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="nda"><FileText className="mr-2 h-4 w-4"/> Non-Disclosure Agreement</TabsTrigger>
                                        <TabsTrigger value="service"><FileText className="mr-2 h-4 w-4"/> Service Agreement</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="nda">
                                        <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                                            {briefcaseData.agreements.ndaContent}
                                        </div>
                                        <Button onClick={() => handleDownloadAgreement('nda')} variant="outline" className="w-full mt-2">
                                            <Download className="mr-2 h-4 w-4" /> Download NDA
                                        </Button>
                                    </TabsContent>
                                    <TabsContent value="service">
                                        <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                                            {briefcaseData.agreements.serviceAgreementContent}
                                        </div>
                                        <Button onClick={() => handleDownloadAgreement('service')} variant="outline" className="w-full mt-2">
                                            <Download className="mr-2 h-4 w-4" /> Download Service Agreement
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                             <CardFooter>
                                <Button onClick={handleESign} className="w-full" size="lg">
                                    <FileSignature className="mr-2 h-5 w-5" /> View E-Signature
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="text-center">
                            <CardContent className="p-10 flex flex-col items-center gap-4">
                                <div className="bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full">
                                    <AlertTriangle className="h-12 w-12 text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-semibold">Your E-Briefcase is Empty</h3>
                                <p className="text-muted-foreground max-w-md">
                                    It looks like you haven't saved any documents yet. After you complete an agent or partner application, you can save your agreements here.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
