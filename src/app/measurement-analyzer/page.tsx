
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Camera, Wand2, Download, ArrowRight, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { annotateImage } from '@/ai/flows/image-annotation';
import type { ImageAnnotatorOutput } from '@/ai/flows/image-annotation.schema';
import { CameraCapture } from '@/components/camera-capture';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Measurement Analyzer | Innovative Enterprises",
  description: "Use your device's camera for live object scanning and measurement analysis. Our AI will attempt to estimate physical dimensions from an image.",
};

export default function MeasurementAnalyzerPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isCaptureMode, setIsCaptureMode] = useState(false);
    const [analysis, setAnalysis] = useState<ImageAnnotatorOutput | null>(null);
    const { toast } = useToast();

    const handleCapture = async (imageUri: string) => {
        setIsCaptureMode(false);
        setIsLoading(true);
        setAnalysis(null);
        toast({ title: "Image Captured!", description: "AI is now analyzing the object to extract measurements." });

        try {
            const result = await annotateImage({ baseImageUri: imageUri });
            setAnalysis(result);
            toast({ title: "Analysis Complete!", description: "AI has estimated the object's dimensions." });
        } catch (error) {
            console.error("Image analysis failed:", error);
            toast({ title: "Analysis Failed", description: 'Could not analyze the image.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!analysis?.annotatedImageUri) return;
        const link = document.createElement('a');
        link.href = analysis.annotatedImageUri;
        link.download = 'annotated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Downloaded!", description: "The annotated image has been downloaded." });
    };

    const resetState = () => {
        setAnalysis(null);
        setIsLoading(false);
        setIsCaptureMode(false);
    };

    if (isCaptureMode) {
        return (
            <div className="bg-background min-h-[calc(100vh-8rem)]">
              <div className="container mx-auto px-4 py-16">
                <div className="max-w-xl mx-auto">
                    <Card>
                        <CameraCapture
                            title="Live Measurement Scan"
                            onCapture={handleCapture}
                            onCancel={() => setIsCaptureMode(false)}
                        />
                    </Card>
                </div>
              </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <Layers className="w-10 h-10 text-primary" />
                </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Measurement Analyzer</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Use your device's camera for live object scanning and measurement analysis. Capture an image of an object, and our AI will attempt to estimate its physical dimensions.
              </p>
            </div>
            <div className="max-w-4xl mx-auto mt-12 space-y-8">
                {isLoading ? (
                    <Card>
                        <CardContent className="p-10 text-center">
                            <div className="flex flex-col items-center gap-6">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl">Analyzing Object...</CardTitle>
                                    <CardDescription>The AI is identifying the object and estimating its dimensions. Please wait.</CardDescription>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : analysis ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Result</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6 items-start">
                             <div>
                                <h3 className="font-semibold text-center mb-2">Annotated Image</h3>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                    <Image src={analysis.annotatedImageUri} alt="AI Annotated Image" layout="fill" objectFit="contain" />
                                </div>
                            </div>
                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg"><Layers /> Digital Twin Analysis</CardTitle>
                                    <CardDescription>AI-estimated physical properties of the scanned object.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="space-y-2">
                                        <h4 className="font-semibold">Identified Object:</h4>
                                        <p className="text-primary font-bold text-xl">{analysis.identifiedObject}</p>
                                     </div>
                                     <div className="space-y-2">
                                        <h4 className="font-semibold">Estimated Dimensions:</h4>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="p-2 bg-background rounded-md">
                                                <p className="text-xs text-muted-foreground">Height</p>
                                                <p className="font-mono font-semibold">{analysis.estimatedDimensions.height}</p>
                                            </div>
                                             <div className="p-2 bg-background rounded-md">
                                                <p className="text-xs text-muted-foreground">Width</p>
                                                <p className="font-mono font-semibold">{analysis.estimatedDimensions.width}</p>
                                            </div>
                                             <div className="p-2 bg-background rounded-md">
                                                <p className="text-xs text-muted-foreground">Depth</p>
                                                <p className="font-mono font-semibold">{analysis.estimatedDimensions.depth}</p>
                                            </div>
                                        </div>
                                     </div>
                                      <div className="space-y-2">
                                        <h4 className="font-semibold">Other Metrics:</h4>
                                         <p className="text-sm text-muted-foreground">{analysis.otherMetrics || "No other specific metrics could be determined."}</p>
                                     </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                        <CardFooter className="flex-col sm:flex-row justify-between items-center gap-2">
                             <Button onClick={resetState} variant="outline">Start New Scan</Button>
                             <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download Annotated Image</Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Start a New Scan</CardTitle>
                            <CardDescription>Click the button below to open your camera and capture an object for measurement.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            <Button size="lg" onClick={() => setIsCaptureMode(true)}><Camera className="mr-2 h-5 w-5" /> Start Live Scan</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
          </div>
        </div>
    );
}
