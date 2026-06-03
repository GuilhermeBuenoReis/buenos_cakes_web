import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerQueryClient } from "@/lib/get-server-query-client";
import { CategoriesShowcase } from "./_components/categories-showcase";
import { Hero } from "./_components/hero";
import { MostWantedProducts } from "./_components/most-wanted-products";
import {
	dashboardCatalogQueryKeys,
	fetchSafeDashboardCategories,
	fetchSafeDashboardPopularProducts,
} from "./_queries/dashboard-catalog";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const queryClient = getServerQueryClient();
	const [categories, popularProducts] = await Promise.all([
		fetchSafeDashboardCategories(),
		fetchSafeDashboardPopularProducts(),
	]);

	queryClient.setQueryData(dashboardCatalogQueryKeys.categories(), categories);
	queryClient.setQueryData(
		dashboardCatalogQueryKeys.popularProducts(),
		popularProducts,
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="space-y-6">
				<Hero />
				<CategoriesShowcase />
				<MostWantedProducts />
			</div>
		</HydrationBoundary>
	);
}
