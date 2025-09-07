

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page has been superseded by the /admin/projects page which uses the new Kanban board.
// This component now just redirects to the new page to avoid broken links or confusion.
export default function OldOpportunitiesPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/projects');
    }, [router]);
    
    return (
        <div className="flex justify-center items-center h-64">
            <p>Redirecting to the new Projects page...</p>
        </div>
    );
}
