'use client';

import FooterClient from "./footer-client";
import type { AppSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: AppSettings | null }) {
  return <FooterClient settings={settings} />;
}
