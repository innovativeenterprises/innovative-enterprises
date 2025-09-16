
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Calendar, Scissors, Sparkles as BeautySparkles, Users, UserCheck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Beauty & Wellness Hub | Innovative Enterprises",
  description: "A complete SaaS solution for salons, spas, and barbershops. Manage appointments, staff, services, and client relationships with our AI-powered dashboard.",
};


const platformFeatures = [
    {
        icon: Calendar,
        title: "Smart Scheduling",
        description: "An intelligent appointment booking system that manages your calendar and prevents double-bookings."
    },
    {
        icon: Users,
        title: "Staff Management",
        description: "Manage your specialists' schedules, services, and performance all in one place."
    },
     {
        icon: UserCheck,
        title: "Client Relationship Management",
        description: "Keep track of your clients' preferences and appointment history to provide a personalized experience."
    },
];

export default function BeautyHubPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <BeautySparkles className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Beauty & Wellness Hub</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete SaaS solution for salons, spas, and barbershops. Manage appointments, staff, services, and client relationships with our AI-powered dashboard.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Features</h2>
                <p className="mt-4 text-lg text-muted-foreground">Everything you need to run your beauty business smoothly.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {platformFeatures.map((feature) => (
                    <Card key={feature.title} className="text-center bg-card flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                         <CardHeader className="items-center">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <feature.icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="pt-2">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">Elevate Your Business</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                      This platform is currently in a pilot phase. Contact us to learn how the Beauty & Wellness Hub can be tailored for your business.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                     <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/beauty-hub/agency-dashboard">View Demo Dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
