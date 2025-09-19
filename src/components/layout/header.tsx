
'use server';

import HeaderClient from "./header-client";
import { getSettings, getSolutions, getIndustries, getAiTools } from "@/lib/firestore";

export default async function Header() {
    const navLinks = [
        { href: "/about", label: "About" },
    ];
    
    const settings = await getSettings();
    const solutions = await getSolutions();
    const industries = await getIndustries();
    const aiTools = await getAiTools();

    const solutionsByCategory = {
        "SaaS Platforms": solutions,
        "AI Tools": aiTools,
    }

    const industriesByCategory = {
        "Industries": industries,
    }
    
    return <HeaderClient 
        navLinks={navLinks}
        settings={settings}
        solutionsByCategory={solutionsByCategory}
        industriesByCategory={industriesByCategory}
    />;
}
