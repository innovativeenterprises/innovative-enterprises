'use server';

import { getStoreProducts } from "@/lib/firestore";
import ProductDetailClientPage from "./client-page";
import type { Metadata } from 'next';

export async function generateStaticParams() {
    const products = await getStoreProducts();
    return products.map((product) => ({
        id: String(product.id),
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const products = await getStoreProducts();
  const product = products.find(p => String(p.id) === params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Nova Commerce`,
    description: product.description,
  };
}


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const products = await getStoreProducts();
    const product = products.find(p => String(p.id) === params.id);

    return <ProductDetailClientPage product={product} />;
}
