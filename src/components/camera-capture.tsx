
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, X, RefreshCw, Upload, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export function CameraCapture({ title, onCapture, onCancel }: { title: string, onCapture: (imageUri: string) => void, onCancel: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const getCameraPermission = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error('Camera API not available.');
                setHasCameraPermission(false);
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera permissions in your browser settings.',
                });
            }
        };

        getCameraPermission();
        
        return () => {
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [toast]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUri = canvas.toDataURL('image/jpeg');
                setCapturedImage(dataUri);
            }
        }
    };
    
    const handleConfirm = () => {
        if(capturedImage) {
            onCapture(capturedImage);
        }
    }

    const renderContent = () => {
        if (hasCameraPermission === null) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Requesting camera access...</p>
                </div>
            )
        }

        if (hasCameraPermission === false) {
             return (
                <div className="p-8">
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            We couldn't access your camera. Please ensure you have a camera connected and have granted permission in your browser's site settings.
                        </AlertDescription>
                    </Alert>
                </div>
            );
        }
        
        if (capturedImage) {
            return (
                 <div className="p-4 space-y-4">
                    <img src={capturedImage} alt="Captured ID" className="rounded-lg w-full" />
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setCapturedImage(null)} className="w-full">
                            <RefreshCw className="mr-2"/> Retake
                        </Button>
                        <Button onClick={handleConfirm} className="w-full">
                           <CheckCircle className="mr-2"/> Confirm
                        </Button>
                    </div>
                </div>
            )
        }

        return (
            <div className="p-4 space-y-4">
                <div className="relative w-full aspect-[16/10] bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[85%] h-[80%] border-4 border-dashed border-white/50 rounded-lg" style={{
                            mask: 'radial-gradient(circle at center, transparent 0%, transparent 98%, black 100%), linear-gradient(black, black)',
                            maskComposite: 'intersect',
                            WebkitMaskComposite: 'xor',
                        }}></div>
                    </div>
                </div>
                <Button onClick={handleCapture} size="lg" className="w-full">
                    <Camera className="mr-2" /> Capture
                </Button>
            </div>
        )

    }

    return (
        <>
            <CardHeader>
                <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={onCancel}>&larr; Back</Button>
                <CardTitle className="text-center pt-8">{title}</CardTitle>
                <CardDescription className="text-center">Position your card inside the frame and capture.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </>
    )
}
