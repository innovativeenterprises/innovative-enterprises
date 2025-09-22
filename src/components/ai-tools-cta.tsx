
'use client';

import { useAiToolsData } from '@/hooks/use-data-hooks';
import AiToolsCtaClient from './ai-tools-cta-client';

export default function AiToolsCta() {
    const { aiTools } = useAiToolsData();
    return <AiToolsCtaClient aiTools={aiTools} />;
}
