

'use server';

import HeaderClient from "./header-client";
import { getSolutions, getIndustries, getAiTools, getSettings } from '@/lib/firestore';

export default async function Header() {
    const [settings, solutions, industries, aiTools] = await Promise.all([
        getSettings(),
        getSolutions(),
        getIndustries(),
        getAiTools(),
    ]);

    return (
      <HeaderClient 
        settings={settings}
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
      />
    );
}
