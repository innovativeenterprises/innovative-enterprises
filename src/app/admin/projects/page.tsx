
'use client';

import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, GripVertical } from 'lucide-react';
import { generateProjectPlan } from '@/ai/flows/project-inception';
import { generateImage } from '@/ai/flows/image-generator';
import type { Product } from '@/lib/products';
import { useProductsData } from '../product-table';
import { useProjectStagesData } from '../stage-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { DndContext, useSensor, useSensors, PointerSensor, closestCorners, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddEditProductDialog, type ProductValues } from './product-form-dialog';

const FormSchema = z.object({
  idea: z.string().min(10, 'Please describe your idea in at least 10 characters.'),
});
type FormValues = z.infer<typeof FormSchema>;


const ProductCard = ({ product, onEdit }: { product: Product; onEdit: (product: Product) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
        id: product.id,
        data: {
            type: 'Product',
            product,
        }
     });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="mb-4 group cursor-pointer" onClick={() => onEdit(product)}>
                <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                        <div {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="cursor-grab h-8 w-8 -ml-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover"/>
                        </div>
                        <div className="flex-grow">
                             <p className="font-semibold text-sm leading-tight group-hover:text-primary">{product.name}</p>
                             <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const StageColumn = ({ stage, products, onEditProduct }: { stage: any, products: Product[], onEditProduct: (product: Product) => void }) => {
    const { setNodeRef } = useSortable({
        id: stage.name,
        data: {
            type: 'Stage',
            stage,
        }
    });
    
    return (
        <div ref={setNodeRef} className="flex-shrink-0 w-[300px]">
            <Card className="bg-muted/50">
                <CardHeader className="p-4">
                    <CardTitle className="text-base">{stage.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 min-h-[200px]">
                     <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} onEdit={onEditProduct} />
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    )
}


export default function ProjectsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    
    const { products, setProducts } = useProductsData();
    const { stages } = useProjectStagesData();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: { idea: '' },
    });
    
    const productsByStage = useMemo(() => {
        const grouped: Record<string, Product[]> = {};
        stages.forEach(stage => {
            grouped[stage.name] = [];
        });
        products.forEach(product => {
            const stageName = product.stage || 'Idea Phase';
            if (!grouped[stageName]) {
                grouped[stageName] = [];
            }
            grouped[stageName].push(product);
        });
        return grouped;
    }, [products, stages]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }));

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleSaveProduct = (values: ProductValues, id?: number) => {
        if (id) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
            toast({ title: "Project updated successfully." });
        } else {
           // This case is handled by project inception
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }

        const activeProduct = products.find(p => p.id === active.id);
        const overStageName = over.data.current?.type === 'Stage' 
            ? over.data.current.stage.name 
            : products.find(p => p.id === over.id)?.stage;

        if (activeProduct && overStageName && activeProduct.stage !== overStageName) {
            setProducts(prev => 
                prev.map(p => p.id === active.id ? { ...p, stage: overStageName } : p)
            );
            toast({
                title: "Project Stage Updated",
                description: `${activeProduct.name} moved to ${overStageName}.`
            })
        }
    }
    
    const handleProjectInception: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        toast({ title: "Generating Project Plan...", description: "Navi is analyzing your idea. This may take a moment." });
        
        try {
            const plan = await generateProjectPlan({ idea: data.idea });
            toast({ title: "Plan Generated!", description: "Now creating a project image..." });

            const imageUrl = await generateImage({ prompt: plan.imagePrompt });
            
            const newProduct: Product = {
                id: (products.length > 0 ? Math.max(...products.map(p => p.id)) : 0) + 1,
                name: plan.projectName,
                description: plan.summary,
                stage: 'Idea Phase',
                category: 'Uncategorized',
                price: 0,
                rating: 0,
                enabled: false, // Start as disabled
                image: imageUrl,
                aiHint: plan.imagePrompt,
            };

            setProducts(prev => [newProduct, ...prev]);
            
            toast({
                title: "Project Created Successfully!",
                description: `"${plan.projectName}" has been added to the Idea Phase.`,
                variant: 'default'
            });

            form.reset();

        } catch (error) {
            console.error("Project inception failed:", error);
            toast({ title: "Error", description: "Failed to create the new project. Please try again.", variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Projects</h1>
                <p className="text-muted-foreground">
                    Create new projects and manage your product development pipeline.
                </p>
            </div>
            
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div className="flex items-center gap-3">
                            <Wand2 className="h-5 w-5 text-primary" />
                             <h2 className="text-xl font-semibold">Project Inception</h2>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Card className="border-t-0 rounded-t-none">
                            <CardHeader>
                                <CardTitle>Submit a New Idea</CardTitle>
                                <CardDescription>Describe your new project or product idea below. Navi, our AI Innovation Agent, will analyze it and generate a structured project plan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleProjectInception)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="idea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Idea</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="e.g., A mobile app that uses AI to create personalized travel itineraries based on a user's budget and interests."
                                                            rows={5}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Generating...</> : <><Wand2 className="mr-2 h-4 w-4" />Generate Project Plan</>}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


            <div>
                <h2 className="text-2xl font-bold mb-4">Project Pipeline</h2>
                 <div className="overflow-x-auto pb-4">
                    <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCorners}>
                        <div className="flex gap-6">
                            {stages.map(stage => (
                                <StageColumn
                                    key={stage.id}
                                    stage={stage}
                                    products={productsByStage[stage.name] || []}
                                    onEditProduct={handleEditProduct}
                                />
                            ))}
                        </div>
                    </DndContext>
                </div>
            </div>
            
            <AddEditProductDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                product={selectedProduct}
                onSave={handleSaveProduct}
                stages={stages}
            >
                <div />
            </AddEditProductDialog>
        </div>
    );
}
