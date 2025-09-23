
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Building2, BarChart, FileText, Search, Home, DollarSign, Package } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/products.schema";

const ProductCard = ({ product }: { product: Product }) => {
    const iconMap: { [key: string]: React.ElementType } = {
        "AI Property Valuator": BarChart,
        "Smart Listing & Matching": Search,
        "DocuChain Compliance": FileText,
        "SmartLease Manager": FileText,
        "PANOSPACE": Home,
        "StairSpace": Home,
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

export default function RealEstateTechClientPage({ initialProducts }: { initialProducts: Product[] }) {
    
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Building2 className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Real Estate Technology Solutions</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A portfolio of AI-driven SaaS platforms designed to automate property valuation, streamline management, and create new investment opportunities.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
