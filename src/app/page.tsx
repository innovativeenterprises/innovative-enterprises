
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Star } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAiToolsData, useClientsData, useProductsData, useServicesData, useStaffData, useTestimonialsData } from "@/hooks/use-global-store-data";
import { StageBadge } from '@/components/stage-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import imageData from '@/app/lib/placeholder-images.json';
import type { Service } from "@/lib/services.schema";

const OverviewAvatars = () => {
  const { clients, isClient } = useClientsData();
  
  if (!isClient) {
    return <Skeleton className="h-10 w-24" />;
  }
  
  const overviewClients = clients.slice(0, 3);

  return (
    <div className="flex -space-x-2">
      {overviewClients.map((client) => (
        <Image
          key={client.id}
          src={client.logo}
          alt={client.name}
          width={40}
          height={40}
          className="rounded-full border-2 border-background object-contain bg-white"
          data-ai-hint={client.aiHint}
        />
      ))}
    </div>
  );
}

const CompanyOverview = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Omani SME Leader in Tech
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary tracking-tight">
              Pioneering Tomorrow's Technology, Today.
            </h1>
            <p className="text-lg text-foreground/80 max-w-xl">
              Innovative Enterprises is a leading Omani SME dedicated to delivering cutting-edge solutions in emerging technology and digital transformation. We empower businesses and government entities to thrive in the digital age.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg w-full sm:w-auto">
                  <Link href="#services">
                    Explore Our Services
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full shadow-lg w-full sm:w-auto">
                    <Link href="/client-testimonials">
                        Our Clients
                    </Link>
                </Button>
            </div>
            <div className="flex items-center gap-4 pt-4">
                <OverviewAvatars />
                <div>
                    <div className="flex text-yellow-400">
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div className="text-sm text-muted-foreground">Trusted by 100+ organizations</div>
                </div>
            </div>
          </div>
          <div className="relative h-80 md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group">
             <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Innovative office space"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              data-ai-hint="technology future"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
             <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-md p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-primary">Our Mission</h3>
                <div className="text-sm text-muted-foreground max-w-xs">To drive innovation and digital excellence in Oman and beyond, fostering local talent and delivering client success.</div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ServiceCard = ({ service }: { service: Service }) => (
    <Card key={service.title} className="bg-card border-none shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
           <div className="bg-primary/10 p-4 rounded-full transition-colors duration-300 group-hover:bg-accent">
             <service.icon className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-accent-foreground" />
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

const ServiceCatalog = () => {
  const { services } = useServicesData();
  const enabledServices = services.filter(s => s.enabled);
  
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
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Core Services</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We provide a wide range of services designed to help you innovate, transform, and achieve your most ambitious business goals.
          </p>
        </div>

        <div className="space-y-16">
            {categoryOrder.map(category => (
                servicesByCategory[category] && (
                    <div key={category}>
                        <h3 className="text-2xl md:text-3xl font-bold text-center text-primary/80 mb-8 flex items-center justify-center gap-3">
                            <GitBranch /> {category}
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesByCategory[category].map((service) => (
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
            ))}
        </div>
      </div>
    </section>
  );
}

const ProductShowcase = () => {
  const { products } = useProductsData();
  const enabledProducts = products.filter(p => p.enabled);

  return (
    <section id="products" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Products</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our innovative products designed to solve real-world challenges.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enabledProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <Link href={product.href || `/ecommerce/${product.id}`} className="flex flex-col h-full">
                    <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                        <Image
                        src={product.image!}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={product.aiHint}
                        />
                        {product.stage && <StageBadge stage={product.stage} />}
                    </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                    <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                    <Button variant="outline">Learn More</Button>
                    </CardFooter>
                </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const ClientTestimonials = () => {
  const { clients, isClient: isClientsClient } = useClientsData();
  const { testimonials, isClient: isTestimonialsClient } = useTestimonialsData();
  const isClient = isClientsClient && isTestimonialsClient;
  
  const { testimonialAvatars } = imageData || {};

  const renderQuote = (quote: string) => {
    const parts = quote.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-semibold text-foreground">{part}</strong> : part
    );
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Trusted by Leading Organizations</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are proud to partner with government entities and key industry players.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16">
          {!isClient ? Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-[60px] w-[150px]" />) : clients.map((client) => (
              <div key={client.id} className="grayscale hover:grayscale-0 transition-all duration-300" title={client.name}>
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={150}
                  height={60}
                  className="object-contain"
                  data-ai-hint={client.aiHint}
                />
              </div>
            ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {!isClient ? Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-48 w-full" />) : testimonials.map((testimonial) => {
                    const avatarData = testimonialAvatars && (testimonialAvatars as Record<string, {src: string, alt: string, aiHint: string}>)[testimonial.avatarId];
                    return (
                        <Card key={testimonial.id} className="bg-card">
                            <CardContent className="p-6">
                                <blockquote className="border-l-4 border-accent pl-4 italic text-foreground/80">
                                {renderQuote(testimonial.quote)}
                                </blockquote>
                                <div className="flex items-center gap-4 mt-6">
                                <Avatar>
                                    {avatarData && <AvatarImage src={avatarData.src} alt={avatarData.alt} data-ai-hint={avatarData.aiHint} />}
                                    <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                    <div>
                                        <p className="font-semibold text-primary">{testimonial.author}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
        </div>
      </div>
    </section>
  );
}

const AiToolsCta = () => {
    const { agentCategories, isClient } = useStaffData();
    
    // Dynamically select a few key agents to feature
    const allAgents = agentCategories.flatMap(cat => cat.agents);
    const featuredAgentNames = ["Aida", "Lexi", "Rami", "Sage"];
    const featuredAgents = featuredAgentNames.map(name => allAgents.find(agent => agent.name === name)).filter(Boolean);

    if (!isClient) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">Accelerate with AI</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Leverage our powerful AI tools and agents to streamline your workflows, get instant answers, and automate your business processes.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {featuredAgents.map((agent) => (
                         <Card key={agent!.name} className="text-center group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit transition-colors group-hover:bg-accent">
                                    <agent!.icon className="w-8 h-8 text-primary transition-colors group-hover:text-accent-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardTitle>{agent!.name}</CardTitle>
                                <CardDescription className="mt-2">
                                    {agent!.role}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                    <Link href={agent!.href || '#'}>Use {agent!.name}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default function HomePage() {
  return (
    <>
      <CompanyOverview />
      <ServiceCatalog />
      <ProductShowcase />
      <ClientTestimonials />
      <AiToolsCta />
    </>
  );
}
