

'use client';

import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart } from "lucide-react";
import Link from 'next/link';
import PropertyTable from "./property-table";
import StairspaceTable from "./stairspace-table";
import type { Property } from '@/lib/properties.schema';
import type { StairspaceListing } from '@/lib/stairspace.schema';


// --- Main Page Component ---
export default function AdminRealEstateClientPage({ 
    initialProperties, 
    initialStairspaceListings
}: {
    initialProperties: Property[],
    initialStairspaceListings: StairspaceListing[],
}) {

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Real Estate Management</h1>
            <p className="text-muted-foreground">
                Manage property listings and utilize real estate AI tools.
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>StairSpace Management</CardTitle>
                    <CardDescription>
                        Review new booking requests for your StairSpace listings.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/admin/real-estate/stairspace">Manage Booking Requests <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>AI Property Valuator</CardTitle>
                    <CardDescription>
                       Use the AI-powered tool to get instant market valuations for properties.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/admin/real-estate/property-valuator">Launch Valuator <BarChart className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>


        <PropertyTable initialProperties={initialProperties} />
        <StairspaceTable initialStairspaceListings={initialStairspaceListings} />
    </div>
  );
}
