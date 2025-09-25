
'use client';

import { ChatComponent } from "@/components/chat/chat-component";
import { BarChart, BrainCircuit } from 'lucide-react';
import { analyzeSalesData } from '@/ai/flows/pos-agent';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type DailySales } from '@/lib/pos-data.schema';
import { useGlobalStore } from '@/hooks/use-data-hooks';

export function SalesAnalyticsChat({ dailySales }: { dailySales: DailySales }) {
    const settings = useGlobalStore(s => s.settings);

    const salesAnalyticsFlow = async (input: { [key: string]: any }) => {
        return await analyzeSalesData({
            query: input.message,
            transactions: dailySales,
        });
    };

    return (
        <DialogContent className="w-[500px] h-[80vh] p-0 border-0 flex flex-col">
            <DialogHeader className="p-4 border-b">
                <DialogTitle className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary"/> Sales Analysis AI</DialogTitle>
                <DialogDescription>Ask questions about today's sales data.</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
                 <ChatComponent
                    agentName="Dana"
                    agentIcon={BarChart}
                    agentDescription="Your AI Data Analyst"
                    welcomeMessage="Hello! I'm Dana. I have access to today's sales data. What would you like to know?"
                    placeholder="e.g., 'What was our total revenue?' or 'Which item sold the most?'"
                    aiFlow={salesAnalyticsFlow}
                />
            </div>
        </DialogContent>
    );
}
