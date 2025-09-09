
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { HireRequest } from "@/lib/raaha-requests";
import type { BookingRequest } from "@/lib/stairspace-requests";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type GenericRequest = HireRequest | BookingRequest;

const InterviewSchema = z.object({
  interviewDate: z.date({ required_error: "An interview date is required."}),
  interviewNotes: z.string().optional(),
});
export type InterviewValues = z.infer<typeof InterviewSchema>;

const ScheduleInterviewDialog = ({ request, onSchedule }: { request: GenericRequest, onSchedule: (id: string, values: InterviewValues) => void }) => {
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

    const getIdentifier = () => {
        if ('workerName' in request) return request.workerName;
        if ('clientName' in request) return request.clientName;
        return 'the client';
    }

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
                    <DialogTitle>Schedule Interview</DialogTitle>
                    <DialogDescription>
                        Set a date and add notes for the interview with {getIdentifier()}.
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

export function RequestTable({ 
    requests,
    columns,
    isClient,
    onSchedule,
}: { 
    requests: GenericRequest[], 
    columns: any[],
    isClient: boolean,
    onSchedule: (id: string, values: InterviewValues) => void,
}) { 
    return (
        <Card>
            <CardContent className="pt-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                           {columns.map(col => <TableHead key={col.Header}>{col.Header}</TableHead>)}
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center h-24">
                                   <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                         ) : requests.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">
                                    No requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map(req => (
                               <TableRow key={req.id}>
                                  {columns.map(col => (
                                    <TableCell key={col.accessor}>
                                        {col.Cell ? col.Cell({ row: { original: req } }) : req[col.accessor as keyof GenericRequest]}
                                    </TableCell>
                                  ))}
                                  <TableCell>
                                       <ScheduleInterviewDialog request={req} onSchedule={onSchedule} />
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

