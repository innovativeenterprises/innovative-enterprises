
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Building2, Cpu, GraduationCap, Handshake, HardHat, Package, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from 'next/image';

const Node = ({ icon: Icon, label, className, size = 'md' }: { icon: React.ElementType, label: string, className?: string, size?: 'sm' | 'md' | 'lg' }) => (
    <div className={cn(
        "absolute flex flex-col items-center gap-2 group animate-float",
        size === 'lg' && 'w-32 h-32',
        size === 'md' && 'w-24 h-24',
        size === 'sm' && 'w-20 h-20',
        className
    )}>
        <div className={cn(
            "flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:scale-110",
            size === 'lg' && 'w-32 h-32',
            size === 'md' && 'w-24 h-24',
            size === 'sm' && 'w-20 h-20'
        )}>
            <Icon className={cn(
                "text-primary transition-all duration-300 group-hover:text-primary-foreground group-hover:scale-125",
                size === 'lg' && 'w-16 h-16',
                size === 'md' && 'w-12 h-12',
                size === 'sm' && 'w-10 h-10'
            )} />
        </div>
        <p className="text-sm font-semibold text-center text-white drop-shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2">{label}</p>
    </div>
);

export default function EcosystemExplorerPage() {

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 opacity-30">
                <Image src="https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=2070&auto=format&fit=crop" alt="Network background" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/80 to-primary/50"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-4">
                <div className="max-w-4xl">
                     <Image src="/logo.png" alt="INNOVATIVE ENTERPRISES Logo" width={320} height={80} className="w-80 h-auto object-contain mx-auto mb-8" priority />
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        The Operating System for Business
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        An integrated ecosystem of AI agents, SaaS platforms, and digital services designed to automate and accelerate your success.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-200">
                            <a href="#explore">Explore The Ecosystem</a>
                        </Button>
                         <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                            <Link href="/partner">Become a Partner</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <section id="explore" className="relative w-full min-h-screen py-32 flex items-center justify-center">
                 {/* Decorative Lines */}
                <div className="absolute inset-0 z-0">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                            </pattern>
                            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                                <rect width="100" height="100" fill="url(#smallGrid)"/>
                                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative w-full max-w-6xl h-[600px]">
                    {/* Central Node */}
                     <Link
                         href="/about"
                         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                         legacyBehavior>
                        <Node icon={Cpu} label="AI Core" size="lg" />
                    </Link>

                    {/* Surrounding Nodes */}
                    <Link href="/construction-tech" legacyBehavior>
                        <Node icon={HardHat} label="Construction Tech" className="top-[10%] left-[45%]" />
                    </Link>
                    <Link href="/real-estate-tech" legacyBehavior>
                        <Node icon={Building2} label="Real Estate Tech" className="top-[30%] left-[80%]" />
                    </Link>
                     <Link href="/education-tech" legacyBehavior>
                        <Node icon={GraduationCap} label="Education Tech" className="top-[70%] left-[75%]" />
                    </Link>
                    <Link href="/partner" legacyBehavior>
                         <Node icon={Handshake} label="Partner Network" className="top-[80%] left-[20%]" />
                    </Link>
                    <Link href="/automation" legacyBehavior>
                        <Node icon={Bot} label="AI Agents" className="top-[40%] left-[10%]" />
                    </Link>
                    <Link href="/saas-portfolio" legacyBehavior>
                        <Node icon={Package} label="SaaS Portfolio" className="top-[5%] left-[15%]" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
