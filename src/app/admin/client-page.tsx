
'use client';

import AdminDashboardPageClient from './client-page';
import { initialProducts } from '@/lib/products';
import { initialProviders } from '@/lib/providers';
import { initialStaffData } from '@/lib/agents';
import { initialOpportunities } from '@/lib/opportunities';
import { initialServices } from '@/lib/services';
import type { Product } from "@/lib/products.schema";
import type { Provider } from "@/lib/providers.schema";
import type { Opportunity } from "@/lib/opportunities.schema";
import type { Service } from "@/lib/services.schema";
import type { Agent, AgentCategory } from "@/lib/agents.schema";

export default function AdminDashboardPage() {

    return <AdminDashboardPageClient 
        initialProducts={initialProducts}
        initialProviders={initialProviders}
        initialLeadership={initialStaffData.leadership}
        initialStaff={initialStaffData.staff}
        initialAgentCategories={initialStaffData.agentCategories}
        initialOpportunities={initialOpportunities}
        initialServices={initialServices}
    />
}
