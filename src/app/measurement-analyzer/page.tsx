
'use client';

import { useState } from 'react';
import { CameraCapture } from '@/components/camera-capture';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MeasurementAnalyzerPage() {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCaptureMode, setIsCaptureMode] = useState(false);
    const { toast } = useToast();

    const handleCapture = async (imageUri: string) => {
        setIsLoading(true);
        setCapturedImage(imageUri);
        
        // Simulate sending to an AI analysis flow
        toast({ title: "Analyzing Image...", description: "AI is processing the captured image." });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({ title: "Analysis Complete", description: "Measurements extracted." });
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
                Use your device's camera for live object scanning and measurement analysis.
              </p>
            </div>
            <div className="max-w-xl mx-auto mt-12">
                 <Card>
                    <CardHeader>
                        <CardTitle>Start a New Scan</CardTitle>
                        <CardDescription>Click the button below to open your camera and start scanning an object.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <Button size="lg" onClick={() => setIsCaptureMode(true)}>Start Live Scan</Button>
                        {isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
                        {capturedImage && !isLoading && (
                            <div className="w-full space-y-4">
                                <p className="text-center font-semibold">Last Captured Image:</p>
                                <img src={capturedImage} alt="Last captured" className="rounded-lg border" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
    );
}
