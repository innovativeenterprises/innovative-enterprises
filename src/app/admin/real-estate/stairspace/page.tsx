
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Mail, Phone, Calendar as CalendarIcon, GripVertical, CheckCircle, Ticket, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useStairspaceData, useStairspaceRequestsData } from '@/hooks/use-global-store-data';
import { Skeleton } from '@/components/ui/skeleton';
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter, type DragEndEvent, type Active, type Over } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScheduleInterviewDialog, type InterviewValues } from '@/app/raaha/agency-dashboard/request-table';
import { StairspaceListing } from '@/lib/stairspace.schema';
import Image from 'next/image';

const requestStatuses = ['Pending', 'Contacted', 'Booked', 'Confirmed', 'Closed'] as const;

const RequestCard = ({ request }: { request: BookingRequest }) => {
    const { stairspaceListings } = useStairspaceData();
    const listing = stairspaceListings.find(l => l.id === request.listingId);
    
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
        id: request.id,
        data: { type: 'Request', request },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    
    return (
        <div ref={setNodeRef} style={style}>
            <Dialog>
                <DialogTrigger asChild>
                    <Card className="mb-4 group cursor-pointer bg-card hover:bg-muted/80">
                        <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                                <Button variant="ghost" size="icon" {...attributes} {...listeners} onClick={(e) => e.stopPropagation()} className="cursor-grab h-8 w-8 -ml-1">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm leading-tight group-hover:text-primary">{request.listingTitle}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Request from: <strong>{request.clientName}</strong></p>
                                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                        <DialogDescription>
                            Reviewing request for "{request.listingTitle}" from {request.clientName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        {listing && (
                             <div className="space-y-4">
                                <Image src={listing.imageUrl} alt={listing.title} width={300} height={200} className="rounded-lg object-cover" />
                                <h3 className="font-bold">{listing.title}</h3>
                                <p className="text-sm text-muted-foreground">{listing.location}</p>
                             </div>
                        )}
                        <div className="space-y-4">
                            <h4 className="font-semibold">Client Details</h4>
                            <p className="text-sm"><strong>Name:</strong> {request.clientName}</p>
                            <p className="text-sm"><strong>Email:</strong> {request.clientEmail}</p>
                            <p className="text-sm"><strong>Phone:</strong> {request.clientPhone}</p>
                            <div>
                                <h4 className="font-semibold">Message</h4>
                                <p className="text-sm text-muted-foreground italic mt-1 bg-muted p-2 rounded-md">
                                    {request.message || "No message provided."}
                                </p>
                            </div>
                             {request.interviewDate && (
                                <div>
                                    <h4 className="font-semibold">Interview</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Scheduled for: {format(new Date(request.interviewDate), "PPP 'at' p")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const StatusColumn = ({ status, requests }: { status: typeof requestStatuses[number], requests: BookingRequest[] }) => {
    const { setNodeRef } = useSortable({
        id: status,
        data: { type: 'Column', status },
    });

    return (
        <div ref={setNodeRef} className="flex-shrink-0 w-[300px]">
            <Card className="bg-muted/50 h-full flex flex-col">
                <CardHeader className="p-3">
                    <CardTitle className="text-base text-center">{status} ({requests.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-2 min-h-[200px] flex-grow overflow-y-auto">
                    <SortableContext items={requests.map(r => r.id)} strategy={verticalListSortingStrategy}>
                        {requests.map(request => (
                            <RequestCard key={request.id} request={request} />
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
};


export default function StairspaceRequestsPage() {
    const { stairspaceRequests, setStairspaceRequests, isClient } = useStairspaceRequestsData();
    const { toast } = useToast();
    
    const requestsByStatus = useMemo(() => {
        const grouped: Record<string, BookingRequest[]> = {};
        requestStatuses.forEach(status => {
            grouped[status] = [];
        });
        stairspaceRequests.forEach(request => {
            if (grouped[request.status]) {
                grouped[request.status].push(request);
            }
        });
        return grouped;
    }, [stairspaceRequests]);
    
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
    }));

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeRequest = active.data.current?.request as BookingRequest;
        const overColumnStatus = over.data.current?.status as typeof requestStatuses[number] || over.data.current?.request?.status as typeof requestStatuses[number];

        if (activeRequest && overColumnStatus && activeRequest.status !== overColumnStatus) {
            setStairspaceRequests(prev => 
                prev.map(r => r.id === active.id ? { ...r, status: overColumnStatus } : r)
            );
            toast({
                title: "Status Updated",
                description: `Request for "${activeRequest.listingTitle}" moved to ${overColumnStatus}.`
            });
        }
    };


    return (
        <div className="space-y-8">
            <div>
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/admin/real-estate">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Real Estate
                    </Link>
                </Button>
                <CardHeader className="text-center px-0">
                    <CardTitle className="text-3xl font-bold">StairSpace Booking Requests</CardTitle>
                    <CardDescription>View and manage all incoming booking requests for micro-retail spaces.</CardDescription>
                </CardHeader>
            </div>
            
            <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCenter}>
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-6">
                         {!isClient ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-[300px]">
                                    <Card className="bg-muted/50 h-full">
                                        <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                                        <CardContent className="space-y-4">
                                            <Skeleton className="h-16 w-full" />
                                            <Skeleton className="h-16 w-full" />
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            requestStatuses.map(status => (
                                <StatusColumn
                                    key={status}
                                    status={status}
                                    requests={requestsByStatus[status] || []}
                                />
                            ))
                        )}
                    </div>
                </div>
            </DndContext>
        </div>
    );
}
