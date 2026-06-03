import type {
	ListActiveCategoriesResponse,
	ListProductsByPopularityResponse,
} from "@/api/backend/catalog";
import type { ApiCategory } from "@/api/backend/schemas/category";
import type { ApiProduct } from "@/api/backend/schemas/product";
import { DASHBOARD_ITEMS_LIMIT } from "../_queries/dashboard-catalog";
import {
	getFallbackCategoryImage,
	getFallbackProductImage,
} from "./dashboard-fallbacks";

const safeImageHostnames = new Set(["images.unsplash.com", "localhost"]);

export interface DashboardCategoryCard {
	id: string;
	image: string;
	subtitle: string;
	title: string;
}

export interface DashboardProductCard {
	id: string;
	image: string;
	isBestSeller: boolean;
	name: string;
	price: number;
	ratingCount: number;
}

export interface DashboardCarouselImage {
	alt: string;
	src: string;
}

function getSafeImageUrl(
	imageUrl: string | null | undefined,
	fallback: string,
) {
	const trimmedImageUrl = imageUrl?.trim();

	if (!trimmedImageUrl) {
		return fallback;
	}

	if (trimmedImageUrl.startsWith("/")) {
		return trimmedImageUrl;
	}

	try {
		const url = new URL(trimmedImageUrl);
		const isSupportedProtocol =
			url.protocol === "http:" || url.protocol === "https:";

		if (isSupportedProtocol && safeImageHostnames.has(url.hostname)) {
			return trimmedImageUrl;
		}
	} catch {
		return fallback;
	}

	return fallback;
}

function toCategoryCard(
	category: ApiCategory,
	index: number,
): DashboardCategoryCard {
	return {
		id: category.id,
		image: getSafeImageUrl(category.imageUrl, getFallbackCategoryImage(index)),
		subtitle:
			category.description?.trim() || "Produtos artesanais selecionados",
		title: category.name,
	};
}

function toProductCard(
	product: ApiProduct,
	index: number,
): DashboardProductCard {
	return {
		id: product.id,
		image: getSafeImageUrl(
			product.coverImageUrl,
			getFallbackProductImage(index),
		),
		isBestSeller: index === 0,
		name: product.name,
		price: product.basePrice,
		ratingCount: product.reviewsCount,
	};
}

function toCarouselImage(
	product: ApiProduct,
	index: number,
): DashboardCarouselImage {
	return {
		alt: product.name,
		src: getSafeImageUrl(product.coverImageUrl, getFallbackProductImage(index)),
	};
}

export function getDashboardCategoryCards(
	response: ListActiveCategoriesResponse,
) {
	return response.categories
		.slice(0, DASHBOARD_ITEMS_LIMIT)
		.map(toCategoryCard);
}

export function getDashboardProductCards(
	response: ListProductsByPopularityResponse,
) {
	return response.products.slice(0, DASHBOARD_ITEMS_LIMIT).map(toProductCard);
}

export function getDashboardCarouselImages(
	response: ListProductsByPopularityResponse,
) {
	return response.products.slice(0, DASHBOARD_ITEMS_LIMIT).map(toCarouselImage);
}
