

'use client';

import SettingsTable, { useSettingsData } from "../settings-table";
import { useCostSettingsData } from "../cost-settings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AdminSettingsPage() {
  
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
                Manage core operational settings for your application.
            </p>
        </div>
        <SettingsTable />
    </div>
  );
}
