
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Mail, Phone, Calendar as CalendarIcon, Search, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useStairspaceRequestsData } from '@/hooks/use-global-store-data';
import { RequestTable, type InterviewValues } from '@/app/raaha/agency-dashboard/request-table';
import { Input } from '@/components/ui/input';


export default function StairspaceRequestsPage() {
    const { stairspaceRequests, setStairspaceRequests, isClient } = useStairspaceRequestsData();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof BookingRequest | 'clientName' | 'listingTitle'; direction: 'ascending' | 'descending' }>({ key: 'requestDate', direction: 'descending' });


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

    const filteredAndSortedRequests = useMemo(() => {
        let filtered = [...stairspaceRequests];

        if (statusFilter !== 'All') {
            filtered = filtered.filter(req => req.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(req => 
                req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.listingTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const key = sortConfig.key;
            // Handle nested properties if necessary, but here they are top-level
            const aValue = a[key as keyof BookingRequest];
            const bValue = b[key as keyof BookingRequest];

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [stairspaceRequests, searchTerm, statusFilter, sortConfig]);

    const requestSort = (key: keyof BookingRequest | 'clientName' | 'listingTitle') => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
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
        sortable: true,
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
        sortable: true,
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
        sortable: true,
        Cell: ({ row }: any) => isClient ? formatDistanceToNow(new Date(row.original.requestDate), { addSuffix: true }) : '...'
       },
       {
        Header: 'Status',
        accessor: 'status',
        sortable: true,
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
        sortable: true,
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
            
            <Card>
                 <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <CardTitle className="text-xl">All Requests</CardTitle>
                        <div className="flex w-full md:w-auto gap-2">
                             <div className="relative flex-grow">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or listing..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Statuses</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Contacted">Contacted</SelectItem>
                                    <SelectItem value="Booked">Booked</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <RequestTable 
                        columns={columns}
                        data={filteredAndSortedRequests}
                        isClient={isClient}
                        onSchedule={handleScheduleInterview}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                    />
                </CardContent>
            </Card>

        </div>
    );
}
