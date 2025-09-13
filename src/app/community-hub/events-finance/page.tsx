
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { CommunityEvent } from "@/lib/community-events";
import type { CommunityFinance } from "@/lib/community-finances";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, ArrowLeft, Users, Calendar, MapPin, DollarSign, HandCoins, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AddEditTransactionDialog, type TransactionValues } from './transaction-form';
import { useCommunityHubData, setCommunityEvents, setCommunityFinances } from '@/hooks/use-global-store-data';
import { Skeleton } from "@/components/ui/skeleton";

const EventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  date: z.date({ required_error: "A date is required."}),
  location: z.string().min(3, "Location is required"),
  description: z.string().optional(),
});
type EventValues = z.infer<typeof EventSchema>;

const AddEditEventDialog = ({ event, onSave, children }: { event?: CommunityEvent, onSave: (v: EventValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<EventValues>({
        resolver: zodResolver(EventSchema),
        defaultValues: event ? { ...event, date: new Date(event.date) } : { title: "", date: new Date(), location: "", description: "" },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset(event ? { ...event, date: new Date(event.date) } : { title: "", date: new Date(), location: "", description: "" });
        }
    }, [event, form, isOpen]);

    const onSubmit: SubmitHandler<EventValues> = (data) => {
        onSave(data, event?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader><DialogTitle>{event ? "Edit" : "Create"} Event</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Event Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Event Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarPicker mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Event</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function EventsFinancePage() {
    const { events, finances, isClient } = useCommunityHubData();
    const { toast } = useToast();

    const handleSaveEvent = (values: EventValues, id?: string) => {
        const eventData = { ...values, date: values.date.toISOString() };
        if (id) {
            setCommunityEvents(prev => prev.map(e => e.id === id ? { ...e, ...eventData } : e));
            toast({ title: "Event updated." });
        } else {
            const newEvent: CommunityEvent = { ...eventData, id: `event_${Date.now()}`, rsvps: 0 };
            setCommunityEvents(prev => [newEvent, ...prev]);
            toast({ title: "Event created." });
        }
    };

    const handleDeleteEvent = (id: string) => {
        setCommunityEvents(prev => prev.filter(e => e.id !== id));
        toast({ title: "Event removed.", variant: "destructive" });
    };

    const handleSaveTransaction = (values: TransactionValues, id?: string) => {
        if (id) {
            setCommunityFinances(prev => prev.map(f => f.id === id ? { ...f, ...values, date: new Date().toISOString() } : f));
            toast({ title: "Transaction updated." });
        } else {
            const newTransaction: CommunityFinance = { ...values, id: `fin_${Date.now()}`, date: new Date().toISOString() };
            setCommunityFinances(prev => [newTransaction, ...prev]);
            toast({ title: "Transaction added." });
        }
    };
     const handleDeleteTransaction = (id: string) => {
        setCommunityFinances(prev => prev.filter(f => f.id !== id));
        toast({ title: "Transaction removed.", variant: "destructive" });
    };

    const totalIncome = finances.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = finances.filter(f => f.type === 'Expense').reduce((sum, item) => sum + item.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/community-hub"><ArrowLeft className="mr-2 h-4 w-4" />Back to Community Hub</Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <HandCoins className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Events & Financials</h1>
                            <p className="mt-4 text-lg text-muted-foreground">Manage your community's events and track its financial health.</p>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                             <Card className="p-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                                <div className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2"><ArrowUpRight/> Total Income</div>
                                <div className="text-2xl font-bold text-green-800 dark:text-green-200">OMR {totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            </Card>
                             <Card className="p-4 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                                <div className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2"><ArrowDownRight/> Total Expenses</div>
                                <div className="text-2xl font-bold text-red-800 dark:text-red-200">OMR {totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            </Card>
                             <Card className="p-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                                <div className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2"><DollarSign/> Net Balance</div>
                                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">OMR {netBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            </Card>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle>Financial Ledger</CardTitle>
                                <CardDescription>A log of all community income and expenses.</CardDescription>
                            </div>
                            <AddEditTransactionDialog onSave={handleSaveTransaction}>
                                <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Transaction</Button>
                            </AddEditTransactionDialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Amount (OMR)</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isClient ? finances.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.description}</TableCell>
                                            <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                            <TableCell>
                                                <span className={cn('font-semibold', item.type === 'Income' ? 'text-green-600' : 'text-red-600')}>
                                                    {item.type}
                                                </span>
                                            </TableCell>
                                            <TableCell>{isClient ? format(new Date(item.date), "PPP") : '...'}</TableCell>
                                            <TableCell className="text-right font-mono">{item.amount.toFixed(2)}</TableCell>
                                             <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <AddEditTransactionDialog transaction={item} onSave={handleSaveTransaction}>
                                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                                                    </AddEditTransactionDialog>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader><AlertDialogTitle>Delete Transaction?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this financial record.</AlertDialogDescription></AlertDialogHeader>
                                                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteTransaction(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle>Upcoming Events</CardTitle>
                                <CardDescription>Manage all community gatherings and activities.</CardDescription>
                            </div>
                             <AddEditEventDialog onSave={handleSaveEvent}><Button><PlusCircle className="mr-2 h-4 w-4"/> Create Event</Button></AddEditEventDialog>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isClient ? events.map(event => (
                                    <Card key={event.id} className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-lg">{event.title}</h3>
                                            <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {isClient ? format(new Date(event.date), "PPP") : '...'}</span>
                                                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/> {event.location}</span>
                                                <span className="flex items-center gap-1.5"><Users className="h-4 w-4"/> {event.rsvps} attending</span>
                                            </div>
                                            {event.description && <p className="text-sm mt-2">{event.description}</p>}
                                        </div>
                                         <div className="flex sm:flex-col justify-end gap-2">
                                            <AddEditEventDialog event={event} onSave={handleSaveEvent}><Button variant="outline" size="sm"><Edit className="h-4 w-4"/></Button></AddEditEventDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Delete Event?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the "{event.title}" event.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </Card>
                                )) : <Skeleton className="h-24 w-full" />}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
