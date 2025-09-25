
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, MessageSquare, Bot } from "lucide-react";
import { ChatComponent } from '@/components/chat/chat-component';
import { answerQuestion } from '@/ai/flows/ai-powered-faq';
import { useSettingsData } from "@/hooks/use-data-hooks";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, isClient } = useSettingsData();

    if (!isClient || !settings?.chatWidgetEnabled) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size="lg"
                        className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg"
                        aria-label="Toggle chat"
                    >
                        {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    side="top" 
                    align="end" 
                    className="w-[400px] h-[70vh] p-0 border-0 rounded-2xl shadow-2xl mr-4"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col h-full bg-card rounded-2xl overflow-hidden">
                       <ChatComponent
                            agentName="Aida"
                            agentIcon={Bot}
                            agentDescription="Virtual assistant for Innovative Enterprises"
                            welcomeMessage="Hello! I'm Aida, the virtual assistant for Innovative Enterprises. How can I help you today?"
                            placeholder="Ask about our services or book a meeting..."
                            aiFlow={answerQuestion}
                       />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
