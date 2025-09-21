
'use client';

import AdminDashboardPageClient from './dashboard-client';
import type { Product } from "@/lib/products.schema";
import type { Provider } from "@/lib/providers.schema";
import type { Opportunity } from "@/lib/opportunities.schema";
import type { Service } from "@/lib/services.schema";
import type { Agent, AgentCategory } from "@/lib/agents.schema";

export default function AdminDashboardPage({ 
    products, 
    providers, 
    leadership, 
    staff, 
    agentCategories, 
    opportunities, 
    services 
}: {
    products: Product[],
    providers: Provider[],
    leadership: Agent[],
    staff: Agent[],
    agentCategories: AgentCategory[],
    opportunities: Opportunity[],
    services: Service[]
}) {

    return <AdminDashboardPageClient 
        products={products}
        providers={providers}
        leadership={leadership}
        staff={staff}
        agentCategories={agentCategories}
        opportunities={opportunities}
        services={services}
    />
}
