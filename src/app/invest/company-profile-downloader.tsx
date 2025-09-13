'use client';

import { useRef, useState } from "react";
import { useStaffData } from "@/hooks/use-global-store-data";
import { useServicesData } from "@/hooks/use-global-store-data";
import { useSettingsData } from "@/hooks/use-global-store-data";
import { initialProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Download, Lightbulb, Loader2, Mail, Phone, Globe, MapPin, Building2, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Image from "next/image";

// This is the hidden component that will be rendered to generate the PDF
const ProfileTemplate = ({ leadership, services, products, settings, innerRef, generatedDate }: any) => {

    return (
        <div ref={innerRef} className="bg-white text-gray-900" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Inter, sans-serif' }}>
            <div className="p-12">
                <header className="flex items-start justify-between pb-6 border-b-4 border-primary">
                    {settings.headerImageUrl ? (
                        <Image src={settings.headerImageUrl} alt="Company Header" width={240} height={80} className="h-20 w-auto object-contain" />
                    ) : (
                         <div className="flex items-center gap-4">
                            <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png" alt="INNOVATIVE ENTERPRISES Logo" width={240} height={60} className="h-16 w-auto object-contain" />
                        </div>
                    )}
                    <div className="text-right text-xs text-gray-500">
                        <p className="font-semibold">Generated On</p>
                        <p>{generatedDate}</p>
                    </div>
                </header>

                <main className="mt-8 grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        <section className="[break-inside:avoid]">
                            <h2 className="text-xl font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4">1. About Us</h2>
                            <p className="text-sm leading-relaxed text-gray-700">
                                INNOVATIVE ENTERPRISES is a leading Omani SME dedicated to delivering cutting-edge solutions in emerging technology and digital transformation. We empower businesses and government entities to thrive in the digital age by providing a suite of innovative products and services designed to enhance efficiency, drive growth, and foster collaboration. Our mission is to pioneer tomorrow's technology today, with a strong focus on local talent and client success.
                            </p>
                        </section>

                        <section className="[break-inside:avoid]">
                            <h2 className="text-xl font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4">2. Core Services</h2>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                {services.map((service: any) => (
                                    <div key={service.title} className="flex items-start gap-2 [break-inside:avoid]">
                                        <CheckSquare className="w-4 h-4 mt-1 text-accent shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-sm">{service.title}</h3>
                                            <p className="text-xs text-gray-600">{service.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                         <section className="[break-inside:avoid]">
                            <h2 className="text-xl font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4">3. Leadership Team</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {leadership.map((member: any) => (
                                    <div key={member.name} className="flex items-center gap-3 [break-inside:avoid]">
                                        <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                                        <div>
                                            <h3 className="font-bold text-sm">{member.name}</h3>
                                            <p className="text-xs text-gray-600">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                    <aside className="col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200 h-fit">
                         <h3 className="text-base font-bold text-primary mb-4">Contact Information</h3>
                         <div className="space-y-3 text-xs text-gray-700">
                            <div className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-0.5 text-primary shrink-0" /><p>Al Amerat, Muscat, Oman</p></div>
                            <div className="flex items-start gap-2"><Phone className="w-3 h-3 mt-0.5 text-primary shrink-0" /><p>+968 78492280</p></div>
                            <div className="flex items-start gap-2"><Globe className="w-3 h-3 mt-0.5 text-primary shrink-0" /><p>www.INNOVATIVE ENTERPRISES.tech</p></div>
                         </div>
                         <hr className="my-4"/>
                         <div className="space-y-3 text-xs text-gray-700">
                            <div className="flex items-start gap-2"><Building2 className="w-3 h-3 mt-0.5 text-primary shrink-0" /><p>CR: 1435192</p></div>
                            <div className="flex items-start gap-2"><Building2 className="w-3 h-3 mt-0.5 text-primary shrink-0" /><p>OCCI: 3077828</p></div>
                         </div>
                         <hr className="my-4"/>
                          <div className="space-y-2 text-xs text-gray-700">
                             <div className="flex items-start gap-2"><Mail className="w-3 h-3 mt-0.5 text-primary shrink-0" /><p>info@INNOVATIVE ENTERPRISES.tech</p></div>
                             <div className="flex items-start gap-2"><Mail className="w-3 h-3 mt-0.5 text-primary shrink-0" /><p>Investor@INNOVATIVE ENTERPRISES.tech</p></div>
                             <div className="flex items-start gap-2"><Mail className="w-3 h-3 mt-0.5 text-primary shrink-0" /><p>partners@INNOVATIVE ENTERPRISES.tech</p></div>
                          </div>
                    </aside>
                </main>

                 <section className="mt-8 pt-8 border-t-2 border-primary/20 [break-before:page]">
                    <h2 className="text-xl font-bold text-primary mb-4">4. Digital Products</h2>
                     <div className="grid grid-cols-2 gap-6">
                        {products.map((product: any) => (
                            <div key={product.name} className="flex gap-4 [break-inside:avoid]">
                                <img src={product.image} alt={product.name} className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200" />
                                <div>
                                    <h3 className="font-bold text-base">{product.name}</h3>
                                    <p className="text-xs font-semibold text-accent mb-1">{product.stage}</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            {settings.footerImageUrl ? (
                 <footer className="mt-8 p-4 bg-gray-100 text-center text-xs text-gray-600">
                    <Image src={settings.footerImageUrl} alt="Company Footer" width={500} height={50} className="object-contain mx-auto" />
                </footer>
            ) : (
                <footer className="mt-8 p-4 bg-gray-100 text-center text-xs text-gray-600">
                    <p className="font-semibold">INNOVATIVE ENTERPRISES</p>
                    <p>Your Partner in Digital Transformation</p>
                </footer>
            )}
        </div>
    );
};


export default function CompanyProfileDownloader() {
    const { leadership } = useStaffData();
    const { services } = useServicesData();
    const { settings } = useSettingsData();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const enabledServices = services.filter(s => s.enabled);
    const enabledLeadership = leadership.filter(l => l.enabled);
    const products = initialProducts.filter(p => p.enabled);

    const handleDownload = async () => {
        if (!profileRef.current) return;
        setIsGenerating(true);
        toast({ title: 'Generating PDF...', description: 'Please wait while we create your company profile.' });
        
        try {
            const canvas = await html2canvas(profileRef.current, {
                scale: 2, // Higher scale for better quality
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
    

    return (
        <>
            <div style={{ position: 'fixed', left: '-200vw', top: 0, zIndex: -100 }}>
                <ProfileTemplate 
                    innerRef={profileRef}
                    leadership={enabledLeadership}
                    services={enabledServices}
                    products={products}
                    settings={settings}
                    generatedDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
