
'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// This page is now a simple redirect. The functionality lives in /partner.
// We keep this page for any legacy links.

export default function AgentPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Join Our Network</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            This page has moved. We've consolidated our agent, freelancer, and partner applications into a single, streamlined process. Please click the button below to proceed.
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
