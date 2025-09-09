
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Building2, Store, Tag, MapPin, HandCoins } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const featuredSpaces = [
    {
        id: 1,
        title: "Under-Stairs Pop-up at Muscat Grand Mall",
        location: "Muscat Grand Mall, Oman",
        price: "OMR 25 / day",
        imageUrl: "https://images.unsplash.com/photo-1582545398978-4983a4dff2dc?q=80&w=1920&auto=format&fit=crop",
        aiHint: "modern staircase retail",
        tags: ["High Foot Traffic", "Retail", "Pop-up"],
    },
    {
        id: 2,
        title: "Cozy Nook for Artisan Crafts",
        location: "Al-Khuwair, Muscat",
        price: "OMR 15 / day",
        imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1920&auto=format&fit=crop",
        aiHint: "artisan shop interior",
        tags: ["Boutique", "Crafts", "Community"],
    },
    {
        id: 3,
        title: "Secure Micro-Storage Space",
        location: "Ruwi, Muscat",
        price: "OMR 50 / month",
        imageUrl: "https://images.unsplash.com/photo-1599299484364-6723c31e9a38?q=80&w=1920&auto=format&fit=crop",
        aiHint: "secure storage space",
        tags: ["Storage", "Secure", "24/7 Access"],
    },
];

export default function StairspacePage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Store className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">StairSpace: Your Micro-Retail Revolution</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Unlock the hidden potential of underutilized spaces. StairSpace is a marketplace that connects property owners with entrepreneurs looking for affordable, flexible, and high-visibility micro-retail and storage spots.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Featured Spaces</h2>
                <p className="mt-4 text-lg text-muted-foreground">Discover unique opportunities available right now.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredSpaces.map((space) => (
                     <Card key={space.id} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                        <CardHeader className="p-0">
                            <div className="relative h-48 w-full">
                                <Image src={space.imageUrl} alt={space.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={space.aiHint} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {space.tags.map(tag => <div key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</div>)}
                            </div>
                            <CardTitle className="text-lg">{space.title}</CardTitle>
                            <CardDescription className="text-sm flex items-center gap-1 mt-1"><MapPin className="h-4 w-4"/> {space.location}</CardDescription>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                            <p className="text-lg font-bold text-primary">{space.price}</p>
                            <Button>Book Now</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-4xl mx-auto mt-20 grid md:grid-cols-2 gap-8">
             <Card className="bg-accent/10 border-accent text-center">
                <CardHeader className="items-center">
                    <div className="bg-accent p-3 rounded-full">
                        <HandCoins className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl text-accent pt-2">For Property Owners</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-accent-foreground/80">
                       Have an empty space under a staircase, in a lobby, or a wide corridor? Turn your unused liability into a revenue-generating asset.
                    </p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">List Your Space <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card className="bg-muted/50 text-center">
                <CardHeader className="items-center">
                    <div className="bg-primary/20 p-3 rounded-full">
                        <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl pt-2">For Entrepreneurs</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">
                       Launch your pop-up shop, test a new product, or secure convenient micro-storage without the cost of a full retail lease.
                    </p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" variant="secondary">
                        <Link href="#">Browse All Spaces <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
