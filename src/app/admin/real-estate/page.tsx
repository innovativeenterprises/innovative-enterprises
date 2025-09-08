

'use client';

import PropertyTable from "@/app/admin/property-table";
import { usePropertiesData } from "@/hooks/use-global-store-data";

export default function AdminRealEstatePage() {
  const propertyData = usePropertiesData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Real Estate Management</h1>
            <p className="text-muted-foreground">
                Manage property listings for the Smart Listing platform.
            </p>
        </div>

        <PropertyTable {...propertyData} />
    </div>
  );
}

