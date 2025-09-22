
'use server';

import HeaderClient from "./header-client";
import type { Solution, Industry, AiTool } from "@/lib/nav-links";
import type { AppSettings } from "@/lib/settings";

interface HeaderProps {
    solutions: Solution[];
    industries: Industry[];
    aiTools: AiTool[];
    settings: AppSettings;
}

export default async function Header({ solutions, industries, aiTools, settings }: HeaderProps) {
    return (
      <HeaderClient 
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
        settings={settings}
      />
    );
}
