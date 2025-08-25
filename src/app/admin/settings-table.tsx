
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { AppSettings } from "@/lib/settings";
import { initialSettings } from "@/lib/settings";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SettingsTable() {
    const [settings, setSettings] = useState<AppSettings>(initialSettings);
    const { toast } = useToast();

    const handleModeChange = (value: 'direct' | 'tender') => {
        setSettings(prev => ({...prev, translationAssignmentMode: value }));
        toast({ title: "Setting updated.", description: `Translation assignment mode set to ${value === 'direct' ? 'Direct Assignment' : 'Tender'}.`});
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
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="direct" id="direct" />
                                        <Label htmlFor="direct">Direct Assignment</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="tender" id="tender" />
                                        <Label htmlFor="tender">Tender to Partners</Label>
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
