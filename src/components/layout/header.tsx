'use server';

// This is now a simple wrapper as all data fetching happens in the root layout.
import HeaderClient from "./header-client";

export default async function Header() {
    return <HeaderClient />;
}
