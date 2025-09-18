
'use client';

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Mail, Phone, Globe, MapPin, Building2, CheckSquare } from "lucide-react";
import Image from "next/image";
import type { Agent, AgentCategory } from "@/lib/agents.schema";
import type { Service } from "@/lib/services.schema";
import type { AppSettings } from "@/lib/settings";
import type { Product } from "@/lib/products.schema";

// This is a pure client component responsible for rendering the hidden template for PDF generation.
export const ProfileDataLoader = ({ 
    innerRef, 
    staffData,
    services,
    settings,
    products
}: { 
    innerRef: React.RefObject<HTMLDivElement>,
    staffData: { leadership: Agent[], staff: Agent[], agentCategories: AgentCategory[] },
    services: Service[],
    settings: AppSettings,
    products: Product[],
}) => {
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const { leadership } = staffData;
    const enabledLeadership = leadership.filter(m => m.enabled);
    const enabledServices = services.filter(s => s.enabled);
    const enabledProducts = products.filter(p => p.enabled);

    return (
        <div ref={innerRef} className="bg-white text-gray-900" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Inter, sans-serif' }}>
            <div className="p-12">
                <header className="flex items-start justify-between pb-6 border-b-4 border-primary">
                    {settings.headerImageUrl ? (
                        <Image src={settings.headerImageUrl} alt="Company Header" width={240} height={80} style={{width: 'auto'}} className="h-20 w-auto object-contain" />
                    ) : (
                         <div className="flex items-center gap-4">
                            <Image src="/logo.png" alt="INNOVATIVE ENTERPRISES Logo" width={240} height={60} className="h-16 w-auto object-contain" />
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
                                {enabledServices.map((service: any) => (
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
                                {enabledLeadership.map((member: any) => (
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
                        {enabledProducts.map((product: any) => (
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
