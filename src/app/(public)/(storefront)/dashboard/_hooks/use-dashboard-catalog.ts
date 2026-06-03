"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	getDashboardCarouselImages,
	getDashboardCategoryCards,
	getDashboardProductCards,
} from "../_lib/dashboard-catalog-view-model";
import {
	dashboardCategoriesQueryOptions,
	dashboardPopularProductsQueryOptions,
	emptyDashboardCategoriesResponse,
	emptyDashboardPopularProductsResponse,
} from "../_queries/dashboard-catalog";

export function useDashboardCategories() {
	const query = useQuery(dashboardCategoriesQueryOptions());
	const data = query.data ?? emptyDashboardCategoriesResponse;

	const categories = useMemo(() => getDashboardCategoryCards(data), [data]);

	return {
		...query,
		categories,
	};
}

export function useDashboardPopularProducts() {
	const query = useQuery(dashboardPopularProductsQueryOptions());
	const data = query.data ?? emptyDashboardPopularProductsResponse;

	const products = useMemo(() => getDashboardProductCards(data), [data]);

	return {
		...query,
		products,
	};
}

export function useDashboardHeroProducts() {
	const query = useQuery(dashboardPopularProductsQueryOptions());
	const data = query.data ?? emptyDashboardPopularProductsResponse;

	const carouselImages = useMemo(
		() => getDashboardCarouselImages(data),
		[data],
	);

	return {
		...query,
		carouselImages,
	};
}
