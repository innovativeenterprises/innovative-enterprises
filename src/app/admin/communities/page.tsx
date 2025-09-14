
'use client';

import CommunityTable from "@/app/admin/community-table";

export default function AdminCommunitiesPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Community Hub Management</h1>
            <p className="text-muted-foreground">
                Create, manage, and oversee all community instances on the platform.
            </p>
        </div>

        <CommunityTable />
    </div>
  );
}
