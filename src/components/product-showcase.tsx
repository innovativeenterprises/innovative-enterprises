
'use server';

import ProductShowcaseClient from './product-showcase-client';
import { getStoreProducts } from '@/lib/firestore';

export default async function ProductShowcase() {
    const products = await getStoreProducts();
    return <ProductShowcaseClient products={products} />;
}
