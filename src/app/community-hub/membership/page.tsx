

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { CommunityMember } from "@/lib/community-members";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, ArrowLeft, Users, Wand2, Loader2, FileCheck2, Link as LinkIcon, Link2Off, UserPlus, Home } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { analyzeIdentity, type IdentityAnalysisOutput } from '@/ai/flows/identity-analysis';
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembersData } from '@/hooks/use-global-store-data';


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
  householdRole: z.enum(['Head', 'Member']),
  status: z.enum(['Active', 'Inactive', 'Pending Review']),
  joinDate: z.string(), // Will be handled as ISO string
  photoUrl: z.string().url("A valid photo URL is required.").optional().or(z.literal('')),
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


const AddEditMemberDialog = ({ 
    member, 
    familyId,
    onSave, 
    children, 
    members,
    setMembers,
}: { 
    member?: CommunityMember, 
    familyId?: string,
    onSave: (v: MemberValues, id?: string) => void, 
    children: React.ReactNode,
    members: CommunityMember[],
    setMembers: (updater: (prev: CommunityMember[]) => CommunityMember[]) => void,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(member?.photo || null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof MemberSchema>>({
        resolver: zodResolver(MemberSchema),
        defaultValues: member || { name: "", nickname: "", contact: "", householdRole: 'Head', status: 'Active', joinDate: new Date().toISOString().split('T')[0] },
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
            form.reset(member || { name: "", nickname: "", contact: "", householdRole: 'Head', status: 'Active', joinDate: new Date().toISOString().split('T')[0] });
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
        if (data.photoFile && data.photoFile.length > 0) {
            photoValue = await fileToDataURI(data.photoFile[0]);
        } else if (data.photoUrl) {
            photoValue = data.photoUrl;
        }
        
        const memberData: MemberValues = { ...data, photo: photoValue };
        
        let finalMemberData: CommunityMember;
        
        if (member) { // Editing existing member
             finalMemberData = { ...member, ...memberData };
        } else { // Adding new member
            const baseId = `member_${memberData.name.toLowerCase().replace(/\s+/g, '_')}`;
            finalMemberData = {
                ...memberData,
                id: baseId,
                familyId: familyId || (data.householdRole === 'Head' ? `fam_${baseId}` : undefined)
            }
        }
        
        // Logic to update family head if role changes
        if (member && member.householdRole === 'Head' && data.householdRole === 'Member') {
             // Find another member in the family to promote to Head, or clear familyId for all
             const otherFamilyMembers = members.filter(m => m.familyId === member.familyId && m.id !== member.id);
             if (otherFamilyMembers.length > 0) {
                 // Promote the first other member to Head
                 const newHead = otherFamilyMembers[0];
                 setMembers(prev => prev.map(m => {
                     if (m.id === newHead.id) return { ...m, householdRole: 'Head' };
                     if (m.id === member.id) return { ...finalMemberData, familyId: undefined, householdRole: 'Head' };
                     return m;
                 }));
             } else {
                 // This was the only member, so just remove their familyId
                 setMembers(prev => prev.map(m => m.id === member.id ? { ...finalMemberData, familyId: undefined, householdRole: 'Head' } : m));
             }
        } else {
            onSave(finalMemberData, member?.id);
        }
        
        setImagePreview(null);
        setIsOpen(false);
    };
    
    const familyMembers = member?.familyId ? members.filter(m => m.familyId === member.familyId && m.id !== member.id) : [];

    const unlinkMember = (memberIdToUnlink: string) => {
        setMembers(prev => prev.map(m => m.id === memberIdToUnlink ? { ...m, familyId: undefined, householdRole: 'Head' } : m));
        toast({ title: "Member Unlinked", description: "The member has been removed from the family." });
    }

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
                            <FormField control={form.control} name="householdRole" render={({ field }) => (
                                <FormItem><FormLabel>Household Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Head">Head of Family</SelectItem>
                                    <SelectItem value="Member">Member</SelectItem>
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
                        
                         {member?.householdRole === 'Head' && (
                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center justify-between">
                                        Family Members
                                        <AddEditMemberDialog onSave={onSave} familyId={member.familyId} members={members} setMembers={setMembers}>
                                            <Button size="sm" variant="outline"><UserPlus className="mr-2 h-4 w-4"/>Add Family Member</Button>
                                        </AddEditMemberDialog>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {familyMembers.length > 0 ? (
                                        <ul className="space-y-2">
                                            {familyMembers.map(fm => (
                                                <li key={fm.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-background">
                                                    <span>{fm.name}</span>
                                                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => unlinkMember(fm.id)}>
                                                        <Link2Off className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center">No other family members linked.</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

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
    const { members, isClient, setMembers } = useMembersData();
    const { toast } = useToast();

    const handleSave = (values: MemberValues, id?: string) => {
        const { identityDocument, ...restOfValues } = values; // Exclude identityDocument from saving
        let memberToSave: CommunityMember;

        if (id) {
            const existingMember = members.find(m => m.id === id)!;
            memberToSave = { ...existingMember, ...restOfValues };
            setMembers(prev => prev.map(m => (m.id === id ? memberToSave : m)));
            toast({ title: "Member updated." });
        } else {
            const baseId = `member_${values.name.toLowerCase().replace(/\s+/g, '_')}`;
            memberToSave = { 
                ...restOfValues, 
                id: baseId,
                familyId: values.householdRole === 'Head' ? `fam_${baseId}` : undefined
            };
            setMembers(prev => [memberToSave, ...prev]);
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
                <AddEditMemberDialog onSave={handleSave} members={members} setMembers={setMembers}>
                    <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Member</Button>
                </AddEditMemberDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Household Role</TableHead><TableHead>Position / Employer</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {!isClient ? (
                           <TableRow>
                             <TableCell colSpan={5} className="text-center h-24"><Skeleton className="h-10 w-full"/></TableCell>
                           </TableRow>
                        ) : (
                            members.map(member => (
                                <TableRow key={member.id} className={member.householdRole === 'Member' ? 'bg-muted/50' : ''}>
                                    <TableCell>
                                         <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0" style={{ paddingLeft: member.householdRole === 'Member' ? '20px' : '0' }}>
                                             {member.householdRole === 'Member' && <span className="text-muted-foreground">- </span>}
                                            <Image src={member.photo} alt={member.name} width={40} height={40} className="rounded-full object-cover"/>
                                            </div>
                                            <div>
                                              <p className="font-medium">{member.nickname || member.name}</p>
                                              <p className="text-sm text-muted-foreground">{member.contact}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                     <TableCell><Badge variant={member.householdRole === 'Head' ? 'default' : 'outline'}>{member.householdRole === 'Head' ? 'Head of Family' : 'Member'}</Badge></TableCell>
                                    <TableCell>
                                      {member.position && <div>
                                        <p className="font-medium">{member.position}</p>
                                        {member.employer && <p className="text-sm text-muted-foreground">{member.employer}</p>}
                                      </div>}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AddEditMemberDialog member={member} onSave={handleSave} members={members} setMembers={setMembers}><Button variant="ghost" size="icon"><Edit /></Button></AddEditMemberDialog>
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </div>
      </div>
    </div>
    )
}
