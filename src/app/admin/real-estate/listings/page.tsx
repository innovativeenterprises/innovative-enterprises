
'use server';

import { getProperties } from "@/lib/firestore";
import PropertyTable from "../property-table";

export default async function RealEstateListingsPage() {
    const initialProperties = await getProperties();
    return <PropertyTable initialProperties={initialProperties} />;
}

