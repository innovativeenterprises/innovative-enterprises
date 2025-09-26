'use server';

import FooterClient from "./footer-client";
import { getSettings } from "@/lib/firestore";

export default async function Footer() {
  const settings = await getSettings();
  return <FooterClient settings={settings} />;
}
