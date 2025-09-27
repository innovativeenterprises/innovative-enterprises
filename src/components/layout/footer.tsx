
'use client';

import FooterClient from "./footer-client";
import { useSettingsData } from "@/hooks/use-data-hooks.tsx";

export default function Footer() {
  const { data: settings } = useSettingsData();
  return <FooterClient settings={settings} />;
}
