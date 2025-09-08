
'use client';

import CommunityTable from "../community-table";
import { useCommunitiesData } from '@/hooks/use-global-store-data';

export default function AdminCommunitiesPage() {
  const communityData = useCommunitiesData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Community Hub Management</h1>
            <p className="text-muted-foreground">
                Create, manage, and oversee all community instances on the platform.
            </p>
        </div>

        <CommunityTable {...communityData} />
    </div>
  );
}
