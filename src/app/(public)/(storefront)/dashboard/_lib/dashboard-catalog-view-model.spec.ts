import { describe, expect, it } from "vitest";
import type { ListProductsByPopularityResponse } from "@/api/backend/catalog";
import {
	getDashboardCarouselImages,
	getDashboardProductCards,
} from "./dashboard-catalog-view-model";

const backendProductsResponse = {
	products: [
		{
			basePrice: 128.5,
			categoryId: "category-cakes",
			coverImageUrl: "http://localhost:3333/uploads/red-velvet.png",
			createdAt: "2026-01-01T00:00:00.000Z",
			description: "Bolo vindo do backend",
			id: "backend-product-1",
			isActive: true,
			name: "Bolo Red Velvet do Backend",
			popularityScore: 99,
			ratingAvg: 4.9,
			reviewsCount: 72,
			slug: "bolo-red-velvet-do-backend",
			updatedAt: null,
		},
	],
} satisfies ListProductsByPopularityResponse;

describe("dashboard catalog view model", () => {
	it("maps backend products to dashboard cards", () => {
		expect(getDashboardProductCards(backendProductsResponse)).toEqual([
			{
				id: "backend-product-1",
				image: "http://localhost:3333/uploads/red-velvet.png",
				isBestSeller: true,
				name: "Bolo Red Velvet do Backend",
				price: 128.5,
				ratingCount: 72,
			},
		]);
	});

	it("maps backend products to hero carousel images", () => {
		expect(getDashboardCarouselImages(backendProductsResponse)).toEqual([
			{
				alt: "Bolo Red Velvet do Backend",
				src: "http://localhost:3333/uploads/red-velvet.png",
			},
		]);
	});

	it("keeps an empty backend products response empty", () => {
		expect(getDashboardProductCards({ products: [] })).toEqual([]);
		expect(getDashboardCarouselImages({ products: [] })).toEqual([]);
	});
});
