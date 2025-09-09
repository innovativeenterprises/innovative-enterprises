
'use client';

import PropertyTable from "../property-table";
import { usePropertiesData } from "@/hooks/use-global-store-data";
import StairspaceTable from "../stairspace-table";
import { useStairspaceData } from "@/hooks/use-global-store-data";

export default function AdminRealEstatePage() {
  const propertyData = usePropertiesData();
  const stairspaceData = useStairspaceData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Real Estate Management</h1>
            <p className="text-muted-foreground">
                Manage property listings for all real estate technology platforms.
            </p>
        </div>

        <PropertyTable {...propertyData} />
        <StairspaceTable {...stairspaceData} />
    </div>
  );
}
