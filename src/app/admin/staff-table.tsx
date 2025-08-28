
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
  type: z.enum(["Leadership", "AI Agent"]),
  description: z.string().min(10, "A description is required.").default(''),
  aiHint: z.string().min(2, "AI hint is required").default(''),
  photoUrl: z.string().optional(),
  photoFile: z.any().optional(),
  socials: SocialsSchema.optional(),
}).refine(data => data.photoUrl || data.photoFile, {
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
    const form = useForm<z.infer<typeof StaffSchema>>({
        resolver: zodResolver(StaffSchema),
        defaultValues: {
            name: staffMember?.name || "",
            role: staffMember?.role || "",
            type: staffMember?.type || "AI Agent",
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

    useEffect(() => {
        if(isOpen) {
            form.reset({ 
                name: staffMember?.name || "",
                role: staffMember?.role || "",
                type: staffMember?.type || "AI Agent",
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
                                        <SelectItem value="AI Agent">AI Agent</SelectItem>
                                        <SelectItem value="Leadership">Leadership</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="space-y-2 pt-2">
                            <h4 className="text-sm font-medium">Photo</h4>
                            <FormField control={form.control} name="photoUrl" render={({ field }) => (
                                <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
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
                        </div>
                        

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
    agentCategories, 
    setAgentCategories 
} : {
    leadership: Agent[],
    setLeadership: (updater: (l: Agent[]) => void) => void,
    agentCategories: AgentCategory[],
    setAgentCategories: (updater: (ac: AgentCategory[]) => void) => void
}) {
    const { toast } = useToast();

    const handleToggle = (name: string, type: 'leadership' | 'agent') => {
        if (type === 'leadership') {
            setLeadership(prev => 
                prev.map(member => 
                    member.name === name ? { ...member, enabled: !member.enabled } : member
                )
            );
        } else {
            setAgentCategories(prev => 
                prev.map(category => ({
                    ...category,
                    agents: category.agents.map(agent => 
                        agent.name === name ? { ...agent, enabled: !agent.enabled } : agent
                    )
                }))
            );
        }
        toast({ title: "Staff status updated." });
    };

    const handleSave = (values: StaffValues, originalName?: string) => {
        const updateStaff = (staffList: Agent[]) => {
            if (originalName) { // Update existing
                return staffList.map(staff => staff.name === originalName ? { ...staff, ...values } : staff);
            }
            // Add new
            const newStaff: Agent = {
                ...values,
                icon: values.type === 'Leadership' ? User : Bot, // Default icon
                enabled: true,
            };
             return [...staffList, newStaff];
        };

        if (values.type === 'Leadership') {
             if (originalName) {
                setLeadership(prev => prev.map(staff => staff.name === originalName ? { ...staff, ...values } : staff));
            } else {
                 const newStaff: Agent = { ...values, icon: User, enabled: true };
                 setLeadership(prev => [...prev, newStaff]);
            }
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
                 const newStaff: Agent = { ...values, icon: Bot, enabled: true };
                 setAgentCategories(prev => {
                    const newCats = [...prev];
                    // For simplicity, add to "Core Business Operations Agents"
                    const targetCat = newCats.find(c => c.category === "Core Business Operations Agents");
                    if (targetCat) {
                        targetCat.agents.push(newStaff);
                    } else {
                        // Fallback: create a new category
                        newCats.push({ category: 'General Agents', agents: [newStaff] });
                    }
                    return newCats;
                });
            }
        }

        toast({ title: originalName ? "Staff member updated." : "Staff member added." });
    };

    const handleDelete = (name: string, type: 'leadership' | 'agent') => {
        if (type === 'leadership') {
            setLeadership(prev => prev.filter(member => member.name !== name));
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


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>Enable, disable, add, or remove staff members.</CardDescription>
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
                        {leadership.map(member => (
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
                                    <Badge variant="secondary">Leadership</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Switch
                                        checked={member.enabled}
                                        onCheckedChange={() => handleToggle(member.name, 'leadership')}
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
                                                    <AlertDialogAction onClick={() => handleDelete(member.name, 'leadership')}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                         {agentCategories.flatMap(category => 
                            category.agents.map(agent => (
                                <TableRow key={agent.name}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <AddEditStaffDialog staffMember={agent} onSave={handleSave}>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={agent.photo} alt={agent.name} />
                                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </AddEditStaffDialog>
                                        {agent.name}
                                    </TableCell>
                                    <TableCell>{agent.role}</TableCell>
                                    <TableCell>
                                        <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">AI Agent</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Switch
                                            checked={agent.enabled}
                                            onCheckedChange={() => handleToggle(agent.name, 'agent')}
                                            aria-label={`Enable/disable ${agent.name}`}
                                        />
                                    </TableCell>
                                     <TableCell className="text-right">
                                         <div className="flex justify-end gap-2">
                                            <AddEditStaffDialog staffMember={agent} onSave={handleSave}>
                                                <Button variant="ghost" size="icon"><Edit /></Button>
                                            </AddEditStaffDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete {agent.name}.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(agent.name, 'agent')}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
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
    );
}

    


