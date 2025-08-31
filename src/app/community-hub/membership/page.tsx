
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { CommunityMember } from "@/lib/community-members";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, ArrowLeft, Users, Wand2, Loader2, FileCheck2 } from "lucide-react";
import Image from 'next/image';
import { store } from "@/lib/global-store";
import Link from 'next/link';
import { analyzeIdentity, type IdentityAnalysisOutput } from '@/ai/flows/identity-analysis';
import { Alert, AlertTitle } from "@/components/ui/alert";


// Hook to connect to the global store for members
export const useMembersData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        members: data.communityMembers,
        setMembers: (updater: (members: CommunityMember[]) => CommunityMember[]) => {
            const currentMembers = store.get().communityMembers;
            const newMembers = updater(currentMembers);
            store.set(state => ({ ...state, communityMembers: newMembers }));
        }
    };
};

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const MemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nickname: z.string().optional(),
  contact: z.string().min(5, "Contact info is required"),
  memberType: z.enum(['Head of Family', 'Spouse', 'Child']),
  status: z.enum(['Active', 'Inactive', 'Pending Review']),
  joinDate: z.string(), // Will be handled as ISO string
  photoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  photoFile: z.any().optional(),
  position: z.string().optional(),
  employer: z.string().optional(),
  address: z.string().optional(),
  identityDocument: z.any().optional(),
}).refine(data => data.photoUrl || (data.photoFile && data.photoFile.length > 0), {
    message: "A Photo URL or a Photo File is required.",
    path: ["photoUrl"],
});
type MemberValues = z.infer<typeof MemberSchema> & { photo: string };


