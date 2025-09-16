
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, DollarSign, ArrowRight } from "lucide-react";
import type { Opportunity } from "@/lib/opportunities";
import { opportunityIconMap } from "@/lib/opportunities";
import Link from "next/link";

export const OpportunityCard = ({ opp }: { opp: Opportunity }) => {
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
