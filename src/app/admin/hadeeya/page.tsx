
'use client';

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GiftCard } from "@/lib/gift-cards.schema";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGiftCardsData } from "@/hooks/use-global-store-data";

export default function HadeeyaAdminPage() {
    const { giftCards, setGiftCards, isClient } = useGiftCardsData();
    const { toast } = useToast();

    const handleStatusChange = (id: string, status: GiftCard['status']) => {
        setGiftCards(prev => prev.map(gc => gc.id === id ? { ...gc, status } : gc));
        toast({ title: 'Status Updated', description: `Card ${id} has been set to ${status}.` });
    };

    const getStatusBadge = (status: GiftCard['status']) => {
        switch (status) {
            case "Active": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Active</Badge>;
            case "Redeemed": return <Badge variant="secondary">Redeemed</Badge>;
            case "Expired": return <Badge variant="destructive">Expired</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Hadeeya Gift Cards</h1>
                <p className="text-muted-foreground">
                    Monitor and manage all issued digital gift cards.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Issued Gift Cards</CardTitle>
                    <CardDescription>An overview of all gift cards created on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Recipient</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isClient ? (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center"><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                            ) : giftCards.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No gift cards have been issued yet.</TableCell></TableRow>
                            ) : (
                                giftCards.map(card => (
                                    <TableRow key={card.id}>
                                        <TableCell>
                                            <p className="font-medium">{card.recipientName}</p>
                                            <p className="text-sm text-muted-foreground">{card.recipientEmail}</p>
                                        </TableCell>
                                        <TableCell>{card.senderName}</TableCell>
                                        <TableCell className="font-mono">{card.code}</TableCell>
                                        <TableCell>OMR {card.amount.toFixed(2)}</TableCell>
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

