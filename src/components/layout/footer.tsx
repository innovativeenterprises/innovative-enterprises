
'use client';

import { useStore } from "@/hooks/use-data-hooks";
import FooterClient from "./footer-client";

export default function Footer() {
    const { state } = useStore();

    const appState = {
        products: state.products,
        services: state.services,
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
        settings: state.settings,
    };
    
  return <FooterClient initialAppState={appState as any}/>;
}
