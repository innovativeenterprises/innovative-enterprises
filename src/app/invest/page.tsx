

import { Download, TrendingUp, Users, Target, Building2, Lightbulb, PackageCheck } from "lucide-react";
import InvestForm from "./invest-form";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CompanyProfileDownloader from "./company-profile-downloader";
import { getProducts } from "@/lib/firestore";
import type { Product } from "@/lib/products.schema";
import Link from "next/link";
import type { Metadata } from 'next';
import InvestorTable from "../admin/investor-table";
import { getInvestors } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Invest With Us | Innovative Enterprises",
  description: "Explore investment opportunities in our portfolio of 80+ AI-driven technology products and join our journey of innovation.",
};


const investmentReasons = [
    {
        icon: Target,
        title: "Strategic Market Position",
        description: "As a leading Omani SME, we have a unique advantage in the local market with strong government and corporate partnerships."
    },
    {
        icon: TrendingUp,
        title: "Focus on Emerging Tech",
        description: "Our portfolio is centered on high-growth sectors like AI, Cloud Computing, and Cybersecurity, positioning us for future success."
    },
    {
        icon: Users,
        title: "Experienced Leadership",
        description: "Our team consists of seasoned professionals with a proven track record of delivering innovative projects and driving growth."
    }
];


const ProjectCard = ({ product }: { product: Product }) => {
    const getStatusColor = () => {
        switch (product.stage) {
            case 'Live & Operating': return 'bg-green-500 hover:bg-green-600';
            case 'In Development': return 'bg-blue-500 hover:bg-blue-600';
            case 'Prototyping': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Research Phase': return 'bg-purple-500 hover:bg-purple-600';
            case 'Concept Phase': return 'bg-gray-500 hover:bg-gray-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    }
    const content = (
        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                     <Badge variant="default" className={`${getStatusColor()} text-white`}>{product.stage}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
        </Card>
    );

    return product.href ? <Link href={product.href} className="flex">{content}</Link> : content;
}

export default async function InvestPage() {
  const [allProducts] = await Promise.all([
      getProducts(),
  ]);
  const liveProducts = allProducts.filter(p => p.stage === 'Live & Operating').slice(0, 5);
  const devProducts = allProducts.filter(p => p.stage === 'In Development' || p.stage === 'Testing Phase').slice(0, 5);
  const futureProducts = allProducts.filter(p => p.stage === 'Research Phase' || p.stage === 'Idea Phase').slice(0, 5);


  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Invest With Us</h1>
          <div className="mt-4 text-lg text-muted-foreground">
            Explore investment opportunities and be part of our innovation journey. We are seeking strategic investors to help us scale our impact.
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-16 space-y-20">
            <div>
                 <h2 className="text-3xl font-bold text-center text-primary mb-10">Why Invest in INNOVATIVE ENTERPRISES?</h2>
                 <div className="grid md:grid-cols-3 gap-8">
                     {investmentReasons.map((reason) => (
                        <Card key={reason.title} className="text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                             <CardHeader className="items-center">
                                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-accent transition-colors">
                                    <reason.icon className="w-8 h-8 text-primary group-hover:text-accent-foreground" />
                                </div>
                             </CardHeader>
                             <CardContent className="space-y-2">
                                <CardTitle className="text-xl">{reason.title}</CardTitle>
                                <CardDescription>{reason.description}</CardDescription>
                             </CardContent>
                        </Card>
                     ))}
                 </div>
            </div>
            
             <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Our Network of Investors & Funders</h2>
                <InvestorTable />
            </div>

            {liveProducts.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                        <PackageCheck className="w-8 h-8" /> Live & Operating Platforms
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveProducts.map(p => <ProjectCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}
            
            {devProducts.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                        <PackageCheck className="w-8 h-8" /> Platforms in Development
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devProducts.map(p => <ProjectCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}
            
            {futureProducts.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                        <Lightbulb className="w-8 h-8" /> Future Concepts
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {futureProducts.map(p => <ProjectCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}


            <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Pitch Decks & Downloads</h2>
                <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CompanyProfileDownloader />
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-company.pdf" download>
                            <Download className="mr-2 h-5 w-5" /> Company Pitch Deck
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-panospace.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> PANOSPACE Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-ameen.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> Ameen Project
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-appi.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> APPI Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-khidma.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> KHIDMA Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-vmall.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> VMALL Project
                        </a>
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Get in Touch</h2>
                <InvestForm />
            </div>
        </div>
      </div>
    </div>
  );
}
