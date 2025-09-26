
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppSettingsSchema, type AppSettings } from '@/lib/settings';
import { useSetStore, useSettingsData } from '@/hooks/use-data-hooks';
import ThemeGenerator from '@/app/admin/operations/theme-generator';
import { Switch } from '@/components/ui/switch';
import CostSettingsTable from './cost-settings-table';

export default function AdminSettingsClientPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { data: settings, setData: setSettings } = useSettingsData();
    const { toast } = useToast();

    const form = useForm<AppSettings>({
        resolver: zodResolver(AppSettingsSchema),
        defaultValues: settings || undefined,
    });

    const onSubmit: SubmitHandler<AppSettings> = async (data) => {
        setIsLoading(true);
        setSettings(() => data);
        toast({ title: "Settings Saved", description: "Your application settings have been updated." });
        setIsLoading(false);
    };

    if (!settings) {
        return <div>Loading settings...</div>;
    }

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><SettingsIcon className="h-8 w-8"/> Settings</h1>
                <p className="text-muted-foreground">
                   Manage core application settings, pricing, market rates, and theme configurations.
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="translationAssignmentMode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Translation Assignment Mode</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="direct">Direct Assignment</SelectItem>
                                                    <SelectItem value="tender">Tender to Partners</SelectItem>
                                                    <SelectItem value="builtin">Built-in AI Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Choose how new translation tasks are assigned.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-4">
                                     <FormField control={form.control} name="chatWidgetEnabled" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Enable Chat Widget</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                    )}/>
                                      <FormField control={form.control} name="voiceInteractionEnabled" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Enable Voice Interaction</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                    )}/>
                                </div>
                             </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Sanad Office Partnership Fees</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                             <FormField control={form.control} name="sanadOffice.registrationFee" render={({ field }) => (
                                <FormItem><FormLabel>Registration Fee (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="sanadOffice.monthlyFee" render={({ field }) => (
                                <FormItem><FormLabel>Monthly Fee (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="sanadOffice.yearlyFee" render={({ field }) => (
                                <FormItem><FormLabel>Yearly Fee (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="sanadOffice.lifetimeFee" render={({ field }) => (
                                <FormItem><FormLabel>Lifetime Fee (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </CardContent>
                    </Card>
                    
                    <div className="flex justify-end sticky bottom-4 z-10">
                        <Button type="submit" disabled={isLoading} size="lg">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                            Save Settings
                        </Button>
                    </div>
                </form>
            </Form>
            
            <CostSettingsTable />
            <ThemeGenerator />
        </div>
    );
}
