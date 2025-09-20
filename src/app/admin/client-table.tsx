
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import type { Client } from "@/lib/clients.schema";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';

const ClientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  logo: z.string().url("A valid logo URL is required"),
  aiHint: z.string().min(2, "AI hint is required"),
});
type ClientValues = z.infer<typeof ClientSchema>;

const AddEditClientDialog = ({ client, onSave, children }: { client?: Client, onSave: (values: ClientValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<ClientValues>({
        resolver: zodResolver(ClientSchema),
        defaultValues: client
    });

    const handleSubmit: SubmitHandler<ClientValues> = (data) => {
        onSave(data, client?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{client ? "Edit" : "Add"} Client</DialogTitle></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="logo" render={({ field }) => (
                        <FormItem><FormLabel>Logo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="aiHint" render={({ field }) => (
                        <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save Client</Button></DialogFooter>
                </form></Form>
            </DialogContent>
        </Dialog>
    );
};


export default function ClientTable({ initialClients }: { initialClients: Client[] }) {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const { toast } = useToast();
    
    useEffect(() => {
        setClients(initialClients);
    }, [initialClients]);


    const handleClientSave = (values: ClientValues, id?: string) => {
        if (id) {
            setClients(prev => prev.map(c => c.id === id ? { ...c, ...values} : c));
        } else {
            const newClient: Client = { ...values, id: String(Date.now()) };
            setClients(prev => [...prev, newClient]);
        }
        toast({ title: `Client ${id ? 'updated' : 'added'} successfully.` });
    };

    const handleClientDelete = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
        toast({ title: `Client removed.`, variant: 'destructive' });
    };
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Clients</CardTitle>
                    <AddEditClientDialog onSave={handleClientSave}>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Add Client</Button>
                    </AddEditClientDialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Logo</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {clients.map(client => (
                                <TableRow key={client.id}>
                                    <TableCell><Image src={client.logo} alt={client.name} width={100} height={40} className="object-contain"/></TableCell>
                                    <TableCell>{client.name}</TableCell>
                                    <TableCell className="text-right">
                                        <AddEditClientDialog client={client} onSave={handleClientSave}>
                                            <Button variant="ghost" size="icon"><Edit /></Button>
                                        </AddEditClientDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button></AlertDialogTrigger>
                                            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Client?</AlertDialogTitle><AlertDialogDescription>This will remove "{client.name}" from your client list.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleClientDelete(client.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
