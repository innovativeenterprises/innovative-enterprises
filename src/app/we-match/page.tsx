
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Gamepad2, Users, Trophy, MapPin } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

export default function WeMatchPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background">
             <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" alt="People collaborating" fill className="object-cover opacity-10" data-ai-hint="people collaborating" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl text-center mx-auto">
             <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Gamepad2 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">We Match - MATCH CUP GAME</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                An immersive Augmented Reality (AR) social game designed to connect people through interactive, real-world challenges and competitions. Discover your city and make new friends along the way.
            </p>
          </div>

          <div className="mt-20 text-center">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">Coming Soon to an App Store Near You!</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                       This project is currently in development. Follow our journey for updates on the official launch.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/contact">Join the Waitlist</Link>
                    </Button>
                </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
