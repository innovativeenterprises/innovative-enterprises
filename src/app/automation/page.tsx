
'use client'

import AgentList from "@/components/agent-list";
import { useStaffData } from "@/hooks/use-global-store-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function AutomationPage() {
  const { agentCategories, isClient } = useStaffData();

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Automate Your Business with AI Agents</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our suite of specialized AI agents, designed to handle key business functions, so you can focus on growth and innovation.
          </p>
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            {isClient ? (
                <AgentList categories={agentCategories} />
            ) : (
                <div className="space-y-12">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
