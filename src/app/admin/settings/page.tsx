
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { AppSettings, WhatsAppSettings } from "@/lib/settings";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Save, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from "@/components/ui/skeleton";
import { useSettingsData } from "@/hooks/use-global-store-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";


const WhatsAppSettingsSchema = z.object({
    businessAccountId: z.string().min(1, 'Business Account ID is required'),
    phoneNumberId: z.string().min(1, 'Phone Number ID is required'),
    accessToken: z.string().describe("This is for display only and should be securely stored."),
});
type WhatsAppSettingsValues = z.infer<typeof WhatsAppSettingsSchema>;

const WhatsAppSettingsForm = ({ settings, onSave }: { settings: AppSettings, onSave: (values: WhatsAppSettings) => void }) => {
    const { toast } = useToast();
    const form = useForm<WhatsAppSettingsValues>({
        resolver: zodResolver(WhatsAppSettingsSchema),
        defaultValues: {
            ...settings.whatsapp,
            accessToken: '******************', // Mask the token
        }
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to Clipboard' });
    }

    const onSubmit: SubmitHandler<WhatsAppSettingsValues> = (data) => {
        onSave({
            ...data,
            // Never save the masked value, keep the real one from settings.
            accessToken: settings.whatsapp.accessToken,
        });
        toast({ title: "WhatsApp Settings Saved" });
    }

    // In a real app, the webhook URL would be dynamically generated based on the deployment environment.
    const webhookUrl = "https://your-deployed-app-url.com/api/genkit/flow/whatsappWebhook";
    const webhookVerifyToken = "ameen_verify_token";

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> WhatsApp Integration</CardTitle>
                        <CardDescription>Manage your Meta Business API credentials and webhook settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert>
                            <AlertTitle>Webhook Configuration</AlertTitle>
                            <AlertDescription>
                                To receive messages, you must configure a webhook in your Meta for Developers App settings. Use the values below.
                            </AlertDescription>
                            <div className="space-y-2 mt-4">
                                <div className="flex items-center justify-between">
                                    <Label>Callback URL</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => copyToClipboard(webhookUrl)}><Copy className="mr-2 h-3 w-3"/>Copy</Button>
                                </div>
                                <Input readOnly value={webhookUrl} />

                                <div className="flex items-center justify-between">
                                    <Label>Verify Token</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => copyToClipboard(webhookVerifyToken)}><Copy className="mr-2 h-3 w-3"/>Copy</Button>
                                </div>
                                <Input readOnly value={webhookVerifyToken} />
                            </div>
                        </Alert>
                         <FormField control={form.control} name="businessAccountId" render={({ field }) => (
                            <FormItem><FormLabel>Business Account ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phoneNumberId" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="accessToken" render={({ field }) => (
                            <FormItem><FormLabel>Access Token</FormLabel><FormControl><Input {...field} readOnly /></FormControl><FormDescription>This token is stored securely as an environment variable and cannot be changed from here.</FormDescription><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit"><Save className="mr-2 h-4 w-4"/> Save WhatsApp Settings</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

const GeneralSettings = () => {
    const { settings, setSettings, isClient } = useSettingsData();
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
    
    const handleVoiceChange = (enabled: boolean) => {
        setSettings(prev => ({...prev, voiceInteractionEnabled: enabled }));
        toast({ title: "Setting updated.", description: `Voice interaction has been ${enabled ? 'enabled' : 'disabled'}.`});
    };
    
    const handleVatEnabledChange = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, vat: { ...prev.vat, enabled }}));
        toast({ title: `VAT has been ${enabled ? 'enabled' : 'disabled'}.` });
    }
    
    const handleVatRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRate = parseFloat(e.target.value);
        if(!isNaN(newRate)) {
            setSettings(prev => ({...prev, vat: {...prev.vat, rate: newRate / 100 }}));
            toast({ title: `VAT rate updated to ${newRate}%.` });
        }
    }
    
    const handleServicesMenuColumnChange = (value: string) => {
        const numValue = parseInt(value, 10);
        setSettings(prev => ({ ...prev, servicesMenuColumns: numValue as 1|2|3|4 }));
        toast({ title: `Services menu layout updated to ${numValue} columns.` });
    };

    const handleAiToolsMenuColumnChange = (value: string) => {
        const numValue = parseInt(value, 10);
        setSettings(prev => ({ ...prev, aiToolsMenuColumns: numValue as 1|2|3|4 }));
        toast({ title: `AI Tools menu layout updated to ${numValue} columns.` });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Operational & Layout Settings</CardTitle>
                <CardDescription>Manage core operational and visual settings for your application.</CardDescription>
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
                        {!isClient ? (
                            <TableRow>
                                <TableCell colSpan={2}><Skeleton className="h-24 w-full" /></TableCell>
                            </TableRow>
                        ) : (
                            <>
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
                                <TableRow>
                                    <TableCell>
                                        <p className="font-medium">Value-Added Tax (VAT)</p>
                                        <p className="text-sm text-muted-foreground">Enable or disable VAT on all commercial services and invoices.</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="vat-enabled-switch"
                                                    checked={settings.vat.enabled}
                                                    onCheckedChange={handleVatEnabledChange}
                                                />
                                                <Label htmlFor="vat-enabled-switch">
                                                    {settings.vat.enabled ? "Enabled" : "Disabled"}
                                                </Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor="vat-rate-input">Rate:</Label>
                                                <Input
                                                    id="vat-rate-input"
                                                    type="number"
                                                    defaultValue={settings.vat.rate * 100}
                                                    onBlur={handleVatRateChange}
                                                    disabled={!settings.vat.enabled}
                                                    className="w-24"
                                                    min="0"
                                                    step="0.1"
                                                />
                                                <span className="text-muted-foreground">%</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <p className="font-medium">Services Menu Layout</p>
                                        <p className="text-sm text-muted-foreground">Number of columns in the 'Services' header dropdown.</p>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={String(settings.servicesMenuColumns)}
                                            onValueChange={handleServicesMenuColumnChange}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 Column</SelectItem>
                                                <SelectItem value="2">2 Columns</SelectItem>
                                                <SelectItem value="3">3 Columns</SelectItem>
                                                <SelectItem value="4">4 Columns</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <p className="font-medium">AI Tools Menu Layout</p>
                                        <p className="text-sm text-muted-foreground">Number of columns in the 'AI Tools' header dropdown.</p>
                                    </TableCell>
                                    <TableCell>
                                    <Select
                                            value={String(settings.aiToolsMenuColumns)}
                                            onValueChange={handleAiToolsMenuColumnChange}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 Column</SelectItem>
                                                <SelectItem value="2">2 Columns</SelectItem>
                                                <SelectItem value="3">3 Columns</SelectItem>
                                                <SelectItem value="4">4 Columns</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};


export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const { settings, setSettings, isClient } = useSettingsData();

  const handleSaveWhatsAppSettings = (values: WhatsAppSettings) => {
      setSettings(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, ...values } }));
  };

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
                Manage core operational settings for your application.
            </p>
        </div>
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General & Layout</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-6">
                <GeneralSettings />
            </TabsContent>
            <TabsContent value="integrations" className="mt-6">
                {isClient ? <WhatsAppSettingsForm settings={settings} onSave={handleSaveWhatsAppSettings} /> : <Skeleton className="h-96 w-full"/>}
            </TabsContent>
        </Tabs>
    </div>
  );
}
