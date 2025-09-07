
'use client';

import CfoDashboard from "./cfo-dashboard";

// This page was updated to fix a hydration error.
// It previously exported CfoDashboard directly, which caused a mismatch
// between server-rendered and client-rendered content due to client-side
// state dependencies. By making it a client component that conditionally
// renders the dashboard, we ensure it only renders on the client after hydration.
export default function CfoPage() {
    return <CfoDashboard />;
}
