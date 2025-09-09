
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Opportunity } from "@/lib/opportunities";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useOpportunitiesData } from "@/hooks/use-global-store-data";
import { Skeleton } from "../ui/skeleton";
import { AddEditOpportunityDialog, type OpportunityValues } from "./opportunity-form-dialog";

export default function OpportunityTable({
    opportunities,
    setOpportunities,
}: {
    opportunities: Opportunity[],
    setOpportunities: (updater: (opportunities: Opportunity[]) => void) => void,
}) {
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const { isClient } = useOpportunitiesData();
    
    const handleOpenDialog = (opp?: Opportunity) => {
        setSelectedOpp(opp);
        setIsDialogOpen(true);
    }

    const handleSave = (values: OpportunityValues, id?: string) => {
        if (id) {
            // Update
            setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, ...values } : opp));
            toast({ title: "Opportunity updated successfully." });
        } else {
            // Create
            const newOpp: Opportunity = {
                ...values,
                id: `opp_${values.title.substring(0, 10).replace(/\s+/g, '_')}_${Date.now()}`,
                iconName: 'Trophy', // default icon for new opps
                badgeVariant: 'outline',
            };
            setOpportunities(prev => [newOpp, ...prev]);
            toast({ title: "Opportunity added successfully." });
        }
    };

    const handleDelete = (id: string) => {
        setOpportunities(prev => prev.filter(opp => opp.id !== id));
        toast({ title: "Opportunity removed.", variant: "destructive" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Open": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Open</Badge>;
            case "In Progress": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">In Progress</Badge>;
            case "Closed": return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Closed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Opportunity Management</CardTitle>
                    <CardDescription>Manage open projects, tasks, and competitions.</CardDescription>
                </div>
                 <Button onClick={() => handleOpenDialog()}><PlusCircle /> Add Opportunity</Button>
            </CardHeader>
            <CardContent>
                <AddEditOpportunityDialog 
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    opportunity={selectedOpp}
                    onSave={handleSave}
                >
                    <div />
                </AddEditOpportunityDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={5}>
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            opportunities.map(opp => (
                                <TableRow key={opp.id} onClick={() => handleOpenDialog(opp)} className="cursor-pointer">
                                    <TableCell className="font-medium">{opp.title}</TableCell>
                                    <TableCell>{opp.type}</TableCell>
                                    <TableCell>{opp.deadline}</TableCell>
                                    <TableCell>{getStatusBadge(opp.status)}</TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this opportunity.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(opp.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
