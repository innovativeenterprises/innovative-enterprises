
'use server';

import FooterClient from './footer-client';
import { getStaffData, getServices, getSettings, getProducts } from '@/lib/firestore';

export default async function Footer() {
    const [staffData, services, settings, products] = await Promise.all([
        getStaffData(),
        getServices(),
        getSettings(),
        getProducts()
    ]);
  
  return (
    <FooterClient 
        staffData={staffData}
        services={services}
        settings={settings}
        products={products}
    />
  );
}
