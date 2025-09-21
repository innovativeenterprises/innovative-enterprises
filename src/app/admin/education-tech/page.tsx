

'use server';

import { getProducts } from '@/lib/firestore';
import ConstructionTechClientPage from '../construction-tech/page';
import type { Product } from '@/lib/products.schema';

const ProductCard = ({ product }: { product: Product }) => {
    // This is a placeholder, as the original component cannot be imported directly.
    // In a real scenario, you'd likely have a shared component.
    return <div>{product.name}</div>
}

export default async function EducationTechPage() {
    const products = await getProducts();
    const edutechProducts = products.filter(p => p.category === "Education Tech" && p.enabled);
    return <ConstructionTechClientPage initialProducts={edutechProducts} />;
}
    
