import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "Scalable and secure cloud infrastructure solutions to power your business.",
  },
  {
    icon: Bot,
    title: "Artificial Intelligence",
    description: "Leverage AI to automate processes, gain insights, and create intelligent products.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Protect your digital assets with our comprehensive cybersecurity services.",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    description: "Build powerful online stores and digital marketplaces with our expertise.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Enhance your online presence and reach your target audience effectively.",
  },
  {
    icon: BarChart,
    title: "Data Analytics",
    description: "Turn your data into actionable insights with our advanced analytics capabilities.",
  }
];

export default function ServiceCatalog() {
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