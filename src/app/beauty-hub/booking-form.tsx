
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBeautySpecialistsData, useBeautyAppointmentsData } from '@/hooks/use-data-hooks.tsx';
import type { BeautyCenter } from '@/lib/beauty-centers.schema';
import type { BeautyService } from '@/lib/beauty-services.schema';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import { useRouter } from 'next/navigation';

const BookingSchema = z.object({
  clientName: z.string().min(3, "Name is required."),
  clientPhone: z.string().min(8, "A valid phone number is required."),
  dateTime: z.date({ required_error: "Please select a date and time." }),
  specialist: z.string().min(1, "Please select a specialist."),
});
type BookingValues = z.infer<typeof BookingSchema>;

export const BookingForm = ({ 
    agency,
    service,
    isOpen,
    onOpenChange,
    onClose,
}: { 
    agency: BeautyCenter;
    service: BeautyService;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { data: specialists } = useBeautySpecialistsData();
    const { setData: setAppointments } = useBeautyAppointmentsData();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<BookingValues>({
        resolver: zodResolver(BookingSchema),
        defaultValues: {
            clientName: "Valued Customer",
        },
    });

    const agencySpecialists = specialists.filter(s => s.agencyId === agency.id);

    const onSubmit: SubmitHandler<BookingValues> = async (data) => {
        setIsLoading(true);
        
        const newAppointment: BeautyAppointment = {
            id: `appt_${Date.now()}`,
            agencyId: agency.id,
            clientName: data.clientName,
            service: service.name,
            specialist: data.specialist,
            dateTime: data.dateTime.toISOString(),
            status: 'Pending',
        };

        setAppointments(prev => [newAppointment, ...prev]);

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({ title: "Booking Request Submitted!", description: "Your appointment is pending confirmation. The salon will contact you shortly." });
        setIsLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Book: {service.name}</DialogTitle>
                    <DialogDescription>
                        Confirm your details to request an appointment at {agency.name}.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="clientName" render={({ field }) => (
                            <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="clientPhone" render={({ field }) => (
                            <FormItem><FormLabel>Your Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="specialist" render={({ field }) => (
                            <FormItem><FormLabel>Preferred Specialist</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a specialist..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {agencySpecialists.map(spec => (
                                            <SelectItem key={spec.id} value={spec.name}>{spec.name} ({spec.specialty})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField
                            control={form.control}
                            name="dateTime"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Preferred Date</FormLabel>
                                <Popover><PopoverTrigger asChild><FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl></PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                </PopoverContent></Popover><FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Request Appointment</>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
