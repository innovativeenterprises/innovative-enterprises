
'use client';

import { ChatComponent } from '@/components/chat/chat-component';
import { answerEcommerceQuery } from '@/ai/flows/ecommerce-agent';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

const categories = [
    "Electronics",
    "Apparel",
    "Home Goods",
    "Books",
    "Sports",
    "Beauty",
];

export default function EcommerceChatPage() {
    const ecommerceQueryFlow = async (input: { [key: string]: any }) => {
        return await answerEcommerceQuery({
            query: input.message,
            availableCategories: categories,
        });
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)] py-16">
            <div className="container mx-auto px-4 relative">
                 <Button asChild variant="outline" className="absolute top-0 left-4 md:left-0">
                    <Link href="/ecommerce" legacyBehavior>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Store
                    </Link>
                </Button>
                 <div className="max-w-3xl mx-auto text-center pt-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Shopping Assistant</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                       Chat with Nova, your personal AI shopper, to find products, ask questions, and get help with your order.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto mt-12">
                   <ChatComponent
                        agentName="Nova"
                        agentIcon={Bot}
                        agentDescription="Your Personal AI Shopping Assistant"
                        welcomeMessage="Hello! I'm Nova, your AI shopping assistant. What can I help you find today? You can ask me about products, categories, or our store policies."
                        placeholder="e.g., 'Do you have running shoes?' or 'What's your return policy?'"
                        aiFlow={ecommerceQueryFlow}
                   />
                </div>
            </div>
        </div>
    );
}
