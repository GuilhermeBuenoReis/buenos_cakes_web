import { getProducts } from "@/api/products";
import { CatalogHeader } from "./_components/catalog-header";
import { ProductsGrid } from "./_components/products-grid";
import { ProductsPagination } from "./_components/products-pagination";
import { Sidebar } from "./_components/sidebar";
import { ProductsCatalogProvider } from "./_context/products-catalog-context";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function ProductsPage() {
	const products = await getProducts({ revalidateInSeconds: revalidate });

	return (
		<ProductsCatalogProvider products={products}>
			<section className="relative min-h-140 overflow-hidden rounded-2xl bg-linear-to-br from-rose-50 via-[#fffaf6] to-amber-50 p-2.5 sm:p-3">
				<div className="pointer-events-none absolute -top-16 -left-12 h-44 w-44 rounded-full bg-rose-200/30 blur-3xl" />
				<div className="pointer-events-none absolute right-0 -bottom-20 h-52 w-52 rounded-full bg-amber-200/30 blur-3xl" />

				<div className="relative grid gap-2.5 lg:grid-cols-[220px_minmax(0,1fr)]">
					<Sidebar />

					<div className="space-y-3 rounded-2xl border border-rose-100/70 bg-white/90 p-3 shadow-[0_14px_36px_-26px_rgba(190,24,93,0.35)] backdrop-blur-sm sm:p-4">
						<CatalogHeader />
						<ProductsGrid />
						<ProductsPagination />
					</div>
				</div>
			</section>
		</ProductsCatalogProvider>
	);
}
