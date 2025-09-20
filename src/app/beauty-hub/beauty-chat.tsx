
'use client';

import { ChatComponent } from "@/components/chat/chat-component";
import { Heart } from "lucide-react";
import { useSettingsData } from '@/hooks/use-global-store-data';
import { type BeautyCenter, type BeautyService } from '@/lib/beauty-centers.schema';
import { beautyAgent } from '@/ai/flows/beauty-agent';

export function BeautyChat({ agency, services }: { agency: BeautyCenter, services: BeautyService[] }) {
    const { settings } = useSettingsData();

    const agentFlow = async (input: { [key: string]: any }) => {
        return await beautyAgent({
            query: input.message,
            agency,
            services,
        });
    };

    return (
        <ChatComponent
            agentName={`Ask ${agency.name}`}
            agentIcon={Heart}
            agentDescription="Your personal beauty concierge"
            welcomeMessage={`Hello! I'm Mane, your AI assistant for ${agency.name}. How can I help you find the perfect treatment today?`}
            placeholder="e.g., 'What's best for dry hair?'"
            aiFlow={agentFlow}
            settings={settings}
        />
    );
}
