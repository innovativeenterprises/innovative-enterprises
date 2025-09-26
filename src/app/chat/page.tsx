

'use client';

import { ChatComponent } from '@/components/chat/chat-component';
import { answerQuestion } from '@/ai/flows/ai-powered-faq';
import { Bot, MessageSquare } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useSettings } from '@/components/layout/settings-provider';

export default function FaqPage() {
    const { settings } = useSettings();

    // Render a loading state or nothing if settings aren't loaded yet
    if (!settings) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)] py-16">
            <div className="container mx-auto px-4">
                 <div className="max-w-3xl mx-auto text-center">
                     <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <MessageSquare className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Frequently Asked Questions</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Have questions? Our AI-powered assistant is here to help. Ask anything about our services, products, or our unique value as an Omani SME.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto mt-12">
                   <ChatComponent
                        agentName="Aida"
                        agentIcon={Bot}
                        agentDescription="Virtual assistant for Innovative Enterprises"
                        welcomeMessage="Hello! I'm Aida, the virtual assistant for Innovative Enterprises. How can I help you today?"
                        placeholder="Ask about our services or book a meeting..."
                        aiFlow={answerQuestion}
                   />
                </div>
            </div>
        </div>
    );
}
