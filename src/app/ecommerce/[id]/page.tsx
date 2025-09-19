
import { notFound } from 'next/navigation';
import { type Product, initialStoreProducts } from '@/lib/products';
import { type Metadata } from 'next';
import ProductDetailPageClient from './client-page';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return initialStoreProducts.map((product) => ({
    id: String(product.id),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  const product = initialStoreProducts.find(p => p.id === id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Nova Commerce`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Nova Commerce`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const id = parseInt(params.id, 10);
  const product = initialStoreProducts.find(p => p.id === id);
  const relatedProducts = initialStoreProducts.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailPageClient product={product} relatedProducts={relatedProducts} />;
}
