
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { AppSettings } from "@/lib/settings";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { store } from "@/lib/global-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";


// This hook now connects to the global store.
export const useSettingsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        settings: data.settings,
        setSettings: (updater: (settings: AppSettings) => AppSettings) => {
            const currentSettings = store.get().settings;
            const newSettings = updater(currentSettings);
            store.set(state => ({ ...state, settings: newSettings }));
        }
    };
};

const SanadPricingSchema = z.object({
  registrationFee: z.coerce.number().min(0),
  monthlyFee: z.coerce.number().min(0),
  yearlyFee: z.coerce.number().min(0),
  lifetimeFee: z.coerce.number().min(0),
  firstTimeDiscountPercentage: z.coerce.number().min(0).max(1),
});

const EditSanadPricingDialog = ({
    settings,
    onSave,
}: {
    settings: AppSettings,
    onSave: (values: z.infer<typeof SanadPricingSchema>) => void,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof SanadPricingSchema>>({
        resolver: zodResolver(SanadPricingSchema),
        defaultValues: settings.sanadOffice,
    });
     useEffect(() => {
        if(isOpen) form.reset(settings.sanadOffice);
    }, [settings, form, isOpen]);

    const onSubmit: SubmitHandler<z.infer<typeof SanadPricingSchema>> = (data) => {
        onSave(data);
        setIsOpen(false);
    };

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Pricing</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Sanad Hub Pricing</DialogTitle>
                    <DialogDescription>
                        Update the subscription fees for new Sanad Office registrations.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="registrationFee" render={({ field }) => (
                            <FormItem><FormLabel>One-time Registration Fee (OMR)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="monthlyFee" render={({ field }) => (
                                <FormItem><FormLabel>Monthly Fee (OMR)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="yearlyFee" render={({ field }) => (
                                <FormItem><FormLabel>Yearly Fee (OMR)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="lifetimeFee" render={({ field }) => (
                            <FormItem><FormLabel>Lifetime Fee (OMR)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="firstTimeDiscountPercentage" render={({ field }) => (
                            <FormItem><FormLabel>First Time Discount (%)</FormLabel><FormControl><Input type="number" step="0.01" min="0" max="1" {...field} /></FormControl><FormMessage /><FormDescription>Enter as a decimal (e.g., 0.6 for 60%).</FormDescription></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Pricing</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


export default function SettingsTable({ settings, setSettings }: { settings: AppSettings, setSettings: (updater: (settings: AppSettings) => AppSettings) => void}) {
    const { toast } = useToast();

    const handleModeChange = (value: 'direct' | 'tender' | 'builtin') => {
        let description = '';
        switch(value) {
            case 'direct':
                description = 'Direct Assignment';
                break;
            case 'tender':
                description = 'Tender to Partners';
                break;
            case 'builtin':
                description = 'Built-in AI Translator';
                break;
        }
        setSettings(prev => ({...prev, translationAssignmentMode: value }));
        toast({ title: "Setting updated.", description: `Translation assignment mode set to ${description}.`});
    };
    
    const handleVoiceChange = (value: boolean) => {
        setSettings(prev => ({...prev, voiceInteractionEnabled: value }));
        toast({ title: "Setting updated.", description: `Voice interaction has been ${value ? 'enabled' : 'disabled'}.`});
    };
    
    const handleSavePricing = (values: z.infer<typeof SanadPricingSchema>) => {
        setSettings(prev => ({
            ...prev,
            sanadOffice: { ...values }
        }));
        toast({ title: "Sanad Hub pricing updated successfully." });
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Operational Settings</CardTitle>
                    <CardDescription>Manage core operational settings for your application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Setting</TableHead>
                                <TableHead>Configuration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        <TableRow>
                            <TableCell>
                                <p className="font-medium">Translation Assignment Mode</p>
                                <p className="text-sm text-muted-foreground">Control how new translation jobs are assigned.</p>
                            </TableCell>
                            <TableCell>
                                <RadioGroup 
                                    value={settings.translationAssignmentMode} 
                                    onValueChange={handleModeChange}
                                    className="gap-3"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="builtin" id="builtin" />
                                        <Label htmlFor="builtin">Built-in AI Translator</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="direct" id="direct" />
                                        <Label htmlFor="direct">Direct Assignment to Partner</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="tender" id="tender" />
                                        <Label htmlFor="tender">Tender to Partner Network</Label>
                                    </div>
                                </RadioGroup>
                            </TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell>
                                <p className="font-medium">Chatbot Voice Interaction</p>
                                <p className="text-sm text-muted-foreground">Globally enable or disable voice input/output on all AI chatbots.</p>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="voice-interaction-switch"
                                        checked={settings.voiceInteractionEnabled}
                                        onCheckedChange={handleVoiceChange}
                                    />
                                    <Label htmlFor="voice-interaction-switch">
                                        {settings.voiceInteractionEnabled ? "Enabled" : "Disabled"}
                                    </Label>
                                </div>
                            </TableCell>
                        </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Sanad Hub Subscription Pricing</CardTitle>
                        <CardDescription>Manage the fees for Sanad Office registrations.</CardDescription>
                    </div>
                    <EditSanadPricingDialog settings={settings} onSave={handleSavePricing} />
                </CardHeader>
                <CardContent>
                    <Table>
                         <TableHeader>
                            <TableRow>
                                <TableHead>Fee Type</TableHead>
                                <TableHead className="text-right">Amount (OMR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>One-time Registration Fee</TableCell>
                                <TableCell className="text-right">{settings.sanadOffice.registrationFee.toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Monthly Subscription Fee</TableCell>
                                <TableCell className="text-right">{settings.sanadOffice.monthlyFee.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Yearly Subscription Fee</TableCell>
                                <TableCell className="text-right">{settings.sanadOffice.yearlyFee.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Lifetime Subscription Fee</TableCell>
                                <TableCell className="text-right">{settings.sanadOffice.lifetimeFee.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>First-time Discount</TableCell>
                                <TableCell className="text-right">{(settings.sanadOffice.firstTimeDiscountPercentage * 100).toFixed(0)}%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
