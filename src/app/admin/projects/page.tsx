
'use server';

import type { Metadata } from 'next';
import { getProducts, getStages } from '@/lib/firestore';
import ProjectsPageClient from './client-page';


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
