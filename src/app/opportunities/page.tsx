'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, DollarSign, ArrowRight } from "lucide-react";
import type { Opportunity } from "@/lib/opportunities";
import { opportunityIconMap } from "@/lib/opportunities";
import { useOpportunitiesData } from "@/hooks/use-global-store-data";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Opportunities & Competitions",
  description: "Explore open projects, tasks, and competitions for our network of talented freelancers, subcontractors, and partners. Find a challenge that excites you.",
};

const OpportunityCard = ({ opp }: { opp: Opportunity }) => {
    const getStatusColor = () => {
        switch (opp.status) {
            case 'Open': return 'border-green-500/50 bg-green-500/5';
            case 'In Progress': return 'border-yellow-500/50 bg-yellow-500/5';
            case 'Closed': return 'border-red-500/50 bg-red-500/5 opacity-60';
            default: return '';
        }
    }
    const Icon = opportunityIconMap[opp.iconName] || Trophy; // Fallback to Trophy icon
    return (
         <Card key={opp.title} className={`flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 ${getStatusColor()}`}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="bg-primary/10 p-3 rounded-full group-hover:bg-accent transition-colors">
                        <Icon className="w-7 h-7 text-primary group-hover:text-accent-foreground" />
                    </div>
                    <Badge variant={opp.badgeVariant}>{opp.type}</Badge>
                </div>
                <CardTitle className="pt-4">{opp.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <CardDescription>{opp.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                <div className="w-full space-y-2">
                     <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-2"><DollarSign className="w-4 h-4"/> Prize / Budget</span>
                        <span className="text-primary font-bold">{opp.prize}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Deadline</span>
                        <span>{opp.deadline}</span>
                    </div>
                </div>
                <Button asChild className="w-full" disabled={opp.status === 'Closed'}>
                   {opp.status === 'Closed' ? (
                       <span>Closed for Applications</span>
                   ) : (
                       <Link href={`/opportunities/${opp.id}`}>
                           View Details & Apply <ArrowRight className="ml-2 w-4 h-4"/>
                       </Link>
                   )}
                </Button>
            </CardFooter>
        </Card>
    )
}

const OpportunityGridSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({length: 6}).map((_, i) => (
            <Card key={i} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="pt-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                     <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        ))}
    </div>
)

export default function OpportunitiesPage() {
    const { opportunities, isClient } = useOpportunitiesData();

    const publicOpportunities = isClient 
        ? opportunities
            .filter(opp => opp.status !== 'Closed')
            .sort((a,b) => (a.status === 'In Progress' ? -1 : 1))
        : [];

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
                {!isClient ? (
                    <OpportunityGridSkeleton />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publicOpportunities.map((opp) => (
                            <OpportunityCard key={opp.id} opp={opp} />
                        ))}
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}
