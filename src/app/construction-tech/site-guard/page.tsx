
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Camera, Wand2, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { transformImage } from '@/ai/flows/image-transformer';
import { CameraCapture } from '@/components/camera-capture';

export default function SiteGuardPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isCaptureMode, setIsCaptureMode] = useState(false);
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
    const { toast } = useToast();

    const handleCapture = async (imageUri: string) => {
        setIsCaptureMode(false);
        setIsLoading(true);
        setAnnotatedImage(null);
        setBaseImage(imageUri);
        toast({ title: "Image Captured!", description: "AI is now scanning for PPE compliance." });

        try {
            const result = await transformImage({
                baseImageUri: imageUri,
                prompt: 'Analyze this image of a construction worker. Identify if they are wearing a hard hat and a high-visibility vest. Draw a green checkmark over compliant items and a red "X" over missing items, with a label.'
            });
            setAnnotatedImage(result.imageDataUri);
            toast({ title: "Scan Complete!", description: "AI has analyzed the image for safety compliance." });
        } catch (error) {
            console.error("Image analysis failed:", error);
            toast({ title: "Analysis Failed", description: 'Could not analyze the image.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!annotatedImage) return;
        const link = document.createElement('a');
        link.href = annotatedImage;
        link.download = 'siteguard-compliance-scan.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Downloaded!", description: "The compliance scan image has been downloaded." });
    };

    const resetState = () => {
        setAnnotatedImage(null);
        setBaseImage(null);
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
                            title="Live Safety Scan"
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
                    <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">SiteGuard Compliance</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Use your device's camera to perform a live safety check. Our AI will analyze the image for Personal Protective Equipment (PPE) compliance.
              </p>
            </div>
            <div className="max-w-4xl mx-auto mt-12 space-y-8">
                {isLoading ? (
                    <Card>
                        <CardContent className="p-10 text-center">
                            <div className="flex flex-col items-center gap-6">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl">Scanning for Compliance...</CardTitle>
                                    <CardDescription>The AI is analyzing the image for safety gear. Please wait.</CardDescription>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : annotatedImage && baseImage ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Compliance Scan Results</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                             <div>
                                <h3 className="font-semibold text-center mb-2">Original</h3>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                    <Image src={baseImage} alt="Original Worker Photo" layout="fill" objectFit="contain" />
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <ArrowRight className="w-12 h-12 text-muted-foreground mx-auto" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-center mb-2">AI Analysis</h3>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                    <Image src={annotatedImage} alt="AI Annotated PPE Scan" layout="fill" objectFit="contain" />
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter className="flex-col sm:flex-row justify-between items-center gap-2">
                             <Button onClick={resetState} variant="outline">Start New Scan</Button>
                             <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download Scan Result</Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Start a New Safety Scan</CardTitle>
                            <CardDescription>Click the button below to open your camera and capture a photo for compliance analysis.</CardDescription>
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
