
'use client';

import { useState, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Service, initialServices } from "@/lib/services";

export default function ServiceCatalog() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    try {
      const storedServices = localStorage.getItem('services_status');
      const enabledServices = storedServices 
        ? JSON.parse(storedServices).filter((s: Service) => s.enabled)
        : initialServices.filter(s => s.enabled);
      
      // If no services are enabled in storage, show the default enabled ones.
      if (enabledServices.length > 0) {
        setServices(enabledServices);
      } else {
        // Fallback to default if storage exists but all are disabled.
        const stored = JSON.parse(storedServices || '[]');
        if (stored.length > 0) {
            setServices([]);
        } else {
            setServices(initialServices.filter(s => s.enabled));
        }
      }
    } catch (error) {
      console.error("Failed to load services from localStorage", error);
      setServices(initialServices.filter(s => s.enabled));
    }
  }, []);

  if (services.length === 0) {
    return null; // Or a placeholder message
  }
  
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Core Services</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We provide a wide range of services designed to help you innovate, transform, and achieve your most ambitious business goals.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="bg-card border-none shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <CardHeader>
                <div className="flex items-center gap-4">
                   <div className="bg-primary/10 p-4 rounded-full transition-colors duration-300 group-hover:bg-accent">
                     <service.icon className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-accent-foreground" />
                   </div>
                   <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardDescription className="px-6 pb-6 text-base text-muted-foreground">
                {service.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
