
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Handshake } from "lucide-react";

export default function SanadOfficePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/partner');
    }, [router]);

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Handshake className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Join the Sanad Hub Network</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        This page has moved. We've consolidated our Sanad office, freelancer, and partner applications into a single, streamlined process. Please click the button below to proceed.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/partner">
                            Go to Partner Application <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
