
'use client';

import AdminDashboardPageClient from './client-page';
import type { Product } from "@/lib/products.schema";
import type { Provider } from "@/lib/providers.schema";
import type { Opportunity } from "@/lib/opportunities.schema";
import type { Service } from "@/lib/services.schema";
import type { Agent, AgentCategory } from "@/lib/agents.schema";

export default function AdminDashboardPage({ 
    initialProducts, 
    initialProviders, 
    initialLeadership, 
    initialStaff, 
    initialAgentCategories, 
    initialOpportunities, 
    initialServices 
}: {
    initialProducts: Product[],
    initialProviders: Provider[],
    initialLeadership: Agent[],
    initialStaff: Agent[],
    initialAgentCategories: AgentCategory[],
    initialOpportunities: Opportunity[],
    initialServices: Service[]
}) {

    return <AdminDashboardPageClient 
        initialProducts={initialProducts}
        initialProviders={initialProviders}
        initialLeadership={initialLeadership}
        initialStaff={initialStaff}
        initialAgentCategories={initialAgentCategories}
        initialOpportunities={initialOpportunities}
        initialServices={initialServices}
    />
}
