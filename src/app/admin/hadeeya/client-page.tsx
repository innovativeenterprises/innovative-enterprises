
'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GiftCard } from "@/lib/gift-cards.schema";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { useGiftCardsData } from "@/hooks/use-data-hooks";

export default function HadeeyaAdminClientPage({ initialGiftCards }: { initialGiftCards: GiftCard[] }) {
    const { data: giftCards, setData: setGiftCards, isClient } = useGiftCardsData(initialGiftCards);
    const { toast } = useToast();

    const getStatusBadge = (status: GiftCard['status']) => {
        switch (status) {
            case 'Active': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Active</Badge>;
            case 'Redeemed': return <Badge variant="secondary">Redeemed</Badge>;
            case 'Expired': return <Badge variant="destructive">Expired</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Hadeeya Gift Card Management</CardTitle>
                    <CardDescription>Monitor all issued digital gift cards.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Code</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isClient ? (
                                <TableRow><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                            ) : giftCards.map(card => (
                                <TableRow key={card.id}>
                                    <TableCell>
                                        <p className="font-medium">{card.recipientName}</p>
                                        <p className="text-sm text-muted-foreground">{card.recipientEmail}</p>
                                    </TableCell>
                                    <TableCell className="font-mono">OMR {card.amount.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(card.status)}</TableCell>
                                    <TableCell>{format(new Date(card.issueDate), 'PPP')}</TableCell>
                                    <TableCell className="font-mono">{card.code}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
