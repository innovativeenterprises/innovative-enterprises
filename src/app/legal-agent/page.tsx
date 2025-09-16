'use client';

import { useSettingsData } from '@/hooks/use-global-store-data';
import { ChatComponent } from '@/components/chat/chat-component';
import { legalAgentRouter } from '@/ai/flows/legal-agent';
import { Scale } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Admin & Legal Assistant",
  description: "Your AI-powered legal co-pilot. Ask general legal questions, request a new document draft (like an NDA), or get an analysis of an existing document.",
};

export default function LegalAgentPage() {
    const { settings } = useSettingsData();

    // This is the new router flow that will decide which sub-task to perform.
    const agentFlow = async (input: { [key: string]: any }) => {
        // The chat component sends a 'message' property. We map it to 'query'.
        return await legalAgentRouter({ query: input.message });
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Scale className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Admin & Legal Assistant</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Your AI-powered legal co-pilot. Ask general legal questions, request a new document draft (like an NDA), or get an analysis of an existing document by uploading it or providing a web link.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto mt-12">
                   <ChatComponent
                        agentName="Aida"
                        agentIcon={Scale}
                        agentDescription="AI Legal Assistant"
                        welcomeMessage="Hello! I'm Aida, your AI Legal Assistant. How can I help you today? You can ask me to draft a new NDA, analyze an existing contract, or answer a general legal question."
                        placeholder="e.g., 'Draft an NDA for me' or 'Analyze the terms at https://example.com/terms'"
                        aiFlow={agentFlow}
                        settings={settings}
                   />
                </div>
            </div>
        </div>
    );
}
