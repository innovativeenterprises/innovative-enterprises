import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Brush, Code, Megaphone, Calendar, DollarSign, ArrowRight } from "lucide-react";

const opportunities = [
    {
        title: "Company Rebranding Design Competition",
        type: "Design Competition",
        prize: "5,000 OMR",
        deadline: "2024-09-01",
        description: "We are looking for a complete rebranding of our corporate identity. This includes a new logo, color palette, and brand guidelines. The winning design will be implemented across all our platforms.",
        icon: Brush,
        badgeVariant: "default" as const
    },
    {
        title: "Develop a Customer Feedback Widget",
        type: "Subcontract Task",
        prize: "1,500 OMR",
        deadline: "2024-08-15",
        description: "We need a skilled React developer to build a reusable customer feedback widget for our various web applications. The widget should be lightweight, customizable, and integrate with our backend API.",
        icon: Code,
        badgeVariant: "secondary" as const
    },
    {
        title: "Marketing Campaign for a New Product Launch",
        type: "Branding Project",
        prize: "Negotiable",
        deadline: "2024-08-20",
        description: "We are seeking a marketing agency or freelancer to develop and execute a comprehensive marketing strategy for our upcoming product launch. The scope includes social media, content marketing, and PR.",
        icon: Megaphone,
        badgeVariant: "destructive" as const
    },
];

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

        <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opp) => (
                <Card key={opp.title} className="flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="bg-primary/10 p-3 rounded-full group-hover:bg-accent transition-colors">
                                <opp.icon className="w-7 h-7 text-primary group-hover:text-accent-foreground" />
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
                        <Button className="w-full">
                            View Details & Apply <ArrowRight className="ml-2 w-4 h-4"/>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
