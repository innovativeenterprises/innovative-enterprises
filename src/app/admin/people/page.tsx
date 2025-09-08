
'use client';

import StaffTable from "../staff-table";
import { useStaffData } from '@/hooks/use-global-store-data';

export default function AdminPeoplePage() {
  const staffData = useStaffData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">People & Communities</h1>
            <p className="text-muted-foreground">
                Manage your internal workforce and external community hubs.
            </p>
        </div>

        <StaffTable {...staffData} />
    </div>
  );
}
