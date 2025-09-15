
'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { useCommunitiesData, setCommunities } from '@/hooks/use-global-store-data';
import type { Community } from "@/lib/communities";
import { Skeleton } from "@/components/ui/skeleton";

const CommunitySchema = z.object({
    name: z.string().min(3, "Name is required"),
    country: z.string().min(2, "Country is required"),
    description: z.string().min(10, "Description is required"),
    manager: z.string().min(3, "Manager is required"),
});
type CommunityValues = z.infer<typeof CommunitySchema>;

const AddEditCommunityDialog = ({ community, onSave, children }: { community?: Community, onSave: (values: CommunityValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<CommunityValues>({
        resolver: zodResolver(CommunitySchema),
        defaultValues: community || { name: "", country: "", description: "", manager: "" }
    });

    useEffect(() => {
        if (isOpen) {
            form.reset(community || { name: "", country: "", description: "", manager: "" });
        }
    }, [isOpen, community, form]);

    const onSubmit: SubmitHandler<CommunityValues> = (data) => {
        onSave(data, community?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{community ? "Edit" : "Add"} Community</DialogTitle>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Community Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="manager" render={({ field }) => (
                            <FormItem><FormLabel>Manager</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Community</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};


export default function AdminCommunitiesPage() {
    const { communities, setCommunities, isClient } = useCommunitiesData();
    const { toast } = useToast();

    const handleSave = (values: CommunityValues, id?: string) => {
        if (id) {
            setCommunities(prev => prev.map(c => c.id === id ? { ...c, ...values } : c));
            toast({ title: "Community updated." });
        } else {
            const newCommunity: Community = { ...values, id: `comm_${values.name.toLowerCase().replace(/\s+/g, '_')}` };
            setCommunities(prev => [newCommunity, ...prev]);
            toast({ title: "Community added." });
        }
    };

    const handleDelete = (id: string) => {
        setCommunities(prev => prev.filter(c => c.id !== id));
        toast({ title: "Community removed.", variant: "destructive" });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Community Management</h1>
                <p className="text-muted-foreground">
                    Oversee all registered communities and their designated managers.
                </p>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Registered Communities</CardTitle>
                        <CardDescription>A list of all communities on the platform.</CardDescription>
                    </div>
                     <AddEditCommunityDialog onSave={handleSave}>
                        <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Community</Button>
                    </AddEditCommunityDialog>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Community Name</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Manager</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isClient ? (
                                <TableRow>
                                    <TableCell colSpan={4}><Skeleton className="h-10 w-full"/></TableCell>
                                </TableRow>
                            ) : (
                                communities.map(community => (
                                    <TableRow key={community.id}>
                                        <TableCell className="font-medium">{community.name}</TableCell>
                                        <TableCell>{community.country}</TableCell>
                                        <TableCell>{community.manager}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <AddEditCommunityDialog community={community} onSave={handleSave}>
                                                    <Button variant="ghost" size="icon"><Edit /></Button>
                                                </AddEditCommunityDialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Delete Community?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the "{community.name}" community.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(community.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
