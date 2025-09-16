
import { Trophy } from "lucide-react";
import { initialOpportunities } from "@/lib/opportunities";
import OpportunityGrid from "./opportunity-grid";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Opportunities & Competitions",
  description: "Explore open projects, tasks, and competitions for our network of talented freelancers, subcontractors, and partners. Find a challenge that excites you.",
};


export default function OpportunitiesPage() {
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-3">
                <Trophy className="w-10 h-10" />
                Opportunities & Competitions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                We believe in the power of collaboration and community. Here, we post open projects, tasks, and competitions for our network of talented freelancers, subcontractors, and partners. Find a challenge that excites you and let's create something amazing together.
            </p>
            </div>

            <div className="max-w-5xl mx-auto mt-16">
                <OpportunityGrid initialOpportunities={initialOpportunities} />
            </div>
        </div>
        </div>
    );
}
