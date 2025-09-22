
'use server';

import { getAiTools } from "@/lib/firestore";
import AiToolsCtaClient from "./ai-tools-cta-client";

export default async function AiToolsCta() {
    const aiTools = await getAiTools();
    return <AiToolsCtaClient aiTools={aiTools} />;
}
