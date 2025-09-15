
'use client';

import { useState, useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Community } from "@/lib/communities";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import { useStaffData, useCommunitiesData } from "@/hooks/use-global-store-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";


const CommunitySchema = z.object({
  name: z.string().min(3, "Community name is required"),
  country: z.string().min(2, "Country is required"),
  description: z.string().min(10, "A brief description is required"),
  manager: z.string().min(1, "A manager must be assigned"),
});
type CommunityValues = z.infer<typeof CommunitySchema>;

const AddEditCommunityDialog = ({ community, onSave, children }: { community?: Community, onSave: (v: CommunityValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { leadership, staff } = useStaffData();
    const potentialManagers = [...leadership, ...staff];

    const form = useForm<CommunityValues>({
        resolver: zodResolver(CommunitySchema),
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
                    <DialogTitle>{community ? "Edit" : "Create"} Community Hub</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Community Name</FormLabel><FormControl><Input placeholder="e.g., Sudanese Community in Oman" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="e.g., Oman" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief description of the community's purpose and goals." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="manager" render={({ field }) => (
                            <FormItem><FormLabel>Assign Manager</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a staff member to manage this hub" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {potentialManagers.map(manager => (
                                        <SelectItem key={manager.name} value={manager.name}>{manager.name} ({manager.role})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage /></FormItem>
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
    const { leadership, staff } = useStaffData();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const staffMap = useMemo(() => {
        if (!isClient) return {};
        return [...leadership, ...staff].reduce((map, person) => {
            map[person.name] = person;
            return map;
        }, {} as Record<string, typeof leadership[0]>);
    }, [leadership, staff, isClient]);
    
    const filteredCommunities = useMemo(() => {
        if (!isClient) return [];
        return communities.filter(community =>
            community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            community.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            community.manager.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [communities, searchTerm, isClient]);


    const handleSave = (values: CommunityValues, id?: string) => {
        if (id) {
            setCommunities(prev => prev.map(c => c.id === id ? { ...c, ...values } : c));
            toast({ title: "Community Hub updated." });
        } else {
            const newCommunity: Community = { ...values, id: `comm_${values.name.replace(/\s+/g, '_').toLowerCase()}` };
            setCommunities(prev => [newCommunity, ...prev]);
            toast({ title: "Community Hub created." });
        }
    };

    const handleDelete = (id: string) => {
        setCommunities(prev => prev.filter(c => c.id !== id));
        toast({ title: "Community Hub removed.", variant: "destructive" });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Community Hubs</h1>
                <p className="text-muted-foreground">Manage and oversee all active community instances on the platform.</p>
            </div>
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle>Community Instances</CardTitle>
                        <CardDescription>A list of all created community instances.</CardDescription>
                    </div>
                     <div className="flex w-full md:w-auto items-center gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search communities..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <AddEditCommunityDialog onSave={handleSave}>
                            <Button className="shrink-0"><PlusCircle /> Create New</Button>
                        </AddEditCommunityDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Country</TableHead><TableHead>Manager</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {!isClient ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={4}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredCommunities.map(community => (
                                    <TableRow key={community.id}>
                                        <TableCell className="font-medium">{community.name}</TableCell>
                                        <TableCell>{community.country}</TableCell>
                                        <TableCell>
                                            {staffMap[community.manager] ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={staffMap[community.manager].photo} />
                                                        <AvatarFallback>{community.manager.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{community.manager}</p>
                                                        <p className="text-xs text-muted-foreground">{staffMap[community.manager].role}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                community.manager
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <AddEditCommunityDialog community={community} onSave={handleSave}><Button variant="ghost" size="icon"><Edit /></Button></AddEditCommunityDialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Delete Community Hub?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the "{community.name}" hub.</AlertDialogDescription></AlertDialogHeader>
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
    );
}
