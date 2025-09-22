
'use server';

import { getProducts } from "@/lib/firestore";
import ProductShowcaseClient from './product-showcase-client';

export default async function ProductShowcase() {
    const products = await getProducts();
    return <ProductShowcaseClient products={products} />
}
