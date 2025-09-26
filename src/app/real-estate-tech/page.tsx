
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Building, BarChart, FileText, Home, Search, Tv, Layers, HandCoins, User } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/products.schema";
import { useProductsData } from "@/hooks/use-data-hooks";

const ProductCard = ({ product }: { product: Product }) => {
    const iconMap: { [key: string]: React.ElementType } = {
        "AI Property Valuator": BarChart,
        "Smart Listing & Matching": Search,
        "3D Virtual Tour SaaS": Tv,
        "DocuChain Compliance": FileText,
        "SmartLease Manager": Home,
        "InvestiSight AI": BarChart,
        "FacilityFlow SaaS": Building,
        "PropToken Platform": Layers,
        "Tenant Digital Briefcase": User,
        "EcoBuild Certify": FileText,
        "PANOSPACE": Tv,
        "StairSpace": HandCoins,
    };
    const Icon = iconMap[product.name as keyof typeof iconMap] || Building;

    const href = product.href || '#';

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
                        <Link href={href}>Use Tool</Link>
                    </Button>
                ) : (
                    <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default function RealEstateTechPage() {
    const { data: products } = useProductsData();
    const enabledProducts = products.filter(p => p.category === 'Real Estate Tech' && p.enabled);

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Building className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Real Estate Technology</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A suite of automated SaaS platforms designed to revolutionize property valuation, management, and investment in the Gulf and beyond.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto mt-20">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enabledProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-20 text-center">
                    <Card className="bg-accent/10 border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl text-accent">Partner with Us</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                               Are you a real estate agency, developer, or investor? Contact us to learn how our technology can benefit your business.
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
