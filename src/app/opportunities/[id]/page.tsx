
'use client';

import { useOpportunitiesData } from "@/app/admin/opportunity-table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { initialOpportunities, opportunityIconMap } from "@/lib/opportunities";
import { notFound } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function OpportunityDetailPage({ params }: { params: { id: string }}) {
    const { opportunities } = useOpportunitiesData();
    const opportunity = opportunities.find(opp => opp.id === params.id);

    if (!opportunity) {
        // In a real app with a database, you would fetch the data here.
        // If not found, you'd show a 404 page. We simulate that here.
        return notFound();
    }
    
    const Icon = opportunityIconMap[opportunity.iconName] || Trophy;

    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <Badge variant={opportunity.badgeVariant}>{opportunity.type}</Badge>
                                    <CardTitle className="text-3xl mt-1">{opportunity.title}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6 text-lg">
                                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                    <DollarSign className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Prize / Budget</p>
                                        <p className="font-bold text-primary">{opportunity.prize}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                    <Calendar className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                                        <p className="font-bold">{opportunity.deadline}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.description}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild size="lg" className="w-full">
                                <Link href="/submit-work">
                                    Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
         </div>
    );
}

// This function can be used for generating static pages at build time
// For this prototype, we'll keep it simple and render dynamically on the client.
// export async function generateStaticParams() {
//   return initialOpportunities.map((opp) => ({
//     id: opp.id,
//   }))
// }
