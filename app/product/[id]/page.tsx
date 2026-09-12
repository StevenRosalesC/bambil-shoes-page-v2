import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";
import { getProductByIdAction, getProductsAction } from "@/actions/products";
import { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Revalidate product page every 60 seconds (1 minute)
export const revalidate = 60;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProductByIdAction(id);
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "/Logo.png";

    return {
      title: `${product.name} - Calzado Artesanal`,
      description:
        product.description ||
        `Descubre ${product.name}, calzado artesanal en cuero legítimo elaborado a mano en Bambil Collao por Bambil Shoes By Dario.`,
      openGraph: {
        title: `${product.name} | Bambil Shoes By Dario`,
        description: product.description,
        images: [{ url: imageUrl, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Bambil Shoes By Dario`,
        description: product.description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Producto no encontrado",
      description: "El calzado que buscas no está disponible en este momento.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product: Product;
  try {
    product = await getProductByIdAction(id);
  } catch {
    notFound();
  }

  // Fetch related products (e.g. from same category)
  let relatedProducts: Product[] = [];
  try {
    const relatedRes = await getProductsAction({
      filterBy: product.categoryId ? "categoryId" : undefined,
      filterValue: product.categoryId,
      limit: 6,
    });
    relatedProducts = (relatedRes.data || []).filter((p) => p.id !== product.id && p.documentId !== product.documentId);
  } catch (err) {
    console.warn("Could not fetch related products:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased">
      {/* Navigation */}
      <Navbar />

      {/* Main Product Container */}
      <main className="flex-grow pt-[84px] md:pt-[100px]">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
    </div>
  );
}
