
'use client';

import StaffTable, { useStaffData } from "../staff-table";
import ProviderTable, { useProvidersData } from "../provider-table";
import ClientTable, { useClientsData } from "../client-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function AdminPeoplePage() {
  const staffData = useStaffData();
  const providerData = useProvidersData();
  const clientData = useClientsData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">People & Network</h1>
            <p className="text-muted-foreground">
                Manage your internal staff, external network of providers, and client-facing content.
            </p>
        </div>

        <Tabs defaultValue="staff">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="staff">Staff Management</TabsTrigger>
                <TabsTrigger value="providers">Provider Network</TabsTrigger>
                <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
            </TabsList>
            <TabsContent value="staff">
                <StaffTable {...staffData} />
            </TabsContent>
            <TabsContent value="providers">
                <ProviderTable {...providerData} />
            </TabsContent>
            <TabsContent value="clients">
                 <ClientTable {...clientData} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
