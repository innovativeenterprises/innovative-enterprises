
'use client';

import StaffTable, { useStaffData } from "../staff-table";
import CommunityTable, { useCommunitiesData } from "../community-table";

export default function AdminPeoplePage() {
  const staffData = useStaffData();
  const communityData = useCommunitiesData();

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
