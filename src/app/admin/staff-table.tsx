
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
import { Briefcase, DollarSign, Users, Scale, Headset, TrendingUp, Megaphone, Contact, Cpu, Database, BrainCircuit, Bot, PenSquare, Palette, Languages, Camera, Target, Rocket, Handshake, User, Trophy, PlusCircle, Trash2, Edit, NotebookText, WalletCards } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

interface Agent {
    role: string;
    name: string;
    description: string;
    icon: LucideIcon;
    enabled: boolean;
    type: 'Leadership' | 'AI Agent';
    photo: string;
    aiHint: string;
}

interface AgentCategory {
    category: string;
    agents: Agent[];
}

const initialLeadershipTeam: Agent[] = [
    { name: "JUMAA SALIM AL HADIDI", role: "CEO and Co-Founder", description: "Leads the company's vision and strategic direction.", icon: User, enabled: true, type: 'Leadership', photo: 'https://placehold.co/40x40.png', aiHint: 'oman business man' },
    { name: "ANWAR AHMED SHARIF", role: "CTO and Co-Founder", description: "Drives technological innovation and engineering.", icon: User, enabled: true, type: 'Leadership', photo: 'https://placehold.co/40x40.png', aiHint: 'technology expert' },
    { name: "ABDULJABBAR AL FAKI", role: "Projects Manager", description: "Oversees all project execution and delivery.", icon: User, enabled: true, type: 'Leadership', photo: 'https://placehold.co/40x40.png', aiHint: 'project manager' },
    { name: "HUDA AL SALMI", role: "Public Relations Officer (PRO)", description: "Manages government relations and public engagement.", icon: User, enabled: true, type: 'Leadership', photo: 'https://placehold.co/40x40.png', aiHint: 'business woman' },
    { name: "Legal Counsel Office", role: "Advocate & Legal Representative", description: "Provides expert legal guidance and representation.", icon: User, enabled: true, type: 'Leadership', photo: 'https://placehold.co/40x40.png', aiHint: 'lawyer office' },
];

const initialAgentCategories: AgentCategory[] = [
    {
        category: "Core Business Operations Agents",
        agents: [
            { name: "Aida", role: "Admin & Legal Assistant", description: "Engages with visitors, books meetings, generates minutes, and drafts initial legal agreements.", icon: NotebookText, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'robot assistant' },
            { name: "Finley", role: "Finance & Accounting Agent", description: "Monitors cash flow, tracks transactions, and manages financial data.", icon: WalletCards, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'finance robot' },
            { name: "Hira", role: "HR & Recruitment Agent", description: "Analyzes CVs for ATS compliance, enhances resumes, and automates onboarding document checks.", icon: Users, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'human resources robot' },
            { name: "Talia", role: "Talent & Competition Agent", description: "Analyzes and posts new work orders, competitions, and tasks for our talent network.", icon: Trophy, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'robot trophy' },
        ]
    },
    {
        category: "Customer & Sales Agents",
        agents: [
            { name: "Sami", role: "Sales Agent", description: "Generates tailored Letters of Interest for potential investors and follows up on leads.", icon: TrendingUp, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'sales bot' },
            { name: "Mira", role: "Marketing & Content Agent", description: "Generates social media posts, marketing copy, tender responses, and relevant imagery.", icon: Megaphone, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'marketing bot' },
            { name: "Remi", role: "CRM Agent", description: "Tracks customer relationships, logs inquiries, and sends automated follow-ups to maintain engagement.", icon: Contact, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'crm bot' },
        ]
    },
    {
        category: "Tech & Data Agents",
        agents: [
            { name: "Tariq Tech", role: "IT Support Agent", description: "Automates IT processes, assists with software troubleshooting, and manages system configurations.", icon: Cpu, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'it support' },
            { name: "Dana", role: "Data Analyst Agent", description: "Analyzes business data to generate dashboards, identify trends, and monitor KPIs for strategic insights.", icon: Database, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'data analytics' },
            { name: "Neo", role: "AI Training Agent", description: "Fine-tunes other AI agents by processing custom knowledge documents and Q&A pairs.", icon: BrainCircuit, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'ai brain' },
            { name: "AutoNabil", role: "Automation Agent", description: "Connects disparate tools and services to create seamless, automated workflows across the business.", icon: Bot, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'automation robot' },
        ]
    },
    {
        category: "Creative & Media Agents",
        agents: [
            { name: "Lina", role: "Image Generation Agent", description: "Generates high-quality images from text prompts for use in marketing, design, and social media.", icon: Palette, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'creative robot' },
            { name: "Voxi", role: "Voice & Translation Agent", description: "Provides high-fidelity, verified translations for official documents between multiple languages.", icon: Languages, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'translation bot' },
            { name: "Vista", role: "Virtual Tour / Visual Agent", description: "Creates immersive 360° virtual tours and assists with advanced photo and video editing tasks.", icon: Camera, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'camera robot' },
        ]
    },
    {
        category: "Special Growth Agents",
        agents: [
            { name: "Rami", role: "Strategy & Research Agent", description: "Performs market research, competitor analysis, and tracks industry trends to inform business strategy.", icon: Target, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'strategy bot' },
            { name: "Navi", role: "Innovation Agent", description: "Analyzes market gaps and internal capabilities to suggest new products and service offerings.", icon: Rocket, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'innovation bot' },
            { name: "Paz", role: "Partnership Agent", description: "Identifies and onboards new freelancers, subcontractors, and strategic partners to expand our network.", icon: Handshake, enabled: true, type: 'AI Agent', photo: 'https://placehold.co/40x40.png', aiHint: 'partnership bot' },
        ]
    },
];

