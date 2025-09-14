

'use client';

import { useSettingsData } from '@/hooks/use-global-store-data';
import { ChatComponent } from '@/components/chat/chat-component';
import { findAndBookCar } from '@/ai/flows/drivesync-agent';
import { Car } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import type { Car as CarType } from '@/lib/cars';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "AI Car Rental Assistant | DriveSync AI",
  description: "Find the perfect rental car by telling our AI assistant what you need. Get personalized recommendations in seconds.",
};

const CarRecommendation = ({ car, reasoning }: { car: CarType, reasoning?: string }) => (
    <Card className="mt-4">
        <CardHeader>
            <CardTitle>{car.make} {car.model}</CardTitle>
            {reasoning && <CardDescription>{reasoning}</CardDescription>}
        </CardHeader>
        <CardContent>
            <div className="relative h-48 w-full rounded-md overflow-hidden">
                <Image src={car.imageUrl} alt={`${car.make} ${car.model}`} fill className="object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <p><strong>Type:</strong> {car.type}</p>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Location:</strong> {car.location}</p>
                <p><strong>Price:</strong> OMR {car.pricePerDay.toFixed(2)}/day</p>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" asChild>
                {/* In a real app, this would go to a detailed booking page */}
                <Link href="#">Book Now</Link>
            </Button>
        </CardFooter>
    </Card>
);

export default function FindACarPage() {
    const { settings } = useSettingsData();

    const driveSyncFlow = async (input: { [key: string]: any }) => {
        const result = await findAndBookCar({ query: input.message });

        let richResponse = result.response;
        
        if (result.recommendedCar) {
            richResponse += `\n\nI recommend the **${result.recommendedCar.make} ${result.recommendedCar.model}**.`;
        }
        if (result.otherSuggestions && result.otherSuggestions.length > 0) {
            richResponse += `\n\nI also found these other options: ${result.otherSuggestions.map(c => `${c.make} ${c.model}`).join(', ')}.`;
        }

        // We can't directly render components in the chat, but we can pass structured data
        // and let the UI decide how to render it. For this prototype, we'll just enrich the text.
        return {
            response: richResponse,
            // recommendedCar: result.recommendedCar // This would be for a more advanced UI
        };
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)] py-16">
            <div className="container mx-auto px-4">
                 <Button asChild variant="outline" className="mb-8">
                    <Link href="/drivesync-ai">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Agency Dashboard
                    </Link>
                </Button>
                 <div className="max-w-3xl mx-auto text-center">
                     <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Car className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Car Rental Assistant</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                       Tell our AI assistant your needs, and it will find the perfect rental car for you from our inventory.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto mt-12">
                   <ChatComponent
                        agentName="DriveSync Assistant"
                        agentIcon={Car}
                        agentDescription="Your AI-powered car rental concierge"
                        welcomeMessage="Hello! I can help you find the perfect rental car. What are you looking for today? For example, 'I need a 4x4 for a weekend trip to the mountains.'"
                        placeholder="e.g., 'I need a cheap sedan for 3 days'"
                        aiFlow={driveSyncFlow}
                        settings={settings}
                   />
                </div>
            </div>
        </div>
    );
}
