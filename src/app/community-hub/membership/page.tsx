
'use client';

import { useState, useMemo, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { CommunityMember } from "@/lib/community-members";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, ArrowLeft, Users } from "lucide-react";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Community } from "@/lib/communities";
import { useMembersData, useCommunitiesData } from "@/hooks/use-data-hooks";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Membership Management",
    description: "A central database for managing all members of your community.",
};

const MemberSchema = z.object({
  id: z.string().optional(),
  communityId: z.string().min(1, "Please select a community."),
  name: z.string().min(2, "Name is required"),
  photo: z.string().url("A valid photo URL is required"),
  position: z.string().optional(),
  employer: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
});
type MemberValues = z.infer<typeof MemberSchema>;

const AddEditMemberDialog = ({ 
    member, 
    communities,
    onSave, 
    children
}: { 
    member?: CommunityMember, 
    communities: Community[],
    onSave: (v: MemberValues, id?: string) => void, 
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<MemberValues>({
        resolver: zodResolver(MemberSchema),
    });

    useEffect(() => {
        if(isOpen) {
            form.reset(member || { status: 'Active', photo: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}` });
        }
    }, [member, form, isOpen]);

    const onSubmit: SubmitHandler<MemberValues> = (data) => {
        onSave(data, member?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader><DialogTitle>{member ? "Edit" : "Add"} Member</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Member Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="communityId" render={({ field }) => (
                            <FormItem><FormLabel>Community</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a community"/></SelectTrigger></FormControl><SelectContent>
                                {communities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="position" render={({ field }) => (
                                <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="employer" render={({ field }) => (
                                <FormItem><FormLabel>Employer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="photo" render={({ field }) => (
                            <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Record</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};


export default function MembershipPage() {
    const { data: members, setData: setMembers, isClient } = useMembersData();
    const { data: communities } = useCommunitiesData();
    const { toast } = useToast();
    
    const handleSave = (values: MemberValues, id?: string) => {
        if (id) {
            setMembers(prev => prev.map(s => s.id === id ? { ...s, ...values } as CommunityMember : s));
            toast({ title: "Member record updated." });
        } else {
            const newMember: CommunityMember = { ...values, id: `mem_${Date.now()}` };
            setMembers(prev => [newMember, ...prev]);
            toast({ title: "Member record added." });
        }
    };

    const handleDelete = (id: string) => {
        setMembers(prev => prev.filter(s => s.id !== id));
        toast({ title: "Member record removed.", variant: "destructive" });
    };

    const getStatusBadge = (status: CommunityMember['status']) => {
        switch (status) {
            case "Active": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Active</Badge>;
            case "Inactive": return <Badge variant="destructive">Inactive</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/community-hub">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Community Hub
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Users className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Membership Management</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                               A central database for managing all members of your registered communities.
                            </p>
                        </div>
                    </div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div>
                                <CardTitle>Community Members</CardTitle>
                                <CardDescription>A list of all members across all communities.</CardDescription>
                            </div>
                            <AddEditMemberDialog onSave={handleSave} communities={communities}>
                                <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Member</Button>
                            </AddEditMemberDialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Community</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {!isClient ? (
                                        <TableRow><TableCell colSpan={4} className="text-center h-24"><Skeleton className="h-10 w-full"/></TableCell></TableRow>
                                    ) : (
                                        members.map(member => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar><AvatarImage src={member.photo} alt={member.name} /><AvatarFallback>{member.name.charAt(0)}</AvatarFallback></Avatar>
                                                        <div>
                                                            <p className="font-medium">{member.name}</p>
                                                            <p className="text-sm text-muted-foreground">{member.position}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{communities.find(c => c.id === member.communityId)?.name}</TableCell>
                                                <TableCell>{getStatusBadge(member.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <AddEditMemberDialog member={member} onSave={handleSave} communities={communities}><Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button></AddEditMemberDialog>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button></AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Delete Member?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the record for {member.name}.</AlertDialogDescription></AlertDialogHeader>
                                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(member.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
            </div>
        </div>
    );
}
