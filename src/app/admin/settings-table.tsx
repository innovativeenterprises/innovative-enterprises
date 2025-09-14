
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit, Upload, Copy, Save, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from "@/components/ui/skeleton";
import { useSettingsData, setSettings } from "@/hooks/use-global-store-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fileToDataURI } from "@/lib/utils";

const SanadPricingSchema = z.object({
  registrationFee: z.coerce.number().min(0),
  monthlyFee: z.coerce.number().min(0),
  yearlyFee: z.coerce.number().min(0),
  lifetimeFee: z.coerce.number().min(0),
  firstTimeDiscountPercentage: z.coerce.number().min(0).max(1),
});

const LegalPricingSchema = z.object({
  b2cFee: z.coerce.number().min(0),
  b2bFee: z.coerce.number().min(0),
  b2gFee: z.coerce.number().min(0),
});

const BrandingSchema = z.object({
  headerImageFile: z.any().optional(),
  footerImageFile: z.any().optional(),
});
type BrandingValues = z.infer<typeof BrandingSchema>;


const WhatsAppSettingsSchema = z.object({
    businessAccountId: z.string().min(1, 'Business Account ID is required'),
    phoneNumberId: z.string().min(1, 'Phone Number ID is required'),
    accessToken: z.string().describe("This is for display only and should be securely stored."),
});
type WhatsAppSettingsValues = z.infer<typeof WhatsAppSettingsSchema>;

