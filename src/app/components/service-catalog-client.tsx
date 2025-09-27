
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { useMemo } from 'react';
import type { Service } from "@/lib/services.schema";
import * as Icons from 'lucide-react';
import { useServicesData } from "@/hooks/use-data-hooks";

const ServiceCard = ({ service }: { service: Service }) => {
    const Icon = (Icons as any)[service.icon] || Icons.Briefcase;
    return (
        <Card key={service.title} className="bg-card border-none shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group h-full">
        <CardHeader>
            <div className="flex items-center gap-4">
           <div className="bg-primary/10 p-4 rounded-full transition-colors duration-300 group-hover:bg-accent">
             <Icon className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-accent-foreground" />
           </div>
           <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-base text-muted-foreground">
                {service.description}
            </CardDescription>
        </CardContent>
        </Card>
    );
};

export default function ServiceCatalogClient() {
  const { data: services } = useServicesData();
  const enabledServices = (services || []).filter(s => s.enabled);
  
  const servicesByCategory = useMemo(() => enabledServices.reduce((acc, service) => {
    const category = service.category || 'Other Services';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>), [enabledServices]);

  const categoryOrder = [
    "Digital Transformations",
    "Data Analytics",
    "AI Powered & Automation",
    "Business Tech Solutions",
    "Essential Business Services"
  ];
  
  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Core Services</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We provide a wide range of services designed to help you innovate, transform, and achieve your most ambitious business goals.
          </p>
        </div>

        <div className="space-y-16">
            {categoryOrder.map(category => {
                const categoryServices = servicesByCategory[category] || [];
                if (categoryServices.length === 0) return null;
                const CategoryIcon = (Icons as any)[categoryServices[0]?.icon] || Icons.GitBranch;
                return (
                    <div key={category}>
                        <h3 className="text-2xl md:text-3xl font-bold text-center text-primary/80 mb-8 flex items-center justify-center gap-3">
                            <CategoryIcon /> {category}
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryServices.map((service) => (
                            service.href ? (
                                <Link key={service.title} href={service.href} className="flex">
                                    <ServiceCard service={service} />
                                </Link>
                            ) : (
                                <ServiceCard key={service.title} service={service} />
                            )
                        ))}
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    </section>
  );
}
