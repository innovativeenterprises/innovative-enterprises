
'use client';

import StaffTable from "@/app/admin/staff-table";
import { initialStaffData } from "@/lib/agents";

export default function AdminPeoplePage() {
  // Data is fetched on the server and passed to the client component.
  const { leadership, staff, agentCategories } = initialStaffData;

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">People Management</h1>
            <p className="text-muted-foreground">
                Manage your internal human and AI workforce.
            </p>
        </div>

        <StaffTable 
            initialLeadership={leadership}
            initialStaff={staff}
            initialAgentCategories={agentCategories}
        />
    </div>
  );
}
