

import AgentList from "@/components/agent-list";
import { initialStaffData } from "@/lib/agents.schema";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Business Process Automation",
  description: "Explore our suite of specialized AI agents, designed to handle key business functions from legal analysis to marketing, so you can focus on growth and innovation.",
};


export default async function AutomationPage() {
  const { agentCategories } = initialStaffData;

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Automate Your Business with AI Agents</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our suite of specialized AI agents, designed to handle key business functions, so you can focus on growth and innovation.
          </p>
           <Button asChild className="mt-6">
                <Link href="/team">
                    Meet The Full Team (Human & AI) <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            <AgentList categories={agentCategories} />
        </div>
      </div>
    </div>
  );
}
