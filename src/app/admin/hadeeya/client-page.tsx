
'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { GiftCard } from "@/lib/gift-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const getStatusBadge = (status: GiftCard['status']) => {
    switch (status) {
        case 'Active': return <Badge variant="default" className="bg-green-500/20 text-green-700">Active</Badge>;
        case 'Redeemed': return <Badge variant="secondary">Redeemed</Badge>;
        case 'Expired': return <Badge variant="destructive">Expired</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function HadeeyaAdminPageClient({ initialGiftCards }: { initialGiftCards: GiftCard[] }) {
    const [giftCards, setGiftCards] = useState<GiftCard[]>(initialGiftCards);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Hadeeya Gift Card Management</h1>
                <p className="text-muted-foreground">Monitor and manage all generated digital gift cards.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Issued Gift Cards</CardTitle>
                    <CardDescription>A log of all gift cards created through the Hadeeya platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead className="text-right">Amount (OMR)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Issue Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isClient ? (
                                <TableRow>
                                    <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                                </TableRow>
                            ) : giftCards.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No gift cards have been issued yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                giftCards.map(card => (
                                    <TableRow key={card.id}>
                                        <TableCell className="font-mono">{card.code}</TableCell>
                                        <TableCell>
                                            <p className="font-medium">{card.recipientName}</p>
                                            <p className="text-sm text-muted-foreground">{card.recipientEmail}</p>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{card.amount.toFixed(2)}</TableCell>
                                        <TableCell>{getStatusBadge(card.status)}</TableCell>
                                        <TableCell>{format(new Date(card.issueDate), "PPP")}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
