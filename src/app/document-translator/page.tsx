
'use client';

import { useState, useEffect } from 'react';
import TranslationForm from "./translation-form";
import { Languages, FileText, Banknote, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Pricing, PricingGroup } from '@/lib/pricing';
import { initialPricing } from '@/lib/pricing';

const iconMap: { [key: string]: React.ElementType } = {
    "Legal & Official Documents": ShieldCheck,
    "Medical & Healthcare Documents": FileText,
    "Business & Commercial Documents": Banknote,
    "Educational & Academic Documents": ShieldCheck,
    "Technical & Industrial Documents": FileText,
    "Media & Marketing Documents": Banknote,
    "Financial & Trade Documents": ShieldCheck,
};

const PriceList = () => {
    const [pricing, setPricing] = useState<Pricing[]>(initialPricing);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('translation_pricing');
            if (stored) {
                setPricing(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to parse pricing from localStorage", error);
        }
    }, []);

    const documentTypeGroups = pricing.reduce((acc, item) => {
        const group = item.group;
        if (!acc[group]) {
            acc[group] = {
                group,
                icon: iconMap[group] || FileText,
                items: {}
            };
        }
        acc[group].items[item.type] = item.price;
        return acc;
    }, {} as { [key: string]: PricingGroup });


    return (
    <div className="max-w-4xl mx-auto mt-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Transparent pricing based on document complexity. All prices are per page.
            </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(documentTypeGroups).map(({ group, icon: Icon, items }) => (
                 <Card key={group}>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                             <Icon className="w-6 h-6 text-accent" />
                            <CardTitle className="text-lg">{group}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                           {Object.entries(items).map(([type, price]) => (
                                <li key={type} className="flex justify-between items-center border-b pb-2">
                                    <span className="text-muted-foreground pr-2">{type}</span>
                                    <span className="font-semibold text-primary whitespace-nowrap">OMR {price.toFixed(2)}</span>
                                </li>
                           ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-8 text-center">
             <Card>
                <CardHeader><CardTitle>Additional Services</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p className="flex justify-between"><span>Certified Stamped Copy</span> <span className="font-semibold">OMR 2.50 / page</span></p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Discounts & Minimums</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p className="flex justify-between"><span>10+ Pages</span> <span className="font-semibold text-green-600">10% Discount</span></p>
                    <p className="flex justify-between"><span>Minimum Charge</span> <span className="font-semibold">OMR 3.00</span></p>
                </CardContent>
            </Card>
        </div>
    </div>
    )
}


export default function DocumentTranslatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Languages className="w-10 h-10 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Verified Document Translator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Translate legal, financial, and official documents with high accuracy. This service is managed by Voxi, our AI Translation Agent, ensuring professional results for your business needs.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <TranslationForm />
        </div>
        <PriceList />
      </div>
    </div>
  );
}
