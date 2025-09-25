
'use server';

import ProductShowcaseClient from './product-showcase-client';
import type { Product } from '@/lib/products.schema';

export default async function ProductShowcase({ products }: { products: Product[] }) {
    return <ProductShowcaseClient products={products} />;
}
