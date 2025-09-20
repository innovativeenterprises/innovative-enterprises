
'use client';

import HeaderClient from "./header-client";
import type { Solution, Industry, AiTool } from '@/lib/nav-links';

export default function Header({
    solutions,
    industries,
    aiTools
}: {
    solutions: Solution[],
    industries: Industry[],
    aiTools: AiTool[]
}) {

    return <HeaderClient 
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
    />;
}
