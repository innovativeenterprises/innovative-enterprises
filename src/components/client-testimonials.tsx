import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const clients = [
    { name: "Oman Government Partner 1", logo: "https://placehold.co/150x60.png", aiHint: "government building" },
    { name: "Oman Government Partner 2", logo: "https://placehold.co/150x60.png", aiHint: "oman flag" },
    { name: "Key Partner 1", logo: "https://placehold.co/150x60.png", aiHint: "corporate logo" },
    { name: "Key Partner 2", logo: "https://placehold.co/150x60.png", aiHint: "tech company" },
    { name: "Key Partner 3", logo: "https://placehold.co/150x60.png", aiHint: "finance building" },
    { name: "Key Partner 4", logo: "https://placehold.co/150x60.png", aiHint: "abstract logo" },
];

const testimonials = [
    {
        quote: "Innovative Enterprises has been a pivotal partner in our digital transformation journey. Their expertise and commitment are unparalleled.",
        author: "Director General",
        company: "Government Entity",
    },
    {
        quote: "The solutions provided by Innovative Enterprises have significantly improved our operational efficiency. Their team is professional and highly skilled.",
        author: "CEO",
        company: "Leading Corporation",
    },
];

export default function ClientTestimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Trusted by Leading Organizations</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are proud to partner with government entities and key industry players.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16">
          {clients.map((client) => (
            <div key={client.name} className="grayscale hover:grayscale-0 transition-all duration-300" title={client.name}>
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
            {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card">
                    <CardContent className="p-6">
                        <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                            {testimonial.quote}
                        </blockquote>
                        <p className="mt-4 font-semibold text-primary">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
