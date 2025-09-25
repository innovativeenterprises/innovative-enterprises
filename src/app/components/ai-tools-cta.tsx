
'use server';

import AiToolsCtaClient from "./ai-tools-cta-client";
import type { AiTool } from '@/lib/nav-links';

export default async function AiToolsCta({ aiTools }: { aiTools: AiTool[]}) {
    return <AiToolsCtaClient aiTools={aiTools} />;
}
