

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, GripVertical, Search, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { useToast } from '@/hooks/use-toast';
import { useStairspaceRequestsData } from '@/hooks/use-global-store-data';
import { Skeleton } from '@/components/ui/skeleton';
import { DndContext, useSensor, useSensors, PointerSensor, closestCorners, type DragEndEvent, type Active, type Over } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { ScheduleInterviewDialog, type InterviewValues, type GenericRequest } from '@/components/schedule-interview-dialog';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStairspaceData } from '@/hooks/use-global-store-data';
import { formatDistanceToNow } from 'date-fns';
import { ResponseGenerator } from './response-generator';

const requestStatuses = ['Pending', 'Contacted', 'Booked', 'Confirmed', 'Closed'] as const;

// This function simulates sending a confirmation email to the client.
// In a real application, this would integrate with an email service (e.g., SendGrid, Mailgun).
const sendBookingConfirmation = (request: BookingRequest) => {
    console.log("---- SENDING BOOKING CONFIRMATION ----");
    console.log(`To: ${request.clientEmail}`);
    console.log(`Subject: Your Booking for "${request.listingTitle}" is Ready for Confirmation!`);
    console.log(`Body:`);
    console.log(`Dear ${request.clientName},`);
    console.log(`\nWe're pleased to inform you that your booking request for "${request.listingTitle}" has been approved by the owner.`);
    console.log(`To finalize your booking, please complete the payment at your earliest convenience.`);
    console.log(`\nYou can complete the booking here: /real-estate-tech/stairspace/checkout/${request.id}`);
    console.log(`\nThank you for using StairSpace.`);
    console.log("--------------------------------------");
};

const RequestCard = ({ request, onScheduleInterview }: { request: BookingRequest, onScheduleInterview: (id: string, values: InterviewValues) => void }) => {
    const { stairspaceListings } = useStairspaceData();
    const listing = stairspaceListings.find(l => l.id === request.listingId);
    const [dateText, setDateText] = useState('...');
    
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
        id: request.id,
        data: { type: 'Request', request },
    });

    useEffect(() => {
        // Calculate date on the client to avoid hydration mismatch
        setDateText(formatDistanceToNow(new Date(request.requestDate), { addSuffix: true }));
    }, [request.requestDate]);

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    
    return (
        <div ref={setNodeRef} style={style}>
            <Dialog>
                <Card className="mb-4 group bg-card hover:bg-muted/80">
                    <CardContent className="p-3">
                         <DialogTrigger asChild>
                             <div className="flex items-start gap-3 cursor-pointer">
                                <Button variant="ghost" size="icon" {...attributes} {...listeners} onClick={(e) => e.stopPropagation()} className="cursor-grab h-8 w-8 -ml-1">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm leading-tight group-hover:text-primary">{request.listingTitle}</p>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5"><CheckCircle className="h-3 w-3"/>{request.clientName}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3"/>{dateText}</p>
                                </div>
                            </div>
                        </DialogTrigger>
                        <div className="pl-12 pr-1 mt-2">
                             <ScheduleInterviewDialog request={request as GenericRequest} onSchedule={onScheduleInterview} />
                        </div>
                    </CardContent>
                 </Card>
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
                                <Link href={`/real-estate-tech/stairspace/${listing.id}`} target="_blank">
                                    <Image src={listing.imageUrl} alt={listing.title} width={300} height={200} className="rounded-lg object-cover hover:opacity-80 transition-opacity" />
                                </Link>
                                <h3 className="font-bold">{listing.title}</h3>
                                <p className="text-sm text-muted-foreground">{listing.location}</p>
                             </div>
                        )}
                        <ResponseGenerator request={request} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const StatusColumn = ({ status, requests, onScheduleInterview }: { status: typeof requestStatuses[number], requests: BookingRequest[], onScheduleInterview: (id: string, values: InterviewValues) => void, }) => {
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
                            <RequestCard key={request.id} request={request} onScheduleInterview={onScheduleInterview} />
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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    
    const onScheduleInterview = (id: string, values: InterviewValues) => {
        setStairspaceRequests(prev => prev.map(r => 
            r.id === id ? { ...r, interviewDate: values.interviewDate.toISOString(), interviewNotes: values.interviewNotes } : r
        ));
        toast({ title: "Interview Scheduled!", description: `The interview has been scheduled.` });
    };

    const filteredRequests = useMemo(() => {
        return stairspaceRequests.filter(req => {
            const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
            const matchesSearch = searchTerm === '' ||
                req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.listingTitle.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [stairspaceRequests, searchTerm, filterStatus]);

    const requestsByStatus = useMemo(() => {
        const grouped: Record<string, BookingRequest[]> = {};
        requestStatuses.forEach(status => {
            grouped[status] = [];
        });
        filteredRequests.forEach(request => {
            if (grouped[request.status]) {
                grouped[request.status].push(request);
            }
        });
        return grouped;
    }, [filteredRequests]);
    
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

            if (overColumnStatus === 'Booked') {
                sendBookingConfirmation(activeRequest);
                toast({
                    title: "Client Notified!",
                    description: "A booking confirmation has been sent to the client.",
                });
            }
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

             <Card className="p-4 bg-muted/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                     <div className="relative flex-grow w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by client or listing..."
                            className="w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by status..." />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="All">All Statuses</SelectItem>
                            {requestStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>
            
            <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCorners}>
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
                                    onScheduleInterview={onScheduleInterview}
                                />
                            ))
                        )}
                    </div>
                </div>
            </DndContext>
        </div>
    );
}
