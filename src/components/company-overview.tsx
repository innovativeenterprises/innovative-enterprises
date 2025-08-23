import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CompanyOverview() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary tracking-tight">
              Pioneering Tomorrow's Technology, Today.
            </h1>
            <p className="text-lg text-foreground/80">
              Innovative Enterprises is a leading Omani SME dedicated to delivering cutting-edge solutions in emerging technology and digital transformation. We empower businesses and government entities to thrive in the digital age.
            </p>
            <div className="space-y-2 rounded-lg border border-border bg-background p-4">
                <h3 className="font-semibold text-primary">Our Mission & Values</h3>
                <p className="text-muted-foreground">
                    Our mission is to drive innovation and digital excellence in Oman and beyond. We are committed to integrity, client success, and fostering local talent, providing unique value as an Omani SME partner.
                </p>
            </div>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="#services">
                Explore Our Services <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="relative h-80 md:h-[500px] w-full rounded-lg overflow-hidden shadow-2xl group">
             <Image
              src="https://placehold.co/600x600.png"
              alt="Innovative office space"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              data-ai-hint="technology office"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
