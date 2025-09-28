
'use server';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, ArrowRight, TrendingUp, FileText, Bot } from "lucide-react";
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ConstructFin | AI-Powered Financial Management for Construction",
  description: "Automated invoicing, expense tracking, and AI-powered budget forecasting to keep your construction projects financially sound.",
};


const features = [
    {
        icon: FileText,
        title: "Automated Invoicing",
        description: "Generate and send professional invoices automatically based on project milestones and material usage."
    },
    {
        icon: TrendingUp,
        title: "AI Budget Forecasting",
        description: "Our AI agent, Finley, analyzes your project data to provide accurate budget forecasts and identify potential cost overruns early."
    },
    {
        icon: Bot,
        title: "Fraud Detection",
        description: "Leverage AI to monitor project expenses in real-time and flag suspicious or duplicate transactions for review."
    }
];


export default function ConstructFinPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <DollarSign className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">ConstructFin</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            AI-Powered Financial Management for the Construction Industry. Keep your projects on budget and on time with automated invoicing, expense tracking, and intelligent forecasting.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <Card key={feature.title} className="text-center bg-card">
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
                    <CardTitle className="text-2xl text-accent">See It In Action</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                       Explore our live CFO Dashboard to see a demonstration of the powerful analytics and financial tracking capabilities that power ConstructFin.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/admin/cfo-dashboard">View Demo Dashboard <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
