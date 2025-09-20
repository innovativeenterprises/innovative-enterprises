
'use server';

import FooterClient from "./footer-client";

export default async function Footer() {
    // This component remains a server component but no longer fetches data.
    // The data is now available in the client-side store.
    return <FooterClient />;
}
