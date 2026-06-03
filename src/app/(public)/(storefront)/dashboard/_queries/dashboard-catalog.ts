import { queryOptions } from "@tanstack/react-query";
import type {
	ListActiveCategoriesResponse,
	ListProductsByPopularityResponse,
} from "@/api/backend/catalog";
import {
	listActiveCategories,
	listActiveProducts,
	listProductsByPopularity,
} from "@/api/backend/catalog";

export const DASHBOARD_PAGE = 1;
export const DASHBOARD_ITEMS_LIMIT = 4;
export const DASHBOARD_STALE_TIME_MS = 1000 * 60 * 5;

export const emptyDashboardCategoriesResponse = {
	categories: [],
} satisfies ListActiveCategoriesResponse;

export const emptyDashboardPopularProductsResponse = {
	products: [],
} satisfies ListProductsByPopularityResponse;

export const dashboardCatalogQueryKeys = {
	categories: () => ["dashboard", "categories", { page: DASHBOARD_PAGE }],
	popularProducts: () => [
		"dashboard",
		"products",
		"popularity",
		{ page: DASHBOARD_PAGE },
	],
} as const;

export async function fetchDashboardCategories(signal?: AbortSignal) {
	return listActiveCategories({ page: DASHBOARD_PAGE }, { signal });
}

export async function fetchSafeDashboardCategories(signal?: AbortSignal) {
	try {
		return await fetchDashboardCategories(signal);
	} catch {
		return emptyDashboardCategoriesResponse;
	}
}

export async function fetchDashboardPopularProducts(signal?: AbortSignal) {
	try {
		const popularityResponse = await listProductsByPopularity(
			{ page: DASHBOARD_PAGE },
			{ signal },
		);

		if (popularityResponse.products.length > 0) {
			return popularityResponse;
		}
	} catch {
		return listActiveProducts({ page: DASHBOARD_PAGE }, { signal });
	}

	return listActiveProducts({ page: DASHBOARD_PAGE }, { signal });
}

export async function fetchSafeDashboardPopularProducts(signal?: AbortSignal) {
	try {
		return await fetchDashboardPopularProducts(signal);
	} catch {
		return emptyDashboardPopularProductsResponse;
	}
}

export function dashboardCategoriesQueryOptions() {
	return queryOptions({
		placeholderData: emptyDashboardCategoriesResponse,
		queryFn: ({ signal }) => fetchDashboardCategories(signal),
		queryKey: dashboardCatalogQueryKeys.categories(),
		staleTime: DASHBOARD_STALE_TIME_MS,
	});
}

export function dashboardPopularProductsQueryOptions() {
	return queryOptions({
		placeholderData: emptyDashboardPopularProductsResponse,
		queryFn: ({ signal }) => fetchDashboardPopularProducts(signal),
		queryKey: dashboardCatalogQueryKeys.popularProducts(),
		staleTime: DASHBOARD_STALE_TIME_MS,
	});
}
