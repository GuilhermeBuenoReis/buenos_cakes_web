import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	fetchDashboardCategories,
	fetchDashboardPopularProducts,
	fetchSafeDashboardCategories,
	fetchSafeDashboardPopularProducts,
} from "./dashboard-catalog";

const listActiveCategoriesMock = vi.hoisted(() => vi.fn());
const listActiveProductsMock = vi.hoisted(() => vi.fn());
const listProductsByPopularityMock = vi.hoisted(() => vi.fn());

vi.mock("@/api/backend/catalog", () => ({
	listActiveCategories: listActiveCategoriesMock,
	listActiveProducts: listActiveProductsMock,
	listProductsByPopularity: listProductsByPopularityMock,
}));

describe("dashboard catalog queries", () => {
	beforeEach(() => {
		listActiveCategoriesMock.mockReset();
		listActiveProductsMock.mockReset();
		listProductsByPopularityMock.mockReset();
	});

	it("uses the backend popular products response when it has products", async () => {
		const productsResponse = {
			products: [
				{
					basePrice: 58,
					categoryId: "category-cakes",
					coverImageUrl: null,
					createdAt: "2026-01-01T00:00:00.000Z",
					description: "Produto vindo do backend",
					id: "backend-product",
					isActive: true,
					name: "Bolos redondos",
					popularityScore: 0,
					ratingAvg: 0,
					reviewsCount: 0,
					slug: "bolos-redondos",
					updatedAt: null,
				},
			],
		};

		listProductsByPopularityMock.mockResolvedValue(productsResponse);

		await expect(fetchDashboardPopularProducts()).resolves.toBe(
			productsResponse,
		);
		expect(listActiveProductsMock).not.toHaveBeenCalled();
	});

	it("uses active backend products when popularity returns an empty catalog", async () => {
		const emptyProductsResponse = { products: [] };
		const activeProductsResponse = {
			products: [
				{
					basePrice: 58,
					categoryId: "category-cakes",
					coverImageUrl: null,
					createdAt: "2026-01-01T00:00:00.000Z",
					description: "Produto ativo vindo do backend",
					id: "backend-active-product",
					isActive: true,
					name: "Bolos redondos",
					popularityScore: 0,
					ratingAvg: 0,
					reviewsCount: 0,
					slug: "bolos-redondos",
					updatedAt: null,
				},
			],
		};

		listProductsByPopularityMock.mockResolvedValue(emptyProductsResponse);
		listActiveProductsMock.mockResolvedValue(activeProductsResponse);

		await expect(fetchDashboardPopularProducts()).resolves.toBe(
			activeProductsResponse,
		);
	});

	it("uses the backend categories response even when the catalog is empty", async () => {
		const emptyCategoriesResponse = { categories: [] };

		listActiveCategoriesMock.mockResolvedValue(emptyCategoriesResponse);

		await expect(fetchDashboardCategories()).resolves.toBe(
			emptyCategoriesResponse,
		);
	});

	it("uses active backend products when popularity fails", async () => {
		const activeProductsResponse = { products: [] };

		listProductsByPopularityMock.mockRejectedValue(new Error("network error"));
		listActiveProductsMock.mockResolvedValue(activeProductsResponse);

		await expect(fetchDashboardPopularProducts()).resolves.toBe(
			activeProductsResponse,
		);
	});

	it("throws when both backend product requests fail", async () => {
		listProductsByPopularityMock.mockRejectedValue(new Error("network error"));
		listActiveProductsMock.mockRejectedValue(new Error("active network error"));

		await expect(fetchDashboardPopularProducts()).rejects.toThrow(
			"active network error",
		);
	});

	it("throws when the backend categories request fails", async () => {
		listActiveCategoriesMock.mockRejectedValue(new Error("network error"));

		await expect(fetchDashboardCategories()).rejects.toThrow("network error");
	});

	it("keeps the server page resilient when the backend products request fails", async () => {
		listProductsByPopularityMock.mockRejectedValue(new Error("network error"));
		listActiveProductsMock.mockRejectedValue(new Error("active network error"));

		await expect(fetchSafeDashboardPopularProducts()).resolves.toEqual({
			products: [],
		});
	});

	it("keeps the server page resilient when the backend categories request fails", async () => {
		listActiveCategoriesMock.mockRejectedValue(new Error("network error"));

		await expect(fetchSafeDashboardCategories()).resolves.toEqual({
			categories: [],
		});
	});
});
