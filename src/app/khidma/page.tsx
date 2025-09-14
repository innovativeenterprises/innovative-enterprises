

'use client';

import KhidmaIcon from '@/components/icons/khidma-icon';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        title: 'For Service Seekers',
        description: 'Post any task, from home repairs to creative design, and receive competitive bids from a network of qualified local professionals.',
        cta: 'Post a Task',
        href: '/submit-work'
    },
    {
        title: 'For Service Providers',
        description: 'Join our network to find new clients, bid on jobs, manage your projects, and grow your business with our powerful AI tools.',
        cta: 'Become a Partner',
        href: '/partner'
    }
];

export default function KhidmaPage() {
    return (
         <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <KhidmaIcon className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">KHIDMA: Your Service Marketplace</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A revolutionary AI-powered mobile application that transforms the traditional service industry. KHIDMA acts as a dynamic marketplace connecting service seekers with qualified providers through an innovative auction and tender system.
                    </p>
                </div>

                 <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-2 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.title} className="text-center">
                            <CardHeader>
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="justify-center">
                                <Button asChild>
                                    <Link href={feature.href}>{feature.cta} <ArrowRight className="ml-2 h-4 w-4"/></Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
