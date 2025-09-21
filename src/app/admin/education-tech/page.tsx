

'use server';

import { getProducts } from '@/lib/firestore';
import ConstructionTechAdminPage from '../construction-tech/page';


export default async function EducationTechPage() {
    const products = await getProducts();
    const edutechProducts = products.filter(p => p.category === "Education Tech" && p.enabled);
    return <ConstructionTechAdminPage initialProducts={edutechProducts} />;
}

    