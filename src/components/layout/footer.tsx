'use server';

// This is now a simple wrapper as all data fetching happens in the root layout.
import FooterClient from './footer-client';

export default async function Footer() {
  return <FooterClient />;
}
