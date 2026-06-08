import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/api/products";
import { ProductAboutCard } from "./_components/product-about-card";
import { ProductBreadcrumb } from "./_components/product-breadcrumb";
import { ProductGallery } from "./_components/product-gallery";
import { ProductPurchasePanel } from "./_components/product-purchase-panel";
import { ProductDetailsProvider } from "./_context/product-details-context";

interface ProductDetailsPageProps {
	params: Promise<{
		id: string;
	}>;
}

export const revalidate = 300;
export const dynamic = "force-dynamic";
const RELATED_IMAGES_LIMIT = 4;

export async function generateMetadata({
	params,
}: ProductDetailsPageProps): Promise<Metadata> {
	const { id } = await params;
	const product = await getProductById({
		id,
		revalidateInSeconds: revalidate,
	});

	if (!product) {
		return {
			title: "Produto nao encontrado",
		};
	}

	return {
		title: `${product.name} | Buenos Cakes`,
	};
}

export default async function ProductDetailsPage({
	params,
}: ProductDetailsPageProps) {
	const { id } = await params;
	const [product, products] = await Promise.all([
		getProductById({
			id,
		}),
		getProducts(),
	]);

	if (!product) {
		notFound();
	}

	const relatedImages = products
		.filter(
			(item) => item.category === product.category && item.id !== product.id,
		)
		.slice(0, RELATED_IMAGES_LIMIT);

	return (
		<section className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-rose-50 via-[#fffaf6] to-amber-50 p-4 sm:p-5">
			<div className="pointer-events-none absolute -top-20 -left-16 h-48 w-48 rounded-full bg-rose-200/30 blur-3xl" />
			<div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-amber-200/35 blur-3xl" />

			<div className="relative">
				<ProductDetailsProvider product={product} relatedImages={relatedImages}>
					<div className="relative space-y-4">
						<ProductBreadcrumb />

						<div className="grid gap-5 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
							<div className="space-y-3">
								<ProductGallery />
								<ProductAboutCard />
							</div>

							<ProductPurchasePanel />
						</div>
					</div>
				</ProductDetailsProvider>
			</div>
		</section>
	);
}
