'use server';

import { getServices } from "@/lib/firestore";
import HeaderClient from "./header-client";
import { initialSettings } from '@/lib/settings';

export default async function Header() {
    // This is now a server component. We can fetch data here.
    const services = await getServices();
    const settings = initialSettings; // In a real app, this would also be fetched
    
    const solutionsByCategory = services.reduce((acc, service) => {
        const category = service.category || 'Other';
        if(!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<string, any[]>);

    return <HeaderClient 
        navLinks={[]} // Pass any server-fetched nav links here
        settings={settings}
        solutionsByCategory={solutionsByCategory}
        industriesByCategory={[]} // Pass any server-fetched industry data here
    />;
}
