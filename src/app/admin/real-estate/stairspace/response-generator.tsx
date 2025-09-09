
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { generateBookingResponse } from '@/ai/flows/booking-response-generator';

export const ResponseGenerator = ({ request }: { request: BookingRequest }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        setResponse('');
        try {
            const result = await generateBookingResponse({
                listingTitle: request.listingTitle,
                clientName: request.clientName,
                clientMessage: request.message,
            });
            setResponse(result.response);
        } catch (e) {
            toast({ title: "Failed to generate response.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2"><Bot className="h-4 w-4"/> AI Response Assistant</h4>
            <Textarea
                value={response}
                readOnly={!response}
                onChange={(e) => setResponse(e.target.value)}
                rows={8}
                placeholder="Click 'Generate Response' to have the AI draft a reply to the client..."
            />
             <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" onClick={() => {
                    navigator.clipboard.writeText(response);
                    toast({title: "Copied to clipboard!"});
                }} disabled={!response}>Copy</Button>
                <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                    Generate Response
                </Button>
            </div>
        </div>
    )
}
