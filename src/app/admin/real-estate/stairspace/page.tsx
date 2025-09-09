
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Mail, Phone, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useStairspaceRequestsData } from '@/hooks/use-global-store-data';
import { RequestTable, type InterviewValues } from '@/app/raaha/agency-dashboard/request-table';


export default function StairspaceRequestsPage() {
    const { stairspaceRequests, setStairspaceRequests, isClient } = useStairspaceRequestsData();
    const { toast } = useToast();

    const handleStatusChange = (requestId: string, newStatus: BookingRequest['status']) => {
        setStairspaceRequests(prev => 
            prev.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        );
        toast({ title: "Status Updated", description: "The request status has been changed." });
    };

    const handleScheduleInterview = (requestId: string, values: InterviewValues) => {
        setStairspaceRequests(prev => prev.map(req => 
            req.id === requestId ? { 
                ...req, 
                status: 'Contacted',
                interviewDate: values.interviewDate.toISOString(),
                interviewNotes: values.interviewNotes
            } : req
        ));
        toast({ title: 'Interview Scheduled!', description: 'The client will see this update in their "My Requests" page.' });
    };


    const getStatusBadge = (status: BookingRequest['status']) => {
        switch (status) {
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
            case 'Contacted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Contacted</Badge>;
            case 'Booked': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Booked</Badge>;
            case 'Closed': return <Badge variant="destructive">Closed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const columns = [
      {
        Header: 'Listing & Message',
        accessor: 'listingTitle',
        Cell: ({ row }: any) => (
          <div>
            <p className="font-medium">{row.original.listingTitle}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{row.original.message}</p>
          </div>
        )
      },
      {
        Header: 'Client Details',
        accessor: 'clientName',
        Cell: ({ row }: any) => (
           <div>
                <p className="font-medium">{row.original.clientName}</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-1">
                    <a href={`mailto:${row.original.clientEmail}`} className="flex items-center gap-1.5 hover:text-primary"><Mail className="h-3 w-3"/> {row.original.clientEmail}</a>
                    <a href={`tel:${row.original.clientPhone}`} className="flex items-center gap-1.5 hover:text-primary"><Phone className="h-3 w-3"/> {row.original.clientPhone}</a>
                </div>
            </div>
        )
      },
       {
        Header: 'Requested On',
        accessor: 'requestDate',
        Cell: ({ row }: any) => isClient ? formatDistanceToNow(new Date(row.original.requestDate), { addSuffix: true }) : '...'
       },
       {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }: any) => (
           <Select value={row.original.status} onValueChange={(value: BookingRequest['status']) => handleStatusChange(row.original.id, value)}>
              <SelectTrigger className="w-[180px]">
                  <SelectValue>{getStatusBadge(row.original.status)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
          </Select>
        )
      },
      {
        Header: 'Interview',
        accessor: 'interviewDate',
        Cell: ({ row }: any) => {
          if (!row.original.interviewDate || !isClient) return 'Not Scheduled';
          return (
             <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                    <CalendarIcon className="h-3 w-3 text-primary" />
                    <span>{format(new Date(row.original.interviewDate), "PPP 'at' p")}</span>
                </div>
                {row.original.interviewNotes && (
                    <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-3 w-3" />
                        <span className="truncate">{row.original.interviewNotes}</span>
                    </div>
                )}
            </div>
          )
        }
      }
    ];

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

            <RequestTable 
                columns={columns}
                data={stairspaceRequests}
                isClient={isClient}
                onSchedule={handleScheduleInterview}
            />
        </div>
    );
}
