
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, BookUser, BarChart3, XCircle, CheckCircle, Handshake, Briefcase, DollarSign } from "lucide-react";
import Link from "next/link";
import { useMembersData, useEventsData, useAlumniJobsData } from "@/hooks/use-global-store-data";
import type { CommunityMember } from '@/lib/community-members';
import type { CommunityEvent } from '@/lib/community-events';
import type { JobPosting } from '@/lib/alumni-jobs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Professional Training & Education Hub",
  description: "A digital platform connecting trainers, educators, and professionals with their local markets, offering tools for marketing, networking, and business management.",
};


const challenges = [
    { icon: XCircle, text: "Limited marketing knowledge and resources." },
    { icon: XCircle, text: "Difficulty reaching their target local audience." },
    { icon: XCircle, text: "Lack of professional networking opportunities." },
    { icon: XCircle, text: "Inconsistent client acquisition." },
];

const solutions = [
    { icon: CheckCircle, text: "SEO-optimized profiles for enhanced visibility." },
    { icon: CheckCircle, text: "Geolocation-based discovery to connect with local clients." },
    { icon: CheckCircle, text: "Tools for client testimonials and portfolio displays." },
    { icon: CheckCircle, text: "Integrated booking, scheduling, and payment systems." },
];

const platformFeatures = [
    { 
        icon: Briefcase, 
        title: "Showcase Your Expertise",
        description: "Build a professional, SEO-optimized profile with portfolio displays, client testimonials, and skill certifications to establish credibility."
    },
    { 
        icon: BarChart3, 
        title: "Marketing & Lead Generation",
        description: "Utilize social media templates, email marketing automation, and our lead generation system to attract and convert clients consistently."
    },
    { 
        icon: Handshake, 
        title: "Local Networking",
        description: "Join regional networking groups, find local partnership opportunities, and promote your events on our community bulletin board."
    },
    { 
        icon: DollarSign, 
        title: "Business Management",
        description: "Simplify your admin work with our integrated CRM, booking system, contract templates, and revenue analytics dashboard."
    }
];

export default function ProfessionalHubPage() {
  
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <BookUser className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Professional Training &amp; Education Hub</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive digital platform designed to connect trainers, educators, and subject matter experts with their local markets, providing the tools you need to build a credible online presence and a sustainable business.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-2 gap-8">
            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive text-2xl">The Challenge</CardTitle>
                    <CardDescription>Professionals struggle to market themselves effectively and connect with a local audience.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {challenges.map(item => (
                            <li key={item.text} className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-destructive flex-shrink-0" />
                                <span className="text-muted-foreground">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
             <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                    <CardTitle className="text-green-600 text-2xl">Our Solution</CardTitle>
                    <CardDescription>We provide the tools to build your brand and your business, all in one place.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-3">
                        {solutions.map(item => (
                            <li key={item.text} className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span className="text-muted-foreground">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Platform Features</h2>
                <p className="mt-4 text-lg text-muted-foreground">Everything you need to succeed as an independent professional.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platformFeatures.map(feature => (
                    <Card key={feature.title} className="text-center bg-card flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <CardHeader className="items-center">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <feature.icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="pt-2 text-lg">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">Join Our Network</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                      Ready to grow your training or education business? Become a partner to get listed on the hub and access our suite of business tools.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">Become a Partner <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
