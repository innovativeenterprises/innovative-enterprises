
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { store } from '@/lib/global-store';
import type { HireRequest } from '@/lib/raaha-requests';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, UserCheck, CalendarIcon, MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';

function RequestRow({ request }: { request: HireRequest }) {
    const [requestDateText, setRequestDateText] = useState("...");
    const [interviewDateText, setInterviewDateText] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setRequestDateText(formatDistanceToNow(new Date(request.requestDate), { addSuffix: true }));
        if (request.interviewDate) {
            setInterviewDateText(format(new Date(request.interviewDate), "PPP 'at' p"));
        }
    }, [request]);

    const getStatusBadge = (status: HireRequest['status']) => {
        switch (status) {
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending Agency Review</Badge>;
            case 'Contacted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Agency Contacted</Badge>;
            case 'Interviewing': return <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 hover:bg-purple-500/30">Interviewing</Badge>;
            case 'Hired': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Hired</Badge>;
            case 'Closed': return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Closed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };
    
    return (
         <TableRow key={request.id}>
            <TableCell>
                <p className="font-medium">{request.workerName}</p>
                <p className="text-sm text-muted-foreground">
                    Requested: {isClient ? requestDateText : '...'}
                </p>
            </TableCell>
            <TableCell>
                <p>{request.agencyId}</p>
            </TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
            <TableCell>
                {request.interviewDate ? (
                    <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                        <CalendarIcon className="h-3 w-3 text-primary" />
                        <span>Interview: {isClient ? interviewDateText : '...'}</span>
                    </div>
                        {request.interviewNotes && (
                            <div className="flex items-center gap-1.5">
                            <MessageSquare className="h-3 w-3" />
                            <span className="truncate">{request.interviewNotes}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground italic">Agency will contact you soon.</p>
                )}
            </TableCell>
        </TableRow>
    )
}

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<HireRequest[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const updateRequests = () => setRequests(store.get().raahaRequests);
        updateRequests();
        const unsubscribe = store.subscribe(updateRequests);
        return () => unsubscribe();
    }, []);
    
    // In a real app, you would filter requests by the logged-in user.
    // For this prototype, we'll assume we're viewing requests for one client.
    const myRequests = requests.filter(r => r.clientName === 'Ahmed Al-Farsi');

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/raaha">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to RAAHA Platform
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <UserCheck className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">My Hire Requests</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Track the status of your applications for domestic helpers.
                            </p>
                        </div>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Active & Past Requests</CardTitle>
                            <CardDescription>The table below shows the real-time status of each request as updated by the agency.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Candidate</TableHead>
                                        <TableHead>Agency</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Next Steps</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isClient && myRequests.length > 0 ? (
                                        myRequests.map(req => (
                                           <RequestRow key={req.id} request={req} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                                {isClient ? "You haven't made any hire requests yet." : "Loading requests..."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
