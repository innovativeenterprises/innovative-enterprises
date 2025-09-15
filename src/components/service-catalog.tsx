import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type Service } from "@/lib/services";
import Link from "next/link";
import { GitBranch } from "lucide-react";

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

export default function ServiceCatalog({ services: managedServices }: { services: Service[] }) {

  const enabledServices = managedServices.filter(s => s.enabled);
  
  const servicesByCategory = enabledServices.reduce((acc, service) => {
    const category = service.category || 'Other Services';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

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
