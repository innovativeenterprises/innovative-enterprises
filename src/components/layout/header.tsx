
'use server';

import HeaderClient from "./header-client";
import { getSolutions, getIndustries, getAiTools, getSettings } from '@/lib/firestore';

export default async function Header() {
    const [solutions, industries, aiTools, settings] = await Promise.all([
        getSolutions(),
        getIndustries(),
        getAiTools(),
        getSettings(),
    ]);

    return (
      <HeaderClient 
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
        settings={settings}
      />
    );
}
