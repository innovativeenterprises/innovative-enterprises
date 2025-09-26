
'use client';

import { HandCoins, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ListSpaceForm from "./list-space-form";

export default function ListSpacePage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
             <div>
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/real-estate-tech/stairspace">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to StairSpace
                    </Link>
                </Button>
                 <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <HandCoins className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">List Your Space</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Turn your unused space into a new revenue stream. Fill out the form below to add your micro-retail or storage space to the StairSpace marketplace.
                    </p>
                </div>
            </div>
            <ListSpaceForm />
        </div>
      </div>
    </div>
  );
}
