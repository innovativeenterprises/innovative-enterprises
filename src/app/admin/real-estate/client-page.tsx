
'use client';

import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Building, Home } from "lucide-react";
import Link from 'next/link';

export default function AdminRealEstateClientPage() {

  const tools = [
    { 
      href: "/admin/real-estate/listings",
      title: "Property Listings",
      icon: Building,
      description: "Manage all property listings for the Smart Listing platform.",
      cta: "Manage Listings"
    },
    { 
      href: "/admin/real-estate/stairspace",
      title: "StairSpace Bookings",
      icon: Home,
      description: "Review and manage new booking requests for your StairSpace listings.",
      cta: "Manage Bookings"
    },
     { 
      href: "/admin/real-estate/property-valuator",
      title: "AI Property Valuator",
      icon: BarChart,
      description: "Use the AI-powered tool to get instant market valuations for properties.",
      cta: "Launch Valuator"
    },
  ];

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Real Estate Management</h1>
            <p className="text-muted-foreground">
                Manage property listings and utilize real estate AI tools.
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
                 <Card key={tool.title} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                           <tool.icon className="h-8 w-8 text-primary" />
                           <CardTitle className="text-2xl">{tool.title}</CardTitle>
                        </div>
                        <CardDescription>
                            {tool.description}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild className="w-full">
                            <Link href={tool.href}>{tool.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
