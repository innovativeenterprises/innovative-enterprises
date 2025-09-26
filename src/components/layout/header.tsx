
'use client';

import HeaderClient from "./header-client";
import { useSolutionsData, useIndustriesData, useAiToolsData, useSettingsData } from '@/hooks/use-data-hooks';

export default function Header() {
    const { data: solutions, isClient: isSolutionsClient } = useSolutionsData();
    const { data: industries, isClient: isIndustriesClient } = useIndustriesData();
    const { data: aiTools, isClient: isAiToolsClient } = useAiToolsData();
    const { data: settings, isClient: isSettingsClient } = useSettingsData();
    
    const isClient = isSolutionsClient && isIndustriesClient && isAiToolsClient && isSettingsClient;
    
    // Pass empty arrays if data is not yet available to prevent errors
    return (
      <HeaderClient 
        solutions={isClient ? solutions : []}
        industries={isClient ? industries : []}
        aiTools={isClient ? aiTools : []}
        settings={isClient ? settings : null}
      />
    );
}
