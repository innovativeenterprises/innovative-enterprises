
'use client';

import { useState } from 'react';
import { LeadershipTeam, DigitalWorkforce } from "@/components/agent-list";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// Import the data hook from the admin table
import { useStaffData } from '@/app/admin/staff-table';

export default function TeamPage() {
    const { leadership, agentCategories } = useStaffData();

    const enabledLeadership = leadership.filter(member => member.enabled);
    const enabledAgentCategories = agentCategories.map(category => ({
        ...category,
        agents: category.agents.filter(agent => agent.enabled)
    })).filter(category => category.agents.length > 0);


  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Our Team</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Meet the leaders driving our vision and the AI-powered digital workforce that brings it to life.
          </p>
           <Button asChild className="mt-6">
                <Link href="/admin/people">
                    Manage Your Team <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
        <div className="space-y-20 mt-20">
            <LeadershipTeam team={enabledLeadership} />
            <DigitalWorkforce categories={enabledAgentCategories} />
        </div>
      </div>
    </div>
  );
}
