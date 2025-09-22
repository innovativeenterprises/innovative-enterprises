
'use server';

import AiToolsCtaClient from "./ai-tools-cta-client";
import { getAiTools } from "@/lib/firestore";

export default async function AiToolsCta() {
    const aiTools = await getAiTools();
    return (
        <AiToolsCtaClient aiTools={aiTools} />
    )
}
