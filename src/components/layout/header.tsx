
'use server';

import HeaderClient from "./header-client";
import { getAiTools, getIndustries, getSolutions } from "@/lib/firestore";

export default async function Header() {
    const [solutions, industries, aiTools] = await Promise.all([
        getSolutions(),
        getIndustries(),
        getAiTools(),
    ]);
    
    return <HeaderClient 
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
    />;
}
