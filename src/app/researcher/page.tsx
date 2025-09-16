'use client';

import { useSettingsData } from '@/hooks/use-global-store-data';
import { ChatComponent } from '@/components/chat/chat-component';
import { scrapeAndSummarize } from '@/ai/flows/web-scraper-agent';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Rami - AI Research Agent",
  description: "Chat with Rami, your AI-powered research assistant. Scrape data from any URL or perform a web search to gather and summarize information quickly.",
};

export default function ResearcherPage() {
    const { settings } = useSettingsData();

    // The AI flow can handle a generic query, which we'll get from the chat component's 'message' property.
    // The flow itself will determine if the source is a URL or a search term.
    const researchFlow = async (input: { [key: string]: any }) => {
        const source = input.message;
        const isUrl = source.startsWith('http://') || source.startsWith('https://');
        
        const result = await scrapeAndSummarize({ source, isUrl });

        // We need to transform the structured output of the scraper into a single string for the chat component.
        let content = `**${result.title}**\n\n${result.summary}`;
        
        if(result.keyPoints && result.keyPoints.length > 0) {
            content += `\n\n**Key Points:**\n` + result.keyPoints.map(p => `- ${p}`).join('\n');
        }

        if(result.extractedLinks && result.extractedLinks.length > 0) {
            content += `\n\n**Extracted Links:**\n` + result.extractedLinks.map(l => `- [${l.text}](${l.url})`).join('\n');
        }

        // Return a response object that the ChatComponent understands.
        return { answer: content };
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Search className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Data Miner</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Chat with Rami, your AI-powered research assistant. Ask him to scrape data from any URL or perform a web search to gather and summarize information quickly.
            </p>
            </div>
            <div className="max-w-3xl mx-auto mt-12 space-y-8">
                 <ChatComponent
                    agentName="Rami"
                    agentIcon={Search}
                    agentDescription="Strategy & Research Agent"
                    welcomeMessage="Hello! I'm Rami. Provide a URL or a search query, and I'll gather and summarize the information for you."
                    placeholder="Enter a URL or search query..."
                    aiFlow={researchFlow}
                    settings={settings}
                />
            </div>
        </div>
        </div>
    );
}
