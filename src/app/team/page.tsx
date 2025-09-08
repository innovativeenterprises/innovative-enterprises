
'use client';

import { useState, useEffect } from 'react';
import { LeadershipTeam, StaffTeam, DigitalWorkforce } from "@/components/agent-list";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStaffData } from '@/hooks/use-global-store-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamPage() {
    const { leadership, agentCategories, staff, isClient } = useStaffData();

    const enabledLeadership = leadership.filter(member => member.enabled);
    const enabledStaff = staff.filter(member => member.enabled);
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
                <Link href="/partner">
                    Join Our Network <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
        <div className="space-y-20 mt-20">
          {isClient ? (
            <>
              <LeadershipTeam team={enabledLeadership} />
              <StaffTeam team={enabledStaff} />
              <DigitalWorkforce categories={enabledAgentCategories} />
            </>
          ) : (
             <div className="space-y-12">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-96 w-full" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
