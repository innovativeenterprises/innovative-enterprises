
'use server';

import { getProducts, getServices, getStaffData } from '@/lib/firestore';
import { initialSettings } from '@/lib/settings';
import FooterClient from './footer-client';
import type { AppState } from '@/lib/global-store';


export default async function Footer() {
    const [products, services, staffData] = await Promise.all([
        getProducts(),
        getServices(),
        getStaffData(),
    ]);

    const initialAppState = {
        products,
        services,
        leadership: staffData.leadership,
        staff: staffData.staff,
        agentCategories: staffData.agentCategories,
        settings: initialSettings,
    } as unknown as AppState;

  return <FooterClient initialAppState={initialAppState}/>;
}
