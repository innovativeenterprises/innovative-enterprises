
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gift } from 'lucide-react';
import type { GiftCard } from '@/lib/gift-cards.schema';
import { useGiftCardsData } from '@/hooks/use-data-hooks';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function HadeeyaAdminPage() {
    const { data: giftCards } = useGiftCardsData();

    const getStatusBadge = (status: GiftCard['status']) => {
        switch (status) {
            case 'Active': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Active</Badge>;
            case 'Redeemed': return <Badge variant="secondary">Redeemed</Badge>;
            case 'Expired': return <Badge variant="destructive">Expired</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Gift className="h-8 w-8"/> Hadeeya Gift Card Management</h1>
                <p className="text-muted-foreground">Monitor and manage all issued digital gift cards.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Issued Gift Cards</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead className="text-right">Amount (OMR)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date Issued</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {giftCards.map(card => (
                                <TableRow key={card.id}>
                                    <TableCell>
                                        <p className="font-medium">{card.recipientName}</p>
                                        <p className="text-sm text-muted-foreground">{card.recipientEmail}</p>
                                    </TableCell>
                                    <TableCell className="font-mono">{card.code}</TableCell>
                                    <TableCell className="text-right font-mono">{card.amount.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(card.status)}</TableCell>
                                    <TableCell>{format(new Date(card.issueDate), 'PPP')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
