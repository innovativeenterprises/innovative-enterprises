'use client';

import { useState, useMemo } from "react";
import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { generateProjectPlan } from '@/ai/flows/project-inception';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2 } from "lucide-react";
import type { Product } from '@/lib/products.schema';
import type { ProjectStage } from '@/lib/stages';
import { AddEditProductDialog, type ProductValues } from '@/app/admin/product-form-dialog';
import { useProductsData, useStagesData } from "@/hooks/use-data-hooks";

export default function ProjectsPageClient({ initialProducts, initialStages }: { initialProducts: Product[], initialStages: ProjectStage[] }) {
    const { data: products, setData: setProducts } = useProductsData(initialProducts);
    const { data: stages } = useStagesData(initialStages);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    const openDialog = (product?: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleSave = (values: ProductValues, id?: number) => {
        if (id) {
            setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...values } : p)));
            toast({ title: 'Project updated successfully.' });
        } else {
            const newProduct = { ...values, id: Date.now() };
            setProducts(prev => [newProduct, ...prev]);
            toast({ title: 'Project added successfully.' });
        }
    };
    
    const handleGenerateProject = async () => {
        setIsLoading(true);
        toast({ title: 'Generating New Project...', description: 'Navi is analyzing the idea and creating a project plan.' });

        try {
            // In a real scenario, you might get the idea from a form or another source
            const idea = "A B2B marketplace for overstock inventory called StockClear";
            const plan = await generateProjectPlan({ idea });
            
            const newProject: Product = {
                id: Date.now(),
                name: plan.projectName,
                description: plan.summary,
                stage: 'Idea Phase',
                category: "General Platforms & SaaS",
                price: 0,
                rating: 0,
                enabled: false,
                image: `https://picsum.photos/seed/${plan.imagePrompt.replace(' ', '')}/600/400`,
                aiHint: plan.imagePrompt,
            };

            setProducts(prev => [newProject, ...prev]);
            toast({ title: "New Project Generated!", description: `"${plan.projectName}" has been added to the Idea Phase.` });
        } catch(e) {
            console.error(e);
            toast({ title: "Failed to generate project", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage your product development pipeline from idea to launch.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => openDialog()}><PlusCircle className="mr-2 h-4 w-4"/> Add Project</Button>
                    <Button onClick={handleGenerateProject} disabled={isLoading} variant="secondary">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate New Project with AI
                    </Button>
                </div>
            </div>
             <AddEditProductDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                product={selectedProduct}
                onSave={handleSave}
                stages={stages}
            >
                <div />
            </AddEditProductDialog>
            <KanbanBoard initialProducts={products} initialStages={stages} />
        </div>
    )
}
