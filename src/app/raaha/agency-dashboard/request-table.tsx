
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { HireRequest } from "@/lib/raaha-requests";
import { Badge } from "@/components/ui/badge";
import { store } from "@/lib/global-store";
import { formatDistanceToNow } from 'date-fns';

export const useRequestsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        requests: data.raahaRequests,
        setRequests: (updater: (requests: HireRequest[]) => HireRequest[]) => {
            const currentRequests = store.get().raahaRequests;
            const newRequests = updater(currentRequests);
            store.set(state => ({ ...state, raahaRequests: newRequests }));
        }
    };
};

export function RequestTable() { 
    const { requests, setRequests } = useRequestsData();
    const { toast } = useToast();

    const handleStatusChange = (requestId: string, newStatus: HireRequest['status']) => {
        setRequests(prev => prev.map(req => 
            req.id === requestId ? { ...req, status: newStatus } : req
        ));
        toast({ title: "Status Updated", description: `Request ${requestId} has been updated to "${newStatus}".` });
    };

    const getStatusBadge = (status: HireRequest['status']) => {
        switch (status) {
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">Pending</Badge>;
            case 'Contacted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700">Contacted</Badge>;
            case 'Interviewing': return <Badge variant="secondary" className="bg-purple-500/20 text-purple-700">Interviewing</Badge>;
            case 'Hired': return <Badge variant="default" className="bg-green-500/20 text-green-700">Hired</Badge>;
            case 'Closed': return <Badge variant="destructive" className="bg-red-500/20 text-red-700">Closed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Client Hire Requests</CardTitle>
                <CardDescription>Manage incoming requests from potential clients.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Client Details</TableHead>
                            <TableHead>Requested</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.workerName}</TableCell>
                                <TableCell>
                                    <div>{req.clientName}</div>
                                    <div className="text-sm text-muted-foreground">{req.clientContact}</div>
                                </TableCell>
                                <TableCell>{formatDistanceToNow(new Date(req.requestDate), { addSuffix: true })}</TableCell>
                                <TableCell>
                                     <Select onValueChange={(value: HireRequest['status']) => handleStatusChange(req.id, value)} defaultValue={req.status}>
                                        <SelectTrigger className="w-[180px]">
                                             <div className="flex items-center gap-2">
                                                {getStatusBadge(req.status)}
                                                <span className="sr-only">{req.status}</span>
                                             </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Contacted">Contacted</SelectItem>
                                            <SelectItem value="Interviewing">Interviewing</SelectItem>
                                            <SelectItem value="Hired">Hired</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
