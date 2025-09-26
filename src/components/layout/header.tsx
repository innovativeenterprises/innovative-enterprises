
'use client';

import HeaderClient from "./header-client";
import { useSolutionsData, useIndustriesData, useAiToolsData, useSettingsData } from '@/hooks/use-data-hooks';

export default function Header() {
    const { data: solutions } = useSolutionsData();
    const { data: industries } = useIndustriesData();
    const { data: aiTools } = useAiToolsData();
    const { data: settings } = useSettingsData();

    return (
      <HeaderClient 
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
        settings={settings}
      />
    );
}
