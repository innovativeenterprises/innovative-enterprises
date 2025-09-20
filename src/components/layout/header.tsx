
'use server';

import HeaderClient from "./header-client";
import { getSolutions, getIndustries, getAiTools } from "@/lib/firestore";

export default async function Header() {
    const [solutions, industries, aiTools] = await Promise.all([
        getSolutions(),
        getIndustries(),
        getAiTools(),
    ]);

    return <HeaderClient 
        initialSolutions={solutions}
        initialIndustries={industries}
        initialAiTools={aiTools}
    />;
}
