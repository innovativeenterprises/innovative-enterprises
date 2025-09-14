
'use client';

import { useState } from 'react';
import SettingsTable from "../settings-table";
import CostSettingsTable from "../operations/cost-settings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

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
                <TabsTrigger value="general">General &amp; API</TabsTrigger>
                <TabsTrigger value="costing">BoQ &amp; Pricing</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-6">
                <SettingsTable />
            </TabsContent>
            <TabsContent value="costing" className="mt-6">
                <CostSettingsTable />
            </TabsContent>
        </Tabs>
    </div>
  );
}
