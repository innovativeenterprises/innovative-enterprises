
'use client';

import StaffTable, { useStaffData } from "../staff-table";

export default function AdminPeoplePage() {
  const staffData = useStaffData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">People</h1>
            <p className="text-muted-foreground">
                Manage your internal human and AI workforce.
            </p>
        </div>

        <StaffTable {...staffData} />
    </div>
  );
}
