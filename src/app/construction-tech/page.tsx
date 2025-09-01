
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, HardHat, AlertTriangle, GanttChartSquare, ClipboardCheck, Users, Search, DollarSign, Cpu, BarChart, Calculator, Package } from "lucide-react";
import Link from "next/link";
import { useProductsData } from "@/app/admin/product-table";
import type { Product } from "@/lib/products";
import { Skeleton } from '@/components/ui/skeleton';

const ProductCard = ({ product }: { product: Product }) => {
    const iconMap: { [key: string]: React.ElementType } = {
        "Smart PM SaaS": GanttChartSquare,
        "BidWise Estimator": DollarSign,
        "StructurAI BIM": Cpu,
        "SiteGuard Compliance": ClipboardCheck,
        "WorkforceFlow": Users,
        "ProcureChain SaaS": Package,
        "ConstructFin": DollarSign,
        "Digital Twin Ops": Cpu,
        "AeroSite AI (DaaS)": Cpu,
        "ClientView Portal": Search,
        "BoQ Generator": Calculator,
    };
    const Icon = iconMap[product.name] || HardHat;

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

const ProductGridSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col h-full">
                <CardHeader className="flex-row items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        ))}
    </div>
);

export default function ConstructionTechPage() {
    const { products } = useProductsData();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const contechProducts = products.filter(p => p.category === "Construction Tech" && p.enabled);
    
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <HardHat className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Construction Technology Solutions</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A suite of AI-powered SaaS platforms designed to automate, optimize, and revolutionize the construction industry in the Gulf and beyond.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
            {isClient ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contechProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            ) : <ProductGridSkeleton />}
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">Get Early Access</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                       Interested in being a pilot partner for one of our construction tech solutions? Contact us to learn more.
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
