
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bot, X, MessageSquare } from "lucide-react";
import FaqChat from "@/app/faq/faq-chat";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

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
                       <FaqChat />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
