
'use server';

import type { Metadata } from 'next';
import { getProducts, getStages } from '@/lib/firestore';
import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, Loader2 } from "lucide-react";
import { generateProjectPlan } from '@/ai/flows/project-inception';
import { useToast } from "@/hooks/use-toast";
import type { Product } from '@/lib/products.schema';
import { AddEditProductDialog, type ProductValues } from '@/app/admin/product-form-dialog';
import { ProjectsPageClient } from './client-page';


export const metadata: Metadata = {
    title: "Projects",
    description: "Manage your product development pipeline."
};

export default async function ProjectsPage() {
    const [products, stages] = await Promise.all([
        getProducts(),
        getStages(),
    ]);

    return (
        <ProjectsPageClient
            initialProducts={products}
            initialStages={stages}
        />
    )
}
