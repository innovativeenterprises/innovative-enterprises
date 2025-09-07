

'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";
import { User, Bot, PlusCircle, Trash2, Edit, Mail, Phone, Globe, Linkedin, Twitter, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Agent, AgentCategory } from "@/lib/agents";
import { Textarea } from "@/components/ui/textarea";
import { store } from "@/lib/global-store";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const SocialsSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
    linkedin: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
    twitter: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
    github: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
});

const StaffSchema = z.object({
  name: z.string().min(3, "Name is required"),
  role: z.string().min(3, "Role is required"),
  type: z.enum(["Leadership", "AI Agent", "Staff"]),
  description: z.string().min(10, "A description is required.").default(''),
  aiHint: z.string().min(2, "AI hint is required").default(''),
  photoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  photoFile: z.any().optional(),
  socials: SocialsSchema.optional(),
}).refine(data => data.photoUrl || (data.photoFile && data.photoFile.length > 0), {
    message: "Either a Photo URL or a Photo File is required.",
    path: ["photoUrl"], // Point error to photoUrl field
});

type StaffValues = z.infer<typeof StaffSchema> & { photo: string };


const AddEditStaffDialog = ({ 
    staffMember,
    onSave,
    children
}: { 
    staffMember?: Agent,
    onSave: (values: StaffValues, name?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(staffMember?.photo || null);
    
    const form = useForm<z.infer<typeof StaffSchema>>({
        resolver: zodResolver(StaffSchema),
        defaultValues: {
            name: staffMember?.name || "",
            role: staffMember?.role || "",
            type: staffMember?.type || "Staff",
            description: staffMember?.description || "",
            aiHint: staffMember?.aiHint || "",
            photoUrl: staffMember?.photo || "",
            photoFile: undefined,
            socials: {
                email: staffMember?.socials?.email || '',
                phone: staffMember?.socials?.phone || '',
                website: staffMember?.socials?.website || '',
                linkedin: staffMember?.socials?.linkedin || '',
                twitter: staffMember?.socials?.twitter || '',
                github: staffMember?.socials?.github || '',
            }
        },
    });

    const watchPhotoUrl = form.watch('photoUrl');
    const watchPhotoFile = form.watch('photoFile');

    useEffect(() => {
        if (watchPhotoFile && watchPhotoFile.length > 0) {
            fileToDataURI(watchPhotoFile[0]).then(setImagePreview);
        } else if (watchPhotoUrl) {
            setImagePreview(watchPhotoUrl);
        } else {
            setImagePreview(staffMember?.photo || null);
        }
    }, [watchPhotoUrl, watchPhotoFile, staffMember?.photo]);


    useEffect(() => {
        if(isOpen) {
            form.reset({ 
                name: staffMember?.name || "",
                role: staffMember?.role || "",
                type: staffMember?.type || "Staff",
                description: staffMember?.description || "",
                aiHint: staffMember?.aiHint || "",
                photoUrl: staffMember?.photo || "",
                photoFile: undefined,
                socials: {
                    email: staffMember?.socials?.email || '',
                    phone: staffMember?.socials?.phone || '',
                    website: staffMember?.socials?.website || '',
                    linkedin: staffMember?.socials?.linkedin || '',
                    twitter: staffMember?.socials?.twitter || '',
                    github: staffMember?.socials?.github || '',
                }
            });
             setImagePreview(staffMember?.photo || null);
        }
    }, [staffMember, form, isOpen]);

    const onSubmit: SubmitHandler<z.infer<typeof StaffSchema>> = async (data) => {
        let photoValue = "";

        if (data.photoFile && data.photoFile.length > 0) {
            photoValue = await fileToDataURI(data.photoFile[0]);
        } else if (data.photoUrl) {
            photoValue = data.photoUrl;
        }
        
        onSave({ ...data, photo: photoValue }, staffMember?.name);
        form.reset();
        setImagePreview(null);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{staffMember ? "Edit" : "Add New"} Staff Member</DialogTitle>
                    <DialogDescription>
                        {staffMember ? "Update the details for this staff member." : "Enter the details for the new staff member."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Ada Lovelace" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl><Input placeholder="e.g., Chief Innovation Officer" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Describe their role and responsibilities." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Leadership">Leadership</SelectItem>
                                        <SelectItem value="Staff">Staff</SelectItem>
                                        <SelectItem value="AI Agent">AI Agent</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <h4 className="text-sm font-medium">Photo</h4>
                                {imagePreview && (
                                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20">
                                        <Image src={imagePreview} alt="Image Preview" fill className="object-cover"/>
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
                                    <FormItem>
                                        <FormLabel>Upload Photo File</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>
                        

                        <FormField control={form.control} name="aiHint" render={({ field }) => (
                            <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <Accordion type="single" collapsible>
                            <AccordionItem value="socials">
                                <AccordionTrigger>Contact & Social Links (Optional)</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                     <FormField control={form.control} name="socials.email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="contact@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="socials.phone" render={({ field }) => (
                                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="+968 1234 5678" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="socials.website" render={({ field }) => (
                                        <FormItem><FormLabel>Website URL</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="socials.linkedin" render={({ field }) => (
                                        <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="socials.twitter" render={({ field }) => (
                                        <FormItem><FormLabel>Twitter URL</FormLabel><FormControl><Input placeholder="https://twitter.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="socials.github" render={({ field }) => (
                                        <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        

                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Staff</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

// This hook now connects to the global store.
export const useStaffData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        leadership: data.leadership,
        setLeadership: (updater: (agents: Agent[]) => Agent[]) => {
            const currentAgents = store.get().leadership;
            const newAgents = updater(currentAgents);
            store.set(state => ({ ...state, leadership: newAgents }));
        },
        staff: data.staff,
        setStaff: (updater: (agents: Agent[]) => Agent[]) => {
            const currentAgents = store.get().staff;
            const newAgents = updater(currentAgents);
            store.set(state => ({ ...state, staff: newAgents }));
        },
        agentCategories: data.agentCategories,
        setAgentCategories: (updater: (categories: AgentCategory[]) => AgentCategory[]) => {
            const currentCategories = store.get().agentCategories;
            const newCategories = updater(currentCategories);
            store.set(state => ({ ...state, agentCategories: newCategories }));
        }
    };
};


export default function StaffTable({ 
    leadership, 
    setLeadership, 
    staff,
    setStaff,
    agentCategories, 
    setAgentCategories 
} : {
    leadership: Agent[],
    setLeadership: (updater: (l: Agent[]) => void) => void,
    staff: Agent[],
    setStaff: (updater: (s: Agent[]) => void) => void,
    agentCategories: AgentCategory[],
    setAgentCategories: (updater: (ac: AgentCategory[]) => void) => void
}) {
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleToggle = (name: string, type: 'leadership' | 'staff' | 'agent') => {
        if (type === 'leadership') {
            setLeadership(prev => prev.map(member => member.name === name ? { ...member, enabled: !member.enabled } : member));
        } else if (type === 'staff') {
            setStaff(prev => prev.map(member => member.name === name ? { ...member, enabled: !member.enabled } : member));
        } else {
            setAgentCategories(prev => 
                prev.map(category => ({
                    ...category,
                    agents: category.agents.map(agent => agent.name === name ? { ...agent, enabled: !agent.enabled } : agent)
                }))
            );
        }
        toast({ title: "Staff status updated." });
    };

    const handleSave = (values: StaffValues, originalName?: string) => {
        const newStaffMember: Agent = { ...values, icon: values.type === 'AI Agent' ? Bot : User, enabled: true };

        const updateStaffList = (list: Agent[]) => {
            if (originalName) {
                return list.map(staff => staff.name === originalName ? { ...staff, ...values } : staff);
            }
            return [...list, newStaffMember];
        };

        if (values.type === 'Leadership') {
            setLeadership(updateStaffList);
        } else if (values.type === 'Staff') {
            setStaff(updateStaffList);
        } else { // AI Agent
             if (originalName) {
                let found = false;
                setAgentCategories(prev => prev.map(cat => {
                    if (found) return cat;
                    const agentIndex = cat.agents.findIndex(a => a.name === originalName);
                    if (agentIndex > -1) {
                        found = true;
                        const updatedAgents = [...cat.agents];
                        updatedAgents[agentIndex] = { ...updatedAgents[agentIndex], ...values };
                        return { ...cat, agents: updatedAgents };
                    }
                    return cat;
                }));
            } else {
                 setAgentCategories(prev => {
                    const newCats = [...prev];
                    const targetCat = newCats.find(c => c.category === "Core Business Operations Agents");
                    if (targetCat) {
                        targetCat.agents.push(newStaffMember);
                    } else {
                        newCats.push({ category: 'General Agents', agents: [newStaffMember] });
                    }
                    return newCats;
                });
            }
        }

        toast({ title: originalName ? "Staff member updated." : "Staff member added." });
    };

    const handleDelete = (name: string, type: 'leadership' | 'staff' | 'agent') => {
        if (type === 'leadership') {
            setLeadership(prev => prev.filter(member => member.name !== name));
        } else if (type === 'staff') {
            setStaff(prev => prev.filter(member => member.name !== name));
        } else {
            setAgentCategories(prev => 
                prev.map(category => ({
                    ...category,
                    agents: category.agents.filter(agent => agent.name !== name)
                })).filter(category => category.agents.length > 0)
            );
        }
        toast({ title: "Staff member removed.", variant: "destructive" });
    };

    const renderStaffRow = (member: Agent, type: 'leadership' | 'staff' | 'agent') => (
        <TableRow key={member.name}>
            <TableCell className="font-medium flex items-center gap-3">
                <AddEditStaffDialog staffMember={member} onSave={handleSave}>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={member.photo} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </AddEditStaffDialog>
                {member.name}
            </TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>
                <Badge variant={type === 'AI Agent' ? 'default' : 'secondary'} className={type === 'AI Agent' ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}>
                    {type === 'leadership' ? 'Leadership' : type === 'staff' ? 'Staff' : 'AI Agent'}
                </Badge>
            </TableCell>
            <TableCell className="text-center">
                <Switch
                    checked={member.enabled}
                    onCheckedChange={() => handleToggle(member.name, type)}
                    aria-label={`Enable/disable ${member.name}`}
                />
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <AddEditStaffDialog staffMember={member} onSave={handleSave}>
                        <Button variant="ghost" size="icon"><Edit /></Button>
                    </AddEditStaffDialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete {member.name}.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(member.name, type)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Workforce Management</CardTitle>
                    <CardDescription>Manage all human and AI staff members.</CardDescription>
                </div>
                <AddEditStaffDialog onSave={handleSave}>
                     <Button><PlusCircle /> Add New Staff</Button>
                </AddEditStaffDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isClient && leadership.map(member => renderStaffRow(member, 'leadership'))}
                        {isClient && staff.map(member => renderStaffRow(member, 'staff'))}
                        {isClient && agentCategories.flatMap(category => 
                            category.agents.map(agent => renderStaffRow(agent, 'agent'))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

    
