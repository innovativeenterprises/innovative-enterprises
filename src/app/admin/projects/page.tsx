
'use server';

import type { Metadata } from 'next';
import ProjectsPageClient from './client-page';


export const metadata: Metadata = {
    title: "Projects",
    description: "Manage your product development pipeline."
};

export default async function ProjectsPage() {
    return (
        <ProjectsPageClient />
    )
}