const StaffSchema = z.object({
  name: z.string().min(3, "Name is required"),
  role: z.string().min(3, "Role is required"),
  type: z.enum(["Leadership", "AI Agent"]),
  photo: z.string().min(1, "A photo is required."),
  aiHint: z.string().min(2, "AI hint is required"),
});
type StaffValues = z.infer<typeof StaffSchema>;


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
    const form = useForm<Omit<StaffValues, 'photo'> & { photo: any }>({
        resolver: zodResolver(StaffSchema.omit({ photo: true })),
        defaultValues: staffMember ? { name: staffMember.name, role: staffMember.role, type: staffMember.type, aiHint: staffMember.aiHint } : { name: "", role: "", type: "AI Agent", aiHint: "person portrait" },
    });

    useEffect(() => {
        if(isOpen) {
            form.reset(staffMember ? { name: staffMember.name, role: staffMember.role, type: staffMember.type, aiHint: staffMember.aiHint } : { name: "", role: "", type: "AI Agent", photo: "", aiHint: "person portrait" });
        }
    }, [staffMember, form, isOpen]);

    const onSubmit: SubmitHandler<any> = async (data) => {
        let photoDataUri = staffMember?.photo || "";
        if (data.photo && data.photo.length > 0) {
            const file = data.photo[0];
            photoDataUri = await fileToDataURI(file);
        }
        
        onSave({ ...data, photo: photoDataUri }, staffMember?.name);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="photo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Photo</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="aiHint" render={({ field }) => (
                                <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
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

export default function StaffTable() {
    const [leadership, setLeadership] = useState<Agent[]>(initialLeadershipTeam);
    const [agentCategories, setAgentCategories] = useState<AgentCategory[]>(initialAgentCategories);
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
        if (originalName) {
            // Update
            const updateStaff = (staff: Agent) => (staff.name === originalName ? { ...staff, ...values, description: staff.description, icon: staff.icon } : staff);
            
            setLeadership(prev => prev.map(updateStaff));
            setAgentCategories(prev => prev.map(cat => ({
                ...cat,
                agents: cat.agents.map(updateStaff)
            })));
            
            toast({ title: "Staff member updated successfully." });

        } else {
            // Create
            const newStaffMember: Agent = {
                description: "Newly added staff member.",
                icon: values.type === 'Leadership' ? User : Bot,
                enabled: true,
                ...values,
            };

            if (values.type === 'Leadership') {
                setLeadership(prev => [...prev, newStaffMember]);
            } else {
                // For simplicity, adding to the first agent category
                setAgentCategories(prev => {
                    const newCategories = [...prev];
                    if (newCategories.length > 0) {
                        newCategories[0].agents.push(newStaffMember);
                    } else {
                        // Handle case where there are no agent categories
                        return [{ category: "General Agents", agents: [newStaffMember] }];
                    }
                    return newCategories;
                });
            }
            toast({ title: "Staff member added successfully." });
        }
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
