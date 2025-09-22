
'use server';

import HeaderClient from "./header-client";
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import type { AppSettings } from '@/lib/settings';

interface HeaderProps {
    settings: AppSettings;
    solutions: Solution[];
    industries: Industry[];
    aiTools: AiTool[];
}

export default async function Header({ settings, solutions, industries, aiTools }: HeaderProps) {
    return (
      <HeaderClient 
        settings={settings}
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
      />
    );
}
