
'use client';

import { useState, useRef } from 'react';
import { CameraCapture } from '@/components/camera-capture';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowLeft, Camera, Wand2, Download, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { annotateImage } from '@/ai/flows/image-annotation';

export default function MeasurementAnalyzerPage() {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCaptureMode, setIsCaptureMode] = useState(false);
    const [prompt, setPrompt] = useState<string>("Draw a bounding box around the main object and show its estimated dimensions.");
    const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
    const { toast } = useToast();

    const handleCapture = (imageUri: string) => {
        setCapturedImage(imageUri);
        setIsCaptureMode(false);
        toast({ title: "Image Captured!", description: "Now, provide a prompt for the AI to analyze the image." });
    };

    const handleAnalyze = async () => {
        if (!capturedImage) {
            toast({ title: 'No Image', description: 'Please capture an image first.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setAnnotatedImage(null);
        toast({ title: "Analyzing Image...", description: "The AI is processing the image. This may take a moment." });

        try {
            const result = await annotateImage({ baseImageUri: capturedImage, prompt });
            setAnnotatedImage(result.imageDataUri);
            toast({ title: "Analysis Complete!", description: "The image has been annotated by the AI." });
        } catch (error) {
            console.error("Image annotation failed:", error);
            toast({ title: "Analysis Failed", description: 'Could not annotate the image.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!annotatedImage) return;
        const link = document.createElement('a');
        link.href = annotatedImage;
        link.download = 'annotated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Downloaded!", description: "The annotated image has been downloaded." });
    };

    const resetState = () => {
        setCapturedImage(null);
        setAnnotatedImage(null);
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
              <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Measurement Analyzer</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Use your device's camera for live object scanning and measurement analysis. Capture an image, provide instructions, and let the AI do the work.
              </p>
            </div>
            <div className="max-w-4xl mx-auto mt-12 space-y-8">
                {!capturedImage ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Start a New Scan</CardTitle>
                            <CardDescription>Click the button below to open your camera and start scanning an object.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            <Button size="lg" onClick={() => setIsCaptureMode(true)}><Camera className="mr-2 h-5 w-5" /> Start Live Scan</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Analyze Captured Image</CardTitle>
                            <CardDescription>Provide a prompt to tell the AI what to do with the image.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                 <Image src={capturedImage} alt="Captured for analysis" layout="fill" objectFit="contain" />
                            </div>
                            <Textarea
                                placeholder="Enter your prompt here..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                            />
                        </CardContent>
                        <CardFooter className="flex-col sm:flex-row gap-2">
                             <Button onClick={handleAnalyze} disabled={isLoading} className="w-full sm:w-auto">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Analyze with AI
                            </Button>
                             <Button variant="outline" onClick={resetState} className="w-full sm:w-auto">Start Over</Button>
                        </CardFooter>
                    </Card>
                )}

                {isLoading && (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">The AI is analyzing and annotating the image...</p>
                        </CardContent>
                    </Card>
                )}

                 {annotatedImage && capturedImage && (
                     <Card>
                        <CardHeader>
                            <CardTitle>Analysis Result</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                            <div>
                                <h3 className="font-semibold text-center mb-2">Before</h3>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                    <Image src={capturedImage} alt="Original Room" layout="fill" objectFit="contain" />
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <ArrowRight className="w-12 h-12 text-muted-foreground mx-auto" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-center mb-2">After (AI Annotated)</h3>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                    <Image src={annotatedImage} alt="AI Generated Design" layout="fill" objectFit="contain" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button onClick={handleDownload} variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Download Annotated Image
                            </Button>
                        </CardFooter>
                    </Card>
                )}

            </div>
          </div>
        </div>
    );
}
