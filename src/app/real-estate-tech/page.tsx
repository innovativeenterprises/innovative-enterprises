
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Building2, AlertTriangle, GanttChartSquare, ClipboardCheck, Users, Search, DollarSign, Cpu, BarChart } from "lucide-react";
import Link from "next/link";
import { useProductsData } from "@/app/admin/product-table";
import type { Product } from "@/lib/products";

const problems = [
    { title: "Manual Valuation", description: "Property valuation is slow, subjective, and lacks data-driven accuracy." },
    { title: "Inefficient Listings", description: "Agents and buyers waste time with irrelevant property listings and poor lead management." },
    { title: "Complex Paperwork", description: "Generating and managing contracts, deeds, and compliance documents is a major bottleneck." },
];

const ProductCard = ({ product }: { product: Product }) => {
    const iconMap: { [key: string]: React.ElementType } = {
        "AI Property Valuator": BarChart,
        "Smart Listing & Matching": Search,
        "3D Virtual Tour SaaS": Cpu,
        "DocuChain Compliance": ClipboardCheck,
        "SmartLease Manager": DollarSign,
        "InvestiSight AI": GanttChartSquare,
        "FacilityFlow SaaS": Users,
        "PropToken Platform": Check,
        "Tenant Digital Briefcase": ClipboardCheck,
        "EcoBuild Certify": Check,
    };
    const Icon = iconMap[product.name] || Building2;

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
            <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
        </CardFooter>
    </Card>
)};

export default function RealEstateTechPage() {
    const { products } = useProductsData();
    const realEstateProducts = products.filter(p => p.category === "Real Estate Tech");
    
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Building2 className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Real Estate Technology Solutions</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A portfolio of AI-driven SaaS platforms to modernize property valuation, management, and investment for the Gulf region.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">The Industry Challenge</h2>
                <p className="mt-4 text-lg text-muted-foreground">The real estate sector is held back by manual processes.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Upcoming SaaS Platforms</h2>
                <p className="mt-4 text-lg text-muted-foreground">A preview of our dedicated solutions for the real estate industry.</p>
            </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realEstateProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">Join Our Early Access Program</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                       Are you a developer, broker, or landlord? Partner with us to pilot our real estate tech solutions and shape the future of the industry.
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
