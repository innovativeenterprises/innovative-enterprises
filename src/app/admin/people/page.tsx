
'use server';

import { LeadershipTeam, StaffTeam, DigitalWorkforce } from "@/components/agent-list";
import { getStaffData } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "People Management | Innovative Enterprises",
  description: "Manage your internal human and AI workforce.",
};

export default async function PeoplePage() {
    const staffData = await getStaffData();

    const enabledLeadership = staffData.leadership.filter(member => member.enabled);
    const enabledStaff = staffData.staff.filter(member => member.enabled);
    const enabledAgentCategories = staffData.agentCategories.map(category => ({
        ...category,
        agents: category.agents.filter(agent => agent.enabled)
    })).filter(category => category.agents.length > 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">People & Agents</h1>
            <LeadershipTeam team={enabledLeadership} />
            <StaffTeam team={enabledStaff} />
            <DigitalWorkforce categories={enabledAgentCategories} />
        </div>
    );
}

