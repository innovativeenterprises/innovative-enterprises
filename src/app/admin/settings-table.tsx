
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { AppSettings } from "@/lib/settings";
import { initialSettings } from "@/lib/settings";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// This component is now the source of truth for settings data
export const useSettingsData = () => {
    const [settings, setSettings] = useState<AppSettings>(initialSettings);
    return { settings, setSettings };
};


export default function SettingsTable({ settings, setSettings }: { settings: AppSettings, setSettings: (settings: AppSettings) => void}) {
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

    return (
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
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
