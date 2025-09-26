
'use client';

import { LeadershipTeam, StaffTeam, DigitalWorkforce } from "@/components/agent-list";
import type { Metadata } from 'next';
import { useStaffData } from '@/hooks/use-data-hooks';

export const metadata: Metadata = {
  title: "People Management | Innovative Enterprises",
  description: "Manage your internal human and AI workforce.",
};

export default function PeoplePage() {
    const { leadership, staff, agentCategories } = useStaffData();

    const enabledLeadership = leadership.filter(member => member.enabled);
    const enabledStaff = staff.filter(member => member.enabled);
    const enabledAgentCategories = agentCategories.map(category => ({
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

