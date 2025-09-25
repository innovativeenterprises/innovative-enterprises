
'use server';

import { getStairspaceListings } from "@/lib/firestore";
import StairspaceTable from "../../stairspace-table";

export default async function StairspaceListingsPage() {
    const initialListings = await getStairspaceListings();
    return <StairspaceTable initialListings={initialListings} />;
}
