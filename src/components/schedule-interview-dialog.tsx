
'use client';

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import type { HireRequest } from "@/lib/raaha-requests";
import type { BookingRequest } from "@/lib/stairspace-requests";

type GenericRequest = HireRequest | BookingRequest;

const InterviewSchema = z.object({
  interviewDate: z.date({ required_error: "An interview date is required."}),
  interviewNotes: z.string().optional(),
});
export type InterviewValues = z.infer<typeof InterviewSchema>;

export const ScheduleInterviewDialog = ({ request, onSchedule }: { request: GenericRequest, onSchedule: (id: string, values: InterviewValues) => void }) => {
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
                 <Button variant="outline" size="sm" className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {request.interviewDate ? 'Reschedule' : 'Schedule'} Interview
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
