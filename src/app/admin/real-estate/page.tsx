
'use client';

import PropertyTable from "../property-table";
import StairspaceTable from "@/app/admin/stairspace-table";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function AdminRealEstatePage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Real Estate Management</h1>
            <p className="text-muted-foreground">
                Manage property listings for all real estate technology platforms.
            </p>
        </div>

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

        <PropertyTable />
        <StairspaceTable />
    </div>
  );
}
