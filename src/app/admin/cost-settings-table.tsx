
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { CostRate } from "@/lib/cost-settings.schema";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { store } from "@/lib/global-store";

export const useCostSettingsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        costSettings: data.costSettings,
        setCostSettings: (updater: (costSettings: CostRate[]) => void) => {
            const currentCostSettings = store.get().costSettings;
            const newCostSettings = updater(currentCostSettings);
            store.set(state => ({ ...state, costSettings: newCostSettings }));
        }
    };
};

const CostSettingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum(['Material', 'Labor', 'Equipment']),
  unit: z.string().min(1, "Unit is required"),
  rate: z.coerce.number().min(0, "Rate must be a positive number"),
});
type CostSettingValues = z.infer<typeof CostSettingSchema>;


const AddEditCostDialog = ({ 
    item, 
    onSave,
    children
}: { 
    item?: CostRate, 
    onSave: (values: CostSettingValues, id?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<CostSettingValues>({
        resolver: zodResolver(CostSettingSchema),
        defaultValues: item || { name: "", category: "Material", unit: "", rate: 0 },
    });

    useEffect(() => {
        if(isOpen) {
            form.reset(item || { name: "", category: "Material", unit: "", rate: 0 });
        }
    }, [item, form, isOpen]);

    const onSubmit: SubmitHandler<CostSettingValues> = (data) => {
        onSave(data, item?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{item ? "Edit" : "Add"} Cost Rate</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Item Name</FormLabel><FormControl><Input placeholder="e.g., Ready-mix Concrete" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Material">Material</SelectItem>
                                        <SelectItem value="Labor">Labor</SelectItem>
                                        <SelectItem value="Equipment">Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="unit" render={({ field }) => (
                                <FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g., m³, per day" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="rate" render={({ field }) => (
                            <FormItem><FormLabel>Rate (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Item</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function CostSettingsTable({ costSettings, setCostSettings }: { costSettings: CostRate[], setCostSettings: (updater: (items: CostRate[]) => void) => void }) {
    const { toast } = useToast();

    const handleSave = (values: CostSettingValues, id?: string) => {
        if (id) {
            setCostSettings(prev => prev.map(item => item.id === id ? { ...item, ...values } : item));
            toast({ title: "Cost rate updated." });
        } else {
            const newItem: CostRate = { ...values, id: `cost_${Date.now()}` };
            setCostSettings(prev => [newItem, ...prev]);
            toast({ title: "Cost rate added." });
        }
    };

    const handleDelete = (id: string) => {
        setCostSettings(prev => prev.filter(item => item.id !== id));
        toast({ title: "Cost rate removed.", variant: "destructive" });
    };

    const costItemsByCategory = costSettings.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, CostRate[]>);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Market Rate Configuration</CardTitle>
                    <CardDescription>Manage the material, labor, and equipment costs used by the BidWise Estimator AI.</CardDescription>
                </div>
                 <AddEditCostDialog onSave={handleSave}>
                    <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Rate</Button>
                </AddEditCostDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead className="text-right">Rate (OMR)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(costItemsByCategory).map(([category, items]) => (
                            items.map(item => (
                                 <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.category}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell className="text-right font-mono">{item.rate.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AddEditCostDialog item={item} onSave={handleSave}>
                                                <Button variant="ghost" size="icon"><Edit /></Button>
                                            </AddEditCostDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{item.name}".</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
