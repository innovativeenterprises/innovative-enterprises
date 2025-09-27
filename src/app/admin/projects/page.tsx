

'use client';

import ProjectsPageClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Projects",
    description: "Manage your product development pipeline from idea to launch."
};

export default function ProjectsPage() {
    return <ProjectsPageClient />
}
