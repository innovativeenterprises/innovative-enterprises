
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGiftCardsData } from '@/hooks/use-global-store-data';
import type { GiftCard } from '@/lib/gift-cards';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const getStatusBadge = (status: GiftCard['status']) => {
    switch (status) {
        case 'Active': return <Badge variant="default" className="bg-green-500/20 text-green-700">Active</Badge>;
        case 'Redeemed': return <Badge variant="secondary">Redeemed</Badge>;
        case 'Expired': return <Badge variant="outline">Expired</Badge>;
    }
};

export default function HadeeyaAdminPage() {
    const { giftCards, isClient } = useGiftCardsData();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Hadeeya Gift Card Management</h1>
                <p className="text-muted-foreground">
                    Monitor and manage all generated digital gift cards.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Generated Gift Cards</CardTitle>
                    <CardDescription>An overview of all gift cards created on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Card Code</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Amount (OMR)</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isClient ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                giftCards.map(card => (
                                    <TableRow key={card.id}>
                                        <TableCell className="font-mono">{card.code}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{card.recipientName}</div>
                                            <div className="text-sm text-muted-foreground">{card.recipientEmail}</div>
                                        </TableCell>
                                        <TableCell>OMR {card.amount.toFixed(2)}</TableCell>
                                        <TableCell>{format(new Date(card.issueDate), 'PPP')}</TableCell>
                                        <TableCell>{getStatusBadge(card.status)}</TableCell>
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

    