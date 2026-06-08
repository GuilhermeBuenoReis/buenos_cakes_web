import "server-only";

import { cache } from "react";
import {
	fetchProductById,
	listActiveCategories,
	listActiveProductFillingsByProduct,
	listActiveProductSizesByProduct,
	listActiveProducts,
} from "@/api/backend/catalog";
import type { ApiCategory } from "@/api/backend/schemas/category";
import type { ApiProduct } from "@/api/backend/schemas/product";
import type { ApiProductFilling } from "@/api/backend/schemas/product-filling";
import type { ApiProductSize } from "@/api/backend/schemas/product-size";
import { getServerBackendAuthHeaders } from "@/api/backend/server-auth";
import { getFallbackProductImage } from "@/app/(public)/(storefront)/dashboard/_lib/dashboard-fallbacks";
import {
	E2E_STABLE_IMAGE_SRC,
	shouldUseE2EStableImages,
} from "@/lib/e2e-stable-image";
import type {
	GetProductByIdRequest,
	GetProductByIdResponse,
	GetProductsRequest,
	GetProductsResponse,
	Product,
	ProductFillingOption,
	ProductSizeOption,
} from "./types";

const BACKEND_PAGE_SIZE = 20;
const MAX_BACKEND_PAGES = 10;

function getSafeProductImage(imageUrl: string | null | undefined, index = 0) {
	if (shouldUseE2EStableImages()) {
		return E2E_STABLE_IMAGE_SRC;
	}

	const trimmedImageUrl = imageUrl?.trim();

	if (!trimmedImageUrl) {
		return getFallbackProductImage(index);
	}

	return trimmedImageUrl;
}

function getCategoryName(
	product: ApiProduct,
	categoriesById: Map<string, ApiCategory>,
) {
	return categoriesById.get(product.categoryId)?.name ?? "Sem categoria";
}

function toProductSizeOption(size: ApiProductSize): ProductSizeOption {
	return {
		code: size.code,
		id: size.id,
		isDefault: size.isDefault,
		label: size.label,
		priceDelta: size.priceDelta,
		servings: size.servingsLabel ?? "",
		sortOrder: size.sortOrder,
	};
}

function toProductFillingOption(
	filling: ApiProductFilling,
): ProductFillingOption {
	return {
		id: filling.id,
		isDefault: filling.isDefault,
		label: filling.label,
		priceDelta: filling.priceDelta,
		sortOrder: filling.sortOrder,
	};
}

function toProductViewModel(
	product: ApiProduct,
	categoriesById: Map<string, ApiCategory>,
	index = 0,
	options: {
		fillings?: ApiProductFilling[];
		sizes?: ApiProductSize[];
	} = {},
): Product {
	return {
		category: getCategoryName(product, categoriesById),
		categoryId: product.categoryId,
		description: product.description ?? "Produto artesanal Buenos Cakes.",
		fillings: options.fillings
			?.sort((a, b) => a.sortOrder - b.sortOrder)
			.map(toProductFillingOption),
		id: product.id,
		image: getSafeProductImage(product.coverImageUrl, index),
		name: product.name,
		popularity: product.popularityScore,
		price: product.basePrice,
		rating: product.ratingAvg,
		reviews: product.reviewsCount,
		sizes: options.sizes
			?.sort((a, b) => a.sortOrder - b.sortOrder)
			.map(toProductSizeOption),
		slug: product.slug,
	};
}

async function listAllActiveProducts() {
	const headers = await getServerBackendAuthHeaders();
	const products: ApiProduct[] = [];

	for (let page = 1; page <= MAX_BACKEND_PAGES; page += 1) {
		const response = await listActiveProducts({ page }, { headers });
		products.push(...response.products);

		if (response.products.length < BACKEND_PAGE_SIZE) {
			break;
		}
	}

	return products;
}

async function listAllActiveCategories() {
	const headers = await getServerBackendAuthHeaders();
	const categories: ApiCategory[] = [];

	for (let page = 1; page <= MAX_BACKEND_PAGES; page += 1) {
		const response = await listActiveCategories({ page }, { headers });
		categories.push(...response.categories);

		if (response.categories.length < BACKEND_PAGE_SIZE) {
			break;
		}
	}

	return categories;
}

const getCategoriesById = cache(async () => {
	const categories = await listAllActiveCategories();

	return new Map(categories.map((category) => [category.id, category]));
});

export const getProducts = cache(
	async (_request: GetProductsRequest = {}): Promise<GetProductsResponse> => {
		const [products, categoriesById] = await Promise.all([
			listAllActiveProducts(),
			getCategoriesById(),
		]);

		return products.map((product, index) =>
			toProductViewModel(product, categoriesById, index),
		);
	},
);

export const getProductById = cache(
	async ({ id }: GetProductByIdRequest): Promise<GetProductByIdResponse> => {
		const headers = await getServerBackendAuthHeaders();

		try {
			const [
				productResponse,
				categoriesById,
				productSizesResponse,
				productFillingsResponse,
			] = await Promise.all([
				fetchProductById({ productId: id }, { headers }),
				getCategoriesById(),
				listActiveProductSizesByProduct({ productId: id }, { headers }),
				listActiveProductFillingsByProduct({ productId: id }, { headers }),
			]);

			return toProductViewModel(productResponse.product, categoriesById, 0, {
				fillings: productFillingsResponse.productFillings,
				sizes: productSizesResponse.productSizes,
			});
		} catch {
			return null;
		}
	},
);

export function getProductIds(): Product["id"][] {
	return [];
}
