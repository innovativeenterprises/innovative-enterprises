
'use client';

import StaffTable, { useStaffData } from "../staff-table";
import ProviderTable, { useProvidersData } from "../provider-table";
import ClientTable, { useClientsData } from "../client-table";

export default function AdminPeoplePage() {
  const staffData = useStaffData();
  const providerData = useProvidersData();
  const clientData = useClientsData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">People & Network</h1>
            <p className="text-muted-foreground">
                Manage your internal staff and external network of providers.
            </p>
        </div>
        <StaffTable {...staffData} />
        <ProviderTable {...providerData} />
        <ClientTable {...clientData} />
    </div>
  );
}
