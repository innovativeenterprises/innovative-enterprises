
'use server';

import { getStairspaceListings } from "@/lib/firestore";
import StairspaceListingsTable from "./stairspace-listings-table";

export default async function StairspaceListingsPage() {
    const initialListings = await getStairspaceListings();
    return <StairspaceListingsTable initialListings={initialListings} />;
}
