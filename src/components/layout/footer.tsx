
'use server';

import FooterClient from "./footer-client";
import { getSettings } from "@/lib/firestore";

export default async function Footer() {
  // This component is now server-side and fetches data directly.
  // The client component will receive this data as props.
  const settings = await getSettings();
  return <FooterClient settings={settings} />;
}
