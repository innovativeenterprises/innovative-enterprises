
'use server';

import ProjectsPageClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Projects Management",
    description: "Manage your product development pipeline from idea to launch."
};

export default async function ProjectsPage() {
    return <ProjectsPageClient />
}
