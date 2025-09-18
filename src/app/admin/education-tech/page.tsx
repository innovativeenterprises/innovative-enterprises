
'use client';

import { useProductsData } from "@/hooks/use-global-store-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GraduationCap, ArrowRight, ShieldCheck, Cpu, GanttChartSquare, ClipboardCheck, BarChart, Users } from "lucide-react";
import Link from 'next/link';
import type { Product } from "@/lib/products";

const ProductCard = ({ product }: { product: Product }) => {
    const iconMap: { [key: string]: React.ElementType } = {
        "EduFlow Suite": GanttChartSquare,
        "CognitaLearn": Cpu,
        "Guardian AI": ShieldCheck,
        "CertiTrust": ClipboardCheck,
        "CampusOS": BarChart,
        "AI Scholarship Finder": DollarSign,
        "Teacher Toolkit": Users,
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


export default function EducationTechAdminPage() {
    const { products } = useProductsData();
    const edutechProducts = products.filter(p => p.category === "Education Tech" && p.enabled);
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Education Technology</h1>
            <p className="text-muted-foreground">Manage and monitor all education-focused platforms and tools.</p>
        </div>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {edutechProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    </div>
  );
}

