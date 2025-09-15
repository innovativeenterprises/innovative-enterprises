import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { Client, Testimonial } from '@/lib/clients';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import imageData from '@/app/lib/placeholder-images.json';

export default function ClientTestimonials({ 
    clients, 
    testimonials, 
}: { 
    clients: Client[], 
    testimonials: Testimonial[] 
}) {

  const { testimonialAvatars } = imageData;

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
          {clients.map((client) => (
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
            {testimonials.map((testimonial) => {
                    const avatarData = (testimonialAvatars as Record<string, {src: string, alt: string}>)[testimonial.avatarId];
                    return (
                        <Card key={testimonial.id} className="bg-card">
                            <CardContent className="p-6">
                                <blockquote className="border-l-4 border-accent pl-4 italic text-foreground/80">
                                {renderQuote(testimonial.quote)}
                                </blockquote>
                                <div className="flex items-center gap-4 mt-6">
                                <Avatar>
                                    {avatarData && <AvatarImage src={avatarData.src} alt={avatarData.alt} />}
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
