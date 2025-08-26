
'use client';

import { useRef, useState } from "react";
import { useStaffData } from "@/app/admin/staff-table";
import { useServicesData } from "@/app/admin/service-table";
import { useProductsData } from "@/app/admin/product-table";
import { Button } from "@/components/ui/button";
import { Download, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// This is the hidden component that will be rendered to generate the PDF
const ProfileTemplate = ({ leadership, services, products, innerRef }: any) => (
    <div ref={innerRef} className="p-10 bg-white text-gray-800" style={{ width: '210mm', minHeight: '297mm'}}>
        <header className="flex items-center justify-between pb-6 border-b-2 border-primary">
            <div className="flex items-center gap-3">
                <Lightbulb className="w-10 h-10 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold text-primary">INNOVATIVE ENTERPRISES</h1>
                    <p className="text-sm text-gray-500">Official Company Profile</p>
                </div>
            </div>
            <p className="text-xs text-gray-500 text-right">Generated on:<br/>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <main className="mt-8 space-y-8">
            <section>
                <h2 className="text-xl font-semibold text-primary border-b border-gray-200 pb-2 mb-4">1. About Us</h2>
                <p className="text-sm leading-relaxed">
                    Innovative Enterprises is a leading Omani SME dedicated to delivering cutting-edge solutions in emerging technology and digital transformation. We empower businesses and government entities to thrive in the digital age by providing a suite of innovative products and services designed to enhance efficiency, drive growth, and foster collaboration. Our mission is to pioneer tomorrow's technology today, with a strong focus on local talent and client success.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-primary border-b border-gray-200 pb-2 mb-4">2. Leadership Team</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {leadership.map((member: any) => (
                        <div key={member.name}>
                            <h3 className="font-bold">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold text-primary border-b border-gray-200 pb-2 mb-4">3. Core Services</h2>
                <div className="space-y-4">
                    {services.map((service: any) => (
                        <div key={service.title}>
                            <h3 className="font-bold text-base">{service.title}</h3>
                            <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-primary border-b border-gray-200 pb-2 mb-4">4. Digital Products</h2>
                 <div className="space-y-4">
                    {products.map((product: any) => (
                        <div key={product.name}>
                            <div className="flex items-baseline gap-2">
                                <h3 className="font-bold text-base">{product.name}</h3>
                                <p className="text-xs font-medium text-gray-500">[Status: {product.stage}]</p>
                            </div>
                            <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
        <footer className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>For investment inquiries or partnership proposals, please contact us via our website or email.</p>
            <p className="font-semibold mt-1">Website: https://innovative-oman.com/invest | Email: invest@innovative.om</p>
        </footer>
    </div>
);


export default function CompanyProfileDownloader() {
    const { leadership } = useStaffData();
    const { services } = useServicesData();
    const { products } = useProductsData();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const enabledServices = services.filter(s => s.enabled);
    const enabledProducts = products.filter(p => p.enabled);
    const enabledLeadership = leadership.filter(l => l.enabled);


    const handleDownload = async () => {
        if (!profileRef.current) return;
        setIsGenerating(true);
        
        try {
            const canvas = await html2canvas(profileRef.current, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
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
            const ratio = canvasWidth / canvasHeight;
            const imgWidth = pdfWidth;
            const imgHeight = imgWidth / ratio;
            
            let position = 0;
            let heightLeft = imgHeight;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save("Innovative-Enterprises-Company-Profile.pdf");

            toast({ title: 'Profile Downloaded!', description: `Your PDF company profile is ready.` });

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            toast({ title: 'Download Failed', description: 'There was an error generating the PDF profile.', variant: 'destructive'});
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <div style={{ position: 'fixed', left: '-200vw', top: 0 }}>
                <ProfileTemplate 
                    innerRef={profileRef}
                    leadership={enabledLeadership}
                    services={enabledServices}
                    products={enabledProducts}
                />
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
