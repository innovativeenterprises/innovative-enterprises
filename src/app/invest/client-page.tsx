'use client';

import { Download, TrendingUp, Users, Target, Building2, Lightbulb, PackageCheck, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CompanyProfileDownloader from "./company-profile-downloader";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import type { Product } from "@/lib/products.schema";
import { useProductsData, useInvestorsData } from "@/hooks/use-global-store-data";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Investor } from "@/lib/investors.schema";
import { InvestorSchema } from "@/lib/investors.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InvestForm from "./invest-form";

const investmentReasons = [
    {
        icon: Target,
        title: "Strategic Market Position",
        description: "As a leading Omani SME, we have a unique advantage in the local market with strong government and corporate partnerships."
    },
    {
        icon: TrendingUp,
        title: "Focus on Emerging Tech",
        description: "Our portfolio is centered on high-growth sectors like AI, Cloud Computing, and Cybersecurity, positioning us for future success."
    },
    {
        icon: Users,
        title: "Experienced Leadership",
        description: "Our team consists of seasoned professionals with a proven track record of delivering innovative projects and driving growth."
    }
];

const ProjectCard = ({ product }: { product: Product }) => {
    const getStatusColor = () => {
        switch (product.stage) {
            case 'Live & Operating': return 'bg-green-500 hover:bg-green-600';
            case 'In Development': return 'bg-blue-500 hover:bg-blue-600';
            case 'Prototyping': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Research Phase': return 'bg-purple-500 hover:bg-purple-600';
            case 'Concept Phase': return 'bg-gray-500 hover:bg-gray-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    }
    const content = (
        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                     <Badge variant="default" className={`${getStatusColor()} text-white`}>{product.stage}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
        </Card>
    );

    return product.href ? <Link href={product.href} className="flex">{content}</Link> : content;
}

type InvestorValues = z.infer<typeof InvestorSchema>;

const AddEditInvestorDialog = ({ investor, onSave, children }: { investor?: Investor, onSave: (values: InvestorValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<InvestorValues>({
        resolver: zodResolver(InvestorSchema),
        defaultValues: investor || {
            name: "",
            type: "Investor",
            subType: "Angel",
        }
    });

    useEffect(() => {
        if(isOpen) form.reset(investor);
    }, [investor, form, isOpen]);

    const onSubmit: SubmitHandler<InvestorValues> = (data) => {
        onSave(data, investor?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{investor ? "Edit" : "Add"} Investor/Funder</DialogTitle></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="Investor">Investor</SelectItem><SelectItem value="Funder">Funder</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="subType" render={({ field }) => (
                            <FormItem><FormLabel>Sub-Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="Personal/Private">Personal/Private</SelectItem>
                                <SelectItem value="Angel">Angel</SelectItem>
                                <SelectItem value="Institute/Government">Institute/Government</SelectItem>
                                <SelectItem value="VC Fund">VC Fund</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="focusArea" render={({ field }) => (
                        <FormItem><FormLabel>Focus Area</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save</Button></DialogFooter>
                </form></Form>
            </DialogContent>
        </Dialog>
    );
};

function InvestorTable() {
    const { investors, setInvestors, isClient } = useInvestorsData();
    const { toast } = useToast();

    const handleSave = (values: InvestorValues, id?: string) => {
        const newInvestorData = { ...values, documents: {} };
        if (id) {
            setInvestors(prev => prev.map(inv => inv.id === id ? { ...inv, ...newInvestorData } : inv));
            toast({ title: 'Investor updated.' });
        } else {
            const newInvestor: Investor = { ...newInvestorData, id: `inv_${Date.now()}` };
            setInvestors(prev => [newInvestor, ...prev]);
            toast({ title: 'Investor added.' });
        }
    };

    const handleDelete = (id: string) => {
        setInvestors(prev => prev.filter(inv => inv.id !== id));
        toast({ title: 'Investor removed.', variant: 'destructive' });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Investors & Funders</CardTitle>
                    <CardDescription>Manage your list of potential and current investors.</CardDescription>
                </div>
                <AddEditInvestorDialog onSave={handleSave}>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Investor</Button>
                </AddEditInvestorDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Focus Area</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? <TableRow><TableCell colSpan={4}><Skeleton className="w-full h-12" /></TableCell></TableRow> :
                            investors.map(investor => (
                                <TableRow key={investor.id}>
                                    <TableCell className="font-medium">{investor.name}</TableCell>
                                    <TableCell>{investor.subType}</TableCell>
                                    <TableCell>{investor.focusArea}</TableCell>
                                    <TableCell className="text-right">
                                        <AddEditInvestorDialog investor={investor} onSave={handleSave}>
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </AddEditInvestorDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete Investor?</AlertDialogTitle></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(investor.id!)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function InvestClientPage() {
    const { products } = useProductsData();
    const liveProducts = products.filter(p => p.stage === 'Live & Operating').slice(0, 5);
    const devProducts = products.filter(p => p.stage === 'In Development' || p.stage === 'Testing Phase').slice(0, 5);
    const futureProducts = products.filter(p => p.stage === 'Research Phase' || p.stage === 'Idea Phase').slice(0, 5);

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Invest With Us</h1>
          <div className="mt-4 text-lg text-muted-foreground">
            Explore investment opportunities and be part of our innovation journey. We are seeking strategic investors to help us scale our impact.
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-16 space-y-20">
            <div>
                 <h2 className="text-3xl font-bold text-center text-primary mb-10">Why Invest in INNOVATIVE ENTERPRISES?</h2>
                 <div className="grid md:grid-cols-3 gap-8">
                     {investmentReasons.map((reason) => (
                        <Card key={reason.title} className="text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                             <CardHeader className="items-center">
                                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-accent transition-colors">
                                    <reason.icon className="w-8 h-8 text-primary group-hover:text-accent-foreground" />
                                </div>
                             </CardHeader>
                             <CardContent className="space-y-2">
                                <CardTitle className="text-xl">{reason.title}</CardTitle>
                                <CardDescription>{reason.description}</CardDescription>
                             </CardContent>
                        </Card>
                     ))}
                 </div>
            </div>
            
             <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Our Network of Investors & Funders</h2>
                <InvestorTable />
            </div>

            {liveProducts.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                        <PackageCheck className="w-8 h-8" /> Live & Operating Platforms
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveProducts.map(p => <ProjectCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}
            
            {devProducts.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                        <PackageCheck className="w-8 h-8" /> Platforms in Development
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devProducts.map(p => <ProjectCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}
            
            {futureProducts.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                        <Lightbulb className="w-8 h-8" /> Future Concepts
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {futureProducts.map(p => <ProjectCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}


            <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Pitch Decks & Downloads</h2>
                <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CompanyProfileDownloader />
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-company.pdf" download>
                            <Download className="mr-2 h-5 w-5" /> Company Pitch Deck
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-panospace.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> PANOSPACE Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-ameen.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> Ameen Project
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-appi.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> APPI Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-khidma.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> KHIDMA Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-vmall.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> VMALL Project
                        </a>
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Get in Touch</h2>
                <InvestForm />
            </div>
        </div>
      </div>
    </div>
  );
}
