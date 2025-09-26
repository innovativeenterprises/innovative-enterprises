'use client';

import HeaderClient from "./header-client";
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import type { AppSettings } from "@/lib/settings";

export default function Header({ solutions, industries, aiTools, settings }: {
    solutions: Solution[];
    industries: Industry[];
    aiTools: AiTool[];
    settings: AppSettings | null;
}) {
    return (
      <HeaderClient 
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
        settings={settings}
      />
    );
}
