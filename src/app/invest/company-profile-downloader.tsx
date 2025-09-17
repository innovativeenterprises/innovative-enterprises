
'use client';

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProfileDataLoader } from "./profile-data-loader";

export default function CompanyProfileDownloader() {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const handleDownload = async () => {
        if (!profileRef.current || !isClient) return;
        setIsGenerating(true);
        toast({ title: 'Generating PDF...', description: 'Please wait while we create your company profile.' });
        
        try {
            const canvas = await html2canvas(profileRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: null,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = pdfWidth / canvasWidth;
            const totalPDFPages = Math.ceil(canvasHeight * ratio / pdfHeight);
            
            for (let i = 0; i < totalPDFPages; i++) {
                if (i > 0) {
                    pdf.addPage();
                }
                const yPos = -(pdfHeight * i);
                pdf.addImage(imgData, 'PNG', 0, yPos, pdfWidth, canvasHeight * ratio);
            }

            pdf.save("INNOVATIVE-ENTERPRISES-Company-Profile.pdf");

            toast({ title: 'Profile Downloaded!', description: `Your PDF company profile is ready.` });

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            toast({ title: 'Download Failed', description: 'There was an error generating the PDF profile.', variant: 'destructive'});
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (!isClient) {
        return (
            <Button variant="outline" size="lg" className="bg-primary/10 border-primary/20 text-primary" disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading Profile Data...
            </Button>
        );
    }

    return (
        <>
            <div style={{ position: 'fixed', left: '-200vw', top: 0, zIndex: -100, opacity: 0 }}>
                <ProfileDataLoader innerRef={profileRef} />
            </div>
            <Button onClick={handleDownload} variant="outline" size="lg" className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:text-primary" disabled={isGenerating}>
                 {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
                    </>
                ) : (
                    <>
                        <Download className="mr-2 h-5 w-5" /> Dynamic Company Profile
                    </>
                )}
            </Button>
        </>
    );
}