const AddEditMemberDialog = ({ member, onSave, children }: { member?: CommunityMember, onSave: (v: MemberValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(member?.photo || null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof MemberSchema>>({
        resolver: zodResolver(MemberSchema),
        defaultValues: member || { name: "", nickname: "", contact: "", memberType: 'Head of Family', status: 'Active', joinDate: new Date().toISOString().split('T')[0] },
    });

    const watchPhotoUrl = form.watch('photoUrl');
    const watchPhotoFile = form.watch('photoFile');

    useEffect(() => {
        if (watchPhotoFile && watchPhotoFile.length > 0) {
            fileToDataURI(watchPhotoFile[0]).then(setImagePreview);
        } else if (watchPhotoUrl) {
            setImagePreview(watchPhotoUrl);
        } else {
            setImagePreview(member?.photo || null);
        }
    }, [watchPhotoUrl, watchPhotoFile, member?.photo]);
    
    useEffect(() => {
        if (isOpen) {
            form.reset(member || { name: "", nickname: "", contact: "", memberType: 'Head of Family', status: 'Active', joinDate: new Date().toISOString().split('T')[0] });
            setImagePreview(member?.photo || null);
        }
    }, [member, isOpen, form]);

    const handleIdAnalysis = async () => {
        const idFile = form.getValues('identityDocument');
        if (!idFile || idFile.length === 0) {
            toast({ title: 'Please select an identity document first.', variant: 'destructive' });
            return;
        }

        setIsAnalyzing(true);
        toast({ title: 'Analyzing Document...', description: 'Please wait while the AI extracts information.' });

        try {
            const uri = await fileToDataURI(idFile[0]);
            const result = await analyzeIdentity({ idDocumentFrontUri: uri });
            
            if (result.personalDetails?.fullName) {
                form.setValue('name', result.personalDetails.fullName);
            }
            if (result.personalDetails?.phone) {
                form.setValue('contact', result.personalDetails.phone);
            }
             else if (result.personalDetails?.email) {
                form.setValue('contact', result.personalDetails.email);
            }

            toast({ title: "Analysis Complete", description: "Member details have been pre-filled." });
        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Could not analyze the document.", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };


    const onSubmit: SubmitHandler<z.infer<typeof MemberSchema>> = async (data) => {
        let photoValue = "";
        if (data.photoFile && data.photoFile[0]) {
            photoValue = await fileToDataURI(data.photoFile[0]);
        } else if (data.photoUrl) {
            photoValue = data.photoUrl;
        }
        onSave({ ...data, photo: photoValue }, member?.id);
        setImagePreview(null);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader><DialogTitle>{member ? "Edit" : "Add"} Member</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Card className="bg-muted/50 p-4">
                             <FormField control={form.control} name="identityDocument" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>AI-Powered Onboarding</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl className="flex-1">
                                            <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <Button type="button" variant="secondary" onClick={handleIdAnalysis} disabled={isAnalyzing}>
                                            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                            Analyze & Pre-fill
                                        </Button>
                                    </div>
                                    <FormDescription className="text-xs">Upload a passport or ID card. This document is NOT saved.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="nickname" render={({ field }) => (
                                <FormItem><FormLabel>Nickname (Optional)</FormLabel><FormControl><Input placeholder="e.g., Abu Ahmed" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="contact" render={({ field }) => (
                                <FormItem><FormLabel>Contact (Phone/Email)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="memberType" render={({ field }) => (
                                <FormItem><FormLabel>Member Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Head of Family">Head of Family</SelectItem>
                                    <SelectItem value="Spouse">Spouse</SelectItem>
                                    <SelectItem value="Child">Child</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="position" render={({ field }) => (
                                <FormItem><FormLabel>Position (Optional)</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="employer" render={({ field }) => (
                                <FormItem><FormLabel>Employer (Optional)</FormLabel><FormControl><Input placeholder="e.g., Google" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Current Address (Optional)</FormLabel><FormControl><Input placeholder="e.g., Al-Khuwair, Muscat" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <h4 className="text-sm font-medium">Member Photo</h4>
                                {imagePreview && (
                                    <div className="relative h-24 w-24 rounded-full overflow-hidden border">
                                        <Image src={imagePreview} alt="Photo Preview" fill className="object-cover"/>
                                    </div>
                                )}
                                <FormField control={form.control} name="photoUrl" render={({ field }) => (
                                    <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                                </div>
                                <FormField control={form.control} name="photoFile" render={({ field }) => (
                                    <FormItem><FormLabel>Upload Photo</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                        </Card>
                         <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Pending Review">Pending Review</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Member</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function MembershipPage() {
    const { members, setMembers } = useMembersData();
    const { toast } = useToast();

    const handleSave = (values: MemberValues, id?: string) => {
        const { identityDocument, ...restOfValues } = values; // Exclude identityDocument from saving
        if (id) {
            setMembers(prev => prev.map(m => m.id === id ? { ...m, ...restOfValues } : m));
            toast({ title: "Member updated." });
        } else {
            const newMember: CommunityMember = { ...restOfValues, id: `member_${Date.now()}` };
            setMembers(prev => [newMember, ...prev]);
            toast({ title: "Member added." });
        }
    };

    const handleDelete = (id: string) => {
        setMembers(prev => prev.filter(m => m.id !== id));
        toast({ title: "Member removed.", variant: "destructive" });
    };
    
    const getStatusBadge = (status: CommunityMember['status']) => {
        switch (status) {
            case "Active": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Active</Badge>;
            case "Inactive": return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Inactive</Badge>;
            case "Pending Review": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
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
                       A central dashboard for managing all members of your community.
                    </p>
                </div>
            </div>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Member Registry</CardTitle>
                    <CardDescription>View, add, or edit members of your community.</CardDescription>
                </div>
                <AddEditMemberDialog onSave={handleSave}>
                    <Button><PlusCircle /> Add Member</Button>
                </AddEditMemberDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Position / Employer</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {members.map(member => (
                            <TableRow key={member.id}>
                                <TableCell>
                                     <div className="flex items-center gap-3">
                                        <Image src={member.photo} alt={member.name} width={40} height={40} className="rounded-full object-cover"/>
                                        <div>
                                          <p className="font-medium">{member.nickname || member.name}</p>
                                          <p className="text-sm text-muted-foreground">{member.contact}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                  {member.position && <div>
                                    <p className="font-medium">{member.position}</p>
                                    {member.employer && <p className="text-sm text-muted-foreground">{member.employer}</p>}
                                  </div>}
                                </TableCell>
                                <TableCell><Badge variant="outline">{member.memberType}</Badge></TableCell>
                                <TableCell>{getStatusBadge(member.status)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddEditMemberDialog member={member} onSave={handleSave}><Button variant="ghost" size="icon"><Edit /></Button></AddEditMemberDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete Member?</AlertDialogTitle><AlertDialogDescription>This will permanently remove {member.name} from the registry.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(member.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </div>
      </div>
    </div>
    )
}
