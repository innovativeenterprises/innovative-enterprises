
'use client';

import { useState } from "react";
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
import { Briefcase, DollarSign, Users, Scale, Headset, TrendingUp, Megaphone, Contact, Cpu, Database, BrainCircuit, Bot, PenSquare, Palette, Languages, Camera, Target, Rocket, Handshake, User, Trophy, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agent {
    role: string;
    name: string;
    description: string;
    icon: LucideIcon;
    enabled: boolean;
}

interface AgentCategory {
    category: string;
    agents: Agent[];
}

const initialLeadershipTeam: Agent[] = [
    { name: "JUMAA SALIM ALHADID", role: "CEO and Cofounder", description: "Leads the company's vision and strategic direction.", icon: User, enabled: true },
    { name: "ANWAR AHMED SHARIF", role: "Cofounder and CTO", description: "Drives technological innovation and engineering.", icon: User, enabled: true },
    { name: "ABDULJABBAR AL SADIG AL FAKI", role: "Projects Manager", description: "Oversees all project execution and delivery.", icon: User, enabled: true },
    { name: "HUDA AL SALMI", role: "Public Relations Officer (PRO)", description: "Manages government relations and public engagement.", icon: User, enabled: true },
    { name: "Legal Counsel Office", role: "Advocate & Legal Representative", description: "Provides expert legal guidance and representation.", icon: User, enabled: true },
];

const initialAgentCategories: AgentCategory[] = [
    {
        category: "Core Business Operations Agents",
        agents: [
            { name: "Aida", role: "Admin / Executive Assistant", description: "Schedules, reminders, document prep.", icon: Briefcase, enabled: true },
            { name: "Finley", role: "Finance & Accounting Agent", description: "Bookkeeping, invoices, expense tracking, tax reminders.", icon: DollarSign, enabled: true },
            { name: "Hira", role: "HR & Recruitment Agent", description: "CV screening, ATS checks, onboarding automation.", icon: Users, enabled: true },
            { name: "Lexi", role: "Legal & Contracts Agent", description: "Draft agreements, compliance checks.", icon: Scale, enabled: true },
            { name: "Talia", role: "Talent & Competition Agent", description: "Posts opportunities, manages submissions.", icon: Trophy, enabled: true },
        ]
    },
    {
        category: "Customer & Sales Agents",
        agents: [
            { name: "Caro", role: "Customer Support Agent", description: "Handles WhatsApp, email, chatbot queries 24/7.", icon: Headset, enabled: true },
            { name: "Sami", role: "Sales Agent", description: "Follows up leads, pitches services, books meetings.", icon: TrendingUp, enabled: true },
            { name: "Mira", role: "Marketing Agent", description: "Creates ads, social posts, SEO, blog content.", icon: Megaphone, enabled: true },
            { name: "Remi", role: "CRM Agent", description: "Tracks customer relationships, sends follow-ups.", icon: Contact, enabled: true },
        ]
    },
    {
        category: "Tech & Data Agents",
        agents: [
            { name: "Tariq Tech", role: "IT Support Agent", description: "Troubleshoots software, automates processes.", icon: Cpu, enabled: true },
            { name: "Dana", role: "Data Analyst Agent", description: "Dashboards, trends, KPI monitoring.", icon: Database, enabled: true },
            { name: "Neo", role: "AI Training Agent", description: "Fine-tunes your AI tools on your business data.", icon: BrainCircuit, enabled: true },
            { name: "AutoNabil", role: "Automation Agent", description: "Connects all tools (Zapier/Make style).", icon: Bot, enabled: true },
        ]
    },
    {
        category: "Creative & Media Agents",
        agents: [
            { name: "Lina", role: "Content Creator Agent", description: "Designs posts, videos, brochures.", icon: Palette, enabled: true },
            { name: "Noor", role: "Copywriting Agent", description: "Catchy ad copy, website text.", icon: PenSquare, enabled: true },
            { name: "Voxi", role: "Voice & Translation Agent", description: "Voiceovers, Arabic-English translation.", icon: Languages, enabled: true },
            { name: "Vista", role: "Virtual Tour / Visual Agent", description: "Photo editing, 360° virtual tours.", icon: Camera, enabled: true },
        ]
    },
    {
        category: "Special Growth Agents",
        agents: [
            { name: "Rami", role: "Strategy & Research Agent", description: "Market research, competitor tracking.", icon: Target, enabled: true },
            { name: "Navi", role: "Innovation Agent", description: "Suggests new services/products.", icon: Rocket, enabled: true },
            { name: "Paz", role: "Partnership Agent", description: "Finds collaborators, drafts proposals.", icon: Handshake, enabled: true },
        ]
    },
];

const NewStaffSchema = z.object({
  name: z.string().min(3, "Name is required"),
  role: z.string().min(3, "Role is required"),
  type: z.enum(["Leadership", "AI Agent"]),
});
type NewStaffValues = z.infer<typeof NewStaffSchema>;


const AddStaffDialog = ({ onAddStaff }: { onAddStaff: (values: NewStaffValues) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<NewStaffValues>({
        resolver: zodResolver(NewStaffSchema),
        defaultValues: { name: "", role: "", type: "AI Agent" },
    });

    const onSubmit: SubmitHandler<NewStaffValues> = (data) => {
        onAddStaff(data);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle /> Add New Staff</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>Enter the details for the new staff member.</DialogDescription>
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
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Add Staff</Button>
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

    const handleAddStaff = (values: NewStaffValues) => {
        const newStaffMember: Agent = {
            ...values,
            description: "Newly added staff member.",
            icon: values.type === 'Leadership' ? User : Bot,
            enabled: true,
        };

        if (values.type === 'Leadership') {
            setLeadership(prev => [...prev, newStaffMember]);
        } else {
            // For simplicity, adding to the first agent category
            setAgentCategories(prev => {
                const newCategories = [...prev];
                newCategories[0].agents.push(newStaffMember);
                return newCategories;
            });
        }
        toast({ title: "Staff member added successfully." });
    };

    const handleDelete = (name: string, type: 'leadership' | 'agent') => {
        if (type === 'leadership') {
            setLeadership(prev => prev.filter(member => member.name !== name));
        } else {
            setAgentCategories(prev => 
                prev.map(category => ({
                    ...category,
                    agents: category.agents.filter(agent => agent.name !== name)
                })).filter(category => category.agents.length > 0) // Optional: remove empty categories
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
                <AddStaffDialog onAddStaff={handleAddStaff} />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leadership.map(member => (
                            <TableRow key={member.name}>
                                <TableCell className="font-medium">{member.name}</TableCell>
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
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete {member.name}.</AlertDialogDescription></AlertDialogHeader
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(member.name, 'leadership')}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                         {agentCategories.flatMap(category => 
                            category.agents.map(agent => (
                                <TableRow key={agent.name}>
                                    <TableCell className="font-medium">{agent.name}</TableCell>
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
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

    