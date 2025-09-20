'use server';

import HeaderClient from "./header-client";
import { getSettings, getSolutions, getIndustries, getAiTools } from "@/lib/firestore";

export default async function Header() {
    // This component remains a server component but no longer fetches data itself.
    // The data will be available through the client-side store which is hydrated
    // in the root layout. This simplifies the header's role.
    return <HeaderClient />;
}