const EditBrandingDialog = ({
    settings,
    onSave,
}: {
    settings: AppSettings,
    onSave: (headerUri?: string, footerUri?: string) => void,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [headerPreview, setHeaderPreview] = useState(settings.headerImageUrl);
    const [footerPreview, setFooterPreview] = useState(settings.footerImageUrl);

    const form = useForm<BrandingValues>({
        resolver: zodResolver(BrandingSchema),
        defaultValues: {},
    });

    useEffect(() => {
        if(isOpen) {
            setHeaderPreview(settings.headerImageUrl);
            setFooterPreview(settings.footerImageUrl);
            form.reset();
        }
    }, [settings, isOpen, form]);

    const onSubmit: SubmitHandler<BrandingValues> = async (data) => {
        let headerUri = settings.headerImageUrl;
        if (data.headerImageFile && data.headerImageFile[0]) {
            headerUri = await fileToDataURI(data.headerImageFile[0]);
        }

        let footerUri = settings.footerImageUrl;
        if (data.footerImageFile && data.footerImageFile[0]) {
            footerUri = await fileToDataURI(data.footerImageFile[0]);
        }

        onSave(headerUri, footerUri);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Branding</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Document Branding</DialogTitle>
                    <DialogDescription>
                        Upload a header and footer image for generated PDF documents.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="headerImageFile" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Header Image</FormLabel>
                                <FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                {headerPreview && <Image src={headerPreview} alt="Header Preview" width={200} height={50} className="object-contain border rounded-md p-2 mt-2" />}
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="footerImageFile" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Footer Image</FormLabel>
                                <FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                {footerPreview && <Image src={footerPreview} alt="Footer Preview" width={200} height={50} className="object-contain border rounded-md p-2 mt-2" />}
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Branding</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


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

const EditLegalPricingDialog = ({
    settings,
    onSave,
}: {
    settings: AppSettings,
    onSave: (values: z.infer<typeof LegalPricingSchema>) => void,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof LegalPricingSchema>>({
        resolver: zodResolver(LegalPricingSchema),
        defaultValues: settings.legalAgentPricing,
    });
     useEffect(() => {
        if(isOpen) form.reset(settings.legalAgentPricing);
    }, [settings, form, isOpen]);

    const onSubmit: SubmitHandler<z.infer<typeof LegalPricingSchema>> = (data) => {
        onSave(data);
        setIsOpen(false);
    };

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Fees</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Legal Assistant Fees</DialogTitle>
                    <DialogDescription>
                        Update the analysis fees for each contract type.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="b2cFee" render={({ field }) => (
                            <FormItem><FormLabel>B2C (Business-to-Consumer) Fee (OMR)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="b2bFee" render={({ field }) => (
                            <FormItem><FormLabel>B2B (Business-to-Business) Fee (OMR)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="b2gFee" render={({ field }) => (
                            <FormItem><FormLabel>B2G (Business-to-Government) Fee (OMR)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Fees</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

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

export default function SettingsTable() {
    const { settings, isClient } = useSettingsData();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('general');

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
    
    const handleSaveSanadPricing = (values: z.infer<typeof SanadPricingSchema>) => {
        setSettings(prev => ({
            ...prev,
            sanadOffice: { ...values }
        }));
        toast({ title: "Sanad Hub pricing updated successfully." });
    }
    
    const handleSaveLegalPricing = (values: z.infer<typeof LegalPricingSchema>) => {
        setSettings(prev => ({
            ...prev,
            legalAgentPricing: { ...values }
        }));
        toast({ title: "Legal Assistant fees updated successfully." });
    }

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
    
    const handleSaveBranding = (headerUri?: string, footerUri?: string) => {
        setSettings(prev => ({
            ...prev,
            headerImageUrl: headerUri,
            footerImageUrl: footerUri,
        }));
        toast({ title: "Document branding updated successfully." });
    };

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
    
    const handleSaveWhatsAppSettings = (values: WhatsAppSettings) => {
        setSettings(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, ...values } }));
    };


    return (
         <div className="space-y-8">
            {isClient ? <WhatsAppSettingsForm settings={settings} onSave={handleSaveWhatsAppSettings} /> : <Skeleton className="h-96 w-full"/>}
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
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Document Branding</CardTitle>
                        <CardDescription>Manage the header and footer for generated PDFs.</CardDescription>
                    </div>
                    {isClient && <EditBrandingDialog settings={settings} onSave={handleSaveBranding} />}
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Header Image</Label>
                            <div className="mt-2 p-4 border rounded-md min-h-[100px] flex items-center justify-center bg-muted/50">
                                {settings.headerImageUrl ? <Image src={settings.headerImageUrl} alt="Header Preview" width={240} height={80} className="object-contain" /> : <p className="text-sm text-muted-foreground">No header image set</p>}
                            </div>
                        </div>
                        <div>
                            <Label>Footer Image</Label>
                            <div className="mt-2 p-4 border rounded-md min-h-[100px] flex items-center justify-center bg-muted/50">
                                {settings.footerImageUrl ? <Image src={settings.footerImageUrl} alt="Footer Preview" width={240} height={80} className="object-contain" /> : <p className="text-sm text-muted-foreground">No footer image set</p>}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>AI Legal Assistant Fees</CardTitle>
                        <CardDescription>Manage the fees for contract analysis.</CardDescription>
                    </div>
                    {isClient && <EditLegalPricingDialog settings={settings} onSave={handleSaveLegalPricing} />}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contract Type</TableHead>
                                <TableHead className="text-right">Analysis Fee (OMR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isClient ? (
                                <TableRow>
                                    <TableCell colSpan={2}><Skeleton className="h-10 w-full" /></TableCell>
                                </TableRow>
                            ) : (
                            <>
                                <TableRow>
                                    <TableCell>B2C (Business-to-Consumer)</TableCell>
                                    <TableCell className="text-right">{settings.legalAgentPricing.b2cFee.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>B2B (Business-to-Business)</TableCell>
                                    <TableCell className="text-right">{settings.legalAgentPricing.b2bFee.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>B2G (Business-to-Government)</TableCell>
                                    <TableCell className="text-right">{settings.legalAgentPricing.b2gFee.toFixed(2)}</TableCell>
                                </TableRow>
                            </>
                            )}
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
                    {isClient && <EditSanadPricingDialog settings={settings} onSave={handleSaveSanadPricing} />}
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
                            {!isClient ? (
                                 <TableRow>
                                    <TableCell colSpan={2}><Skeleton className="h-20 w-full" /></TableCell>
                                </TableRow>
                            ) : (
                                <>
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
                                </>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
