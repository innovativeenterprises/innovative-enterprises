

'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import OverviewAvatars from '@/components/overview-avatars';
import { useClientsData } from '@/hooks/use-global-store-data';


export default function CompanyOverview() {
  const { clients } = useClientsData();

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
                  <a href="#services">
                    Explore Our Services <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full shadow-lg w-full sm:w-auto">
                    <Link href="/client-testimonials">
                        Our Clients
                    </Link>
                </Button>
            </div>
            <div className="flex items-center gap-4 pt-4">
                <OverviewAvatars clients={clients} />
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

  