'use server';

import StairspaceRequestsClientPage from "./client-page";

export default async function StairspaceRequestsPage() {
    // The client component now fetches data from the global store,
    // so we no longer need to pre-fetch and pass initialRequests.
    return <StairspaceRequestsClientPage />;
}
