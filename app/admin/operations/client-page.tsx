'use client';

import ProForm from "@/app/admin/operations/pro-form";
import TenderForm from "@/app/admin/operations/tender-form";
import MeetingForm from "@/app/admin/operations/meeting-form";
import CouponGenerator from "@/app/admin/operations/coupon-generator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, NotebookText, Ticket, Scale, Edit } from "lucide-react";
import ThemeGenerator from "./theme-generator";
import AssetRentalAgentForm from '@/app/admin/operations/asset-rental-agent-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { KnowledgeDocument } from "@/lib/knowledge.schema";
import { Skeleton } from "@/components/ui/skeleton";
import type { CostRate } from "@/lib/cost-settings.schema";
import type { Pricing } from "@/lib/pricing.schema";
import { useKnowledgeData, useCostSettingsData, usePricingData } from "@/hooks/use-global-store-data";


// --- KnowledgeTable Logic ---
const KnowledgeTable = () => {
    const { knowledgeBase, setKnowledgeBase, isClient } = useKnowledgeData();
    // Logic for KnowledgeTable will be here
    return <Card><CardHeader><CardTitle>AI Knowledge Base</CardTitle></CardHeader><CardContent><p>{knowledgeBase.length} documents</p></CardContent></Card>
}

// --- CostSettingsTable Logic ---
const CostSettingsTable = () => {
    const { costSettings, isClient } = useCostSettingsData();
    // Logic for CostSettingsTable will be here
     return <Card><CardHeader><CardTitle>Market Rates</CardTitle></CardHeader><CardContent><p>{costSettings.length} rates configured</p></CardContent></Card>
}

// --- PricingTable Logic ---
const PricingFormSchema = z.object({
  price: z.coerce.number().min(0, "Price must be a positive number"),
});
type PricingValues = z.infer<typeof PricingFormSchema>;

const EditPriceDialog = ({ 
    item, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    item: Pricing, 
    onSave: (values: PricingValues, id: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const form = useForm<PricingValues>({
        resolver: zodResolver(PricingFormSchema),
    });

    useEffect(() => {
        if(isOpen) {
            form.reset({ price: item.price });
        }
    }, [item, form, isOpen]);

    const onSubmit: SubmitHandler<PricingValues> = (data) => {
        onSave(data, item.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Price</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <p className="font-medium text-sm">{item.type}</p>
                            <p className="text-sm text-muted-foreground">{item.group}</p>
                        </div>
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Price per page (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Price</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function PricingTable() { 
    const { pricing, setPricing, isClient } = usePricingData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Pricing | undefined>(undefined);

    const handleSave = (values: PricingValues, id: string) => {
        setPricing(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
        toast({ title: "Price updated successfully." });
    };
    
    const handleOpenDialog = (item: Pricing) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Translation Pricing Management</CardTitle>
                <CardDescription>Manage the per-page price for document translation.</CardDescription>
            </CardHeader>
            <CardContent>
                {selectedItem && (
                    <EditPriceDialog
                      isOpen={isDialogOpen}
                      onOpenChange={setIsDialogOpen}
                      item={selectedItem}
                      onSave={handleSave}
                    >
                      <div />
                    </EditPriceDialog>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price (OMR)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={4}>
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                             pricing.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.type}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.group}</TableCell>
                                    <TableCell>OMR {item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Edit /></Button>
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


export default function AdminOperationsPage() {

  const internalTools = [
    { id: 'pro', title: 'PRO Task Delegation', icon: UserRoundCheck, component: <ProForm /> },
    { id: 'tender', title: 'Tender Response Assistant', icon: FileText, component: <TenderForm /> },
    { id: 'meeting', title: 'Online Meeting Agent', icon: NotebookText, component: <MeetingForm /> },
    { id: 'coupon', title: 'Coupon Generator', icon: Ticket, component: <CouponGenerator /> },
    { id: 'rental', title: 'Asset Rental Proposal Generator', icon: Scale, component: <AssetRentalAgentForm /> },
  ]

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                A suite of internal AI tools and configurations to enhance business operations.
            </p>
        </div>

        <Tabs defaultValue="ai-tools" className="w-full">
             <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ai-tools">AI Tools & Generators</TabsTrigger>
                <TabsTrigger value="knowledge-base">AI Knowledge Base</TabsTrigger>
                <TabsTrigger value="costing">Market Rates</TabsTrigger>
                <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
            </TabsList>
            <TabsContent value="ai-tools" className="mt-6 space-y-8">
                 <ThemeGenerator />
                <div className="pt-8">
                    <h2 className="text-2xl font-bold mb-4">Other Internal AI Tools</h2>
                    <Accordion type="single" collapsible className="w-full">
                    {internalTools.map(tool => (
                        <AccordionItem value={tool.id} key={tool.id}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <tool.icon className="h-5 w-5 text-primary" />
                                    <span className="text-lg font-semibold">{tool.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                {tool.component}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </div>
            </TabsContent>
            <TabsContent value="knowledge-base" className="mt-6">
                <KnowledgeTable />
            </TabsContent>
             <TabsContent value="costing" className="mt-6 space-y-8">
                <CostSettingsTable />
            </TabsContent>
            <TabsContent value="pricing" className="mt-6 space-y-8">
                <PricingTable />
            </TabsContent>
        </Tabs>
    </div>
  );
}