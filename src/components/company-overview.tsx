
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CompanyOverview() {
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
            <div className="flex items-center gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg">
                  <Link href="#services">
                    Explore Our Services <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full shadow-lg">
                    <Link href="#testimonials">
                        Our Clients
                    </Link>
                </Button>
            </div>
            <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                    <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="Client 1" width={40} height={40} className="rounded-full border-2 border-background" data-ai-hint="person portrait" />
                    <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36" alt="Client 2" width={40} height={40} className="rounded-full border-2 border-background" data-ai-hint="person portrait" />
                    <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" alt="Client 3" width={40} height={40} className="rounded-full border-2 border-background" data-ai-hint="person portrait" />
                </div>
                <div>
                    <div className="flex text-yellow-400">
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                    </div>
                    <p className="text-sm text-muted-foreground">Trusted by 100+ organizations</p>
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
                <p className="text-sm text-muted-foreground max-w-xs">To drive innovation and digital excellence in Oman and beyond, fostering local talent and delivering client success.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
