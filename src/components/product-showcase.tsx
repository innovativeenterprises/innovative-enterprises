import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const products = [
  {
    name: 'PanoSpace',
    description: 'An immersive platform for virtual tours and panoramic experiences.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'virtual reality',
  },
  {
    name: 'ameen',
    description: 'A secure digital identity and authentication solution.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'security shield',
  },
  {
    name: 'APPI',
    description: 'An intuitive API management and integration platform.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'api integration',
  },
  {
    name: 'KHIDMAAI',
    description: 'AI-powered customer service and support automation tool.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'chatbot ai',
  },
  {
    name: 'VMALL',
    description: 'A comprehensive virtual mall and e-commerce ecosystem.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'online shopping',
  },
];

export default function ProductShowcase() {
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
          {products.map((product) => (
            <Card key={product.name} className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={product.aiHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline">Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
