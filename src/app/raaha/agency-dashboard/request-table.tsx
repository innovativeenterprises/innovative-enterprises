
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
import { formatDistanceToNow, format } from 'date-fns';
import { Calendar as CalendarIcon, MessageSquare, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const InterviewSchema = z.object({
  interviewDate: z.date({ required_error: "An interview date is required."}),
  interviewNotes: z.string().optional(),
});
type InterviewValues = z.infer<typeof InterviewSchema>;

const ScheduleInterviewDialog = ({ request, onSchedule }: { request: HireRequest, onSchedule: (id: string, values: InterviewValues) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const form = useForm<InterviewValues>({
        resolver: zodResolver(InterviewSchema),
        defaultValues: {
            interviewDate: request.interviewDate ? new Date(request.interviewDate) : undefined,
            interviewNotes: request.interviewNotes || '',
        }
    });

    useEffect(() => {
        if(isOpen) {
            form.reset({
                interviewDate: request.interviewDate ? new Date(request.interviewDate) : new Date(),
                interviewNotes: request.interviewNotes || '',
            });
        }
    }, [isOpen, request, form]);

    const onSubmit: SubmitHandler<InterviewValues> = (data) => {
        onSchedule(request.id, data);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" size="sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {request.interviewDate ? 'Reschedule' : 'Schedule'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schedule Interview for {request.workerName}</DialogTitle>
                    <DialogDescription>
                        Set a date and add notes for the interview with {request.clientName}.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField
                            control={form.control}
                            name="interviewDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Interview Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                        >
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField control={form.control} name="interviewNotes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes / Meeting Link</FormLabel>
                                <FormControl><Textarea placeholder="e.g., Zoom link, or 'In-person meeting at our office'." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Schedule</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

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

export function RequestTable({ requests, setRequests }: { requests: HireRequest[], setRequests: (updater: (requests: HireRequest[]) => void) => void }) { 
    const { toast } = useToast();

    const handleStatusChange = (requestId: string, newStatus: HireRequest['status']) => {
        setRequests(prev => prev.map(req => 
            req.id === requestId ? { ...req, status: newStatus } : req
        ));
        toast({ title: "Status Updated", description: `Request has been updated to "${newStatus}".` });
    };

    const handleScheduleInterview = (requestId: string, values: InterviewValues) => {
        setRequests(prev => prev.map(req => 
            req.id === requestId ? { 
                ...req, 
                status: 'Interviewing',
                interviewDate: values.interviewDate.toISOString(),
                interviewNotes: values.interviewNotes
            } : req
        ));
        toast({ title: 'Interview Scheduled!', description: 'The client will be notified.' });
    };

    const getStatusBadge = (status: HireRequest['status']) => {
        switch (status) {
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
            case 'Contacted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Contacted</Badge>;
            case 'Interviewing': return <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 hover:bg-purple-500/30">Interviewing</Badge>;
            case 'Hired': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Hired</Badge>;
            case 'Closed': return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Closed</Badge>;
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
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length === 0 && (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                    No requests for this agency yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {requests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell>
                                    <p className="font-medium">{req.workerName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Requested: {formatDistanceToNow(new Date(req.requestDate), { addSuffix: true })}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div>{req.clientName}</div>
                                    <div className="text-sm text-muted-foreground">{req.clientContact}</div>
                                </TableCell>
                                <TableCell>
                                     <Select onValueChange={(value: HireRequest['status']) => handleStatusChange(req.id, value)} defaultValue={req.status}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(req.status)}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Contacted">Contacted</SelectItem>
                                            <SelectItem value="Interviewing">Interviewing</SelectItem>
                                            <SelectItem value="Hired">Hired</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                     {req.interviewDate && (
                                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                                           <div className="flex items-center gap-1.5">
                                             <Clock className="h-3 w-3" />
                                             <span>{format(new Date(req.interviewDate), "PPP 'at' p")}</span>
                                           </div>
                                            {req.interviewNotes && (
                                                <div className="flex items-center gap-1.5">
                                                   <MessageSquare className="h-3 w-3" />
                                                   <span className="truncate">{req.interviewNotes}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <ScheduleInterviewDialog request={req} onSchedule={handleScheduleInterview} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
