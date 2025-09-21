

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, GraduationCap, AlertTriangle, GanttChartSquare, ClipboardCheck, Users, Search, DollarSign, Cpu, BarChart, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import type { Product } from "@/lib/products.schema";

const problems = [
    { title: "Manual Processes", description: "Administrative overhead from manual paperwork, scheduling, and approvals slows down institutions." },
    { title: "One-Size-Fits-All Learning", description: "Lack of personalized learning paths leads to disengaged students and teacher burnout." },
    { title: "Student Success Gaps", description: "Identifying at-risk students and providing timely career guidance is a major challenge." },
];

const ProductCard = ({ product }: { product: Product }) => {
    const iconMap: { [key: string]: React.ElementType } = {
        "EduFlow Suite": GanttChartSquare,
        "CognitaLearn": Cpu,
        "Guardian AI": ShieldCheck,
        "CertiTrust": ClipboardCheck,
        "CampusOS": BarChart,
        "AI Scholarship Finder": DollarSign,
        "Teacher Toolkit": Users,
        "AlumniConnect": Users,
    };
    const Icon = iconMap[product.name] || GraduationCap;

    return (
    <Card className="flex flex-col h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
            <CardDescription>{product.description}</CardDescription>
        </CardContent>
        <CardFooter>
            {product.href ? (
                 <Button asChild className="w-full">
                    <Link href={product.href}>Use Tool</Link>
                </Button>
            ) : (
                <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
            )}
        </CardFooter>
    </Card>
)};


export default function EducationTechClientPage({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);
    
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Education Technology Solutions</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A suite of AI-driven platforms to enhance learning, streamline administration, and improve student outcomes.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">The Challenge</h2>
                <p className="mt-4 text-lg text-muted-foreground">Modern education faces complex administrative and pedagogical hurdles.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {problems.map((problem) => (
                    <Card key={problem.title} className="text-center bg-muted/50 border-l-4 border-destructive/50">
                        <CardHeader>
                             <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
                            <CardTitle className="pt-2">{problem.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{problem.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Our AI-Powered Platforms</h2>
                <p className="mt-4 text-lg text-muted-foreground">A preview of our dedicated solutions for the education sector.</p>
            </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">Join Our Early Access Program</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                       Interested in being a pilot partner for one of our EdTech solutions? Contact us to learn more.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">Request a Demo</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
