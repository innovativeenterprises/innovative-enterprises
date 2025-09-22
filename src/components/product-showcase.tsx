
'use server';

import { getStoreProducts } from "@/lib/firestore";
import ProductShowcaseClient from "./product-showcase-client";

export default async function ProductShowcase() {
  const products = await getStoreProducts();

  return (
    <ProductShowcaseClient products={products} />
  );
}
