import { queryOptions } from "@tanstack/react-query";
import {
	listActiveProductFillingsByProduct,
	listActiveProductSizesByProduct,
	listActiveProducts,
} from "@/api/backend/catalog";

const CATALOG_STALE_TIME_MS = 1000 * 60 * 5;

export const orderItemCatalogQueryKeys = {
	all: ["profile", "order-item-catalog"] as const,
	fillings: (productId: string) =>
		[...orderItemCatalogQueryKeys.all, "fillings", productId] as const,
	products: () => [...orderItemCatalogQueryKeys.all, "products"] as const,
	sizes: (productId: string) =>
		[...orderItemCatalogQueryKeys.all, "sizes", productId] as const,
};

export function activeProductsQueryOptions() {
	return queryOptions({
		queryFn: ({ signal }) => listActiveProducts({ page: 1 }, { signal }),
		queryKey: orderItemCatalogQueryKeys.products(),
		staleTime: CATALOG_STALE_TIME_MS,
	});
}

export function productSizesQueryOptions(productId: string | null) {
	return queryOptions({
		enabled: Boolean(productId),
		queryFn: ({ signal }) =>
			listActiveProductSizesByProduct(
				{ productId: productId ?? "" },
				{ signal },
			),
		queryKey: orderItemCatalogQueryKeys.sizes(productId ?? "none"),
		staleTime: CATALOG_STALE_TIME_MS,
	});
}

export function productFillingsQueryOptions(productId: string | null) {
	return queryOptions({
		enabled: Boolean(productId),
		queryFn: ({ signal }) =>
			listActiveProductFillingsByProduct(
				{ productId: productId ?? "" },
				{ signal },
			),
		queryKey: orderItemCatalogQueryKeys.fillings(productId ?? "none"),
		staleTime: CATALOG_STALE_TIME_MS,
	});
}
