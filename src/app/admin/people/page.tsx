

import StaffTable from "@/app/admin/staff-table";
import { initialStaffData } from "@/lib/agents.schema";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "People Management | Admin Dashboard",
  description: "Manage your internal human and AI workforce.",
};


export default async function AdminPeoplePage() {
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
