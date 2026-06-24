import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@/api/products/types";
import { CartSheetProvider } from "@/contexts/cart-sheet-context";

const mocks = vi.hoisted(() => ({
	getProductById: vi.fn(),
	getProducts: vi.fn(),
	notFound: vi.fn(() => {
		throw new Error("NEXT_NOT_FOUND");
	}),
}));

vi.mock("@/api/products", () => ({
	getProductById: mocks.getProductById,
	getProducts: mocks.getProducts,
}));

vi.mock("next/navigation", () => ({
	notFound: mocks.notFound,
}));

import ProductDetailsPage, { generateMetadata } from "./page";

const baseProduct: Product = {
	category: "Bolos",
	description:
		"Massa aveludada de cacau suave com recheio cremoso e acabamento sofisticado para ocasioes especiais.",
	id: "prd_8f3a92c1",
	image:
		"https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80",
	name: "Bolo Red Velvet Premium",
	popularity: 95,
	price: 145.9,
	rating: 4.8,
	reviews: 48,
};

describe("ProductDetailsPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("builds the metadata title for an existing product", async () => {
		mocks.getProductById.mockResolvedValue(baseProduct);

		await expect(
			generateMetadata({
				params: Promise.resolve({ id: baseProduct.id }),
			}),
		).resolves.toEqual({
			title: `${baseProduct.name} | Buenos Cakes`,
		});

		expect(mocks.getProductById).toHaveBeenCalledWith({
			id: baseProduct.id,
		});
	});

	it("returns a fallback metadata title when the product is missing", async () => {
		mocks.getProductById.mockResolvedValue(null);

		await expect(
			generateMetadata({
				params: Promise.resolve({ id: "prd_nao_existe" }),
			}),
		).resolves.toEqual({
			title: "Produto nao encontrado",
		});
	});

	it("renders the page with the fetched product, related images and purchase panel", async () => {
		const relatedProducts: Product[] = [
			{
				...baseProduct,
				id: "prd_rel_1",
				name: "Cupcake Berry Bliss",
			},
			{
				...baseProduct,
				id: "prd_rel_2",
				name: "Bolo de Cenoura Vovo",
			},
			{
				...baseProduct,
				id: "prd_rel_3",
				name: "Bolo Chocolate Supremo",
			},
			{
				...baseProduct,
				id: "prd_rel_4",
				name: "Bolo Brigadeiro Intenso",
			},
			{
				...baseProduct,
				id: "prd_rel_5",
				name: "Bolo de Leite Ninho",
			},
			{
				...baseProduct,
				category: "Cookies",
				id: "prd_cookie_1",
				name: "Double Choc Cookie",
			},
		];

		mocks.getProductById.mockResolvedValue(baseProduct);
		mocks.getProducts.mockResolvedValue([baseProduct, ...relatedProducts]);

		render(
			<NuqsTestingAdapter hasMemory>
				<CartSheetProvider>
					{
						await ProductDetailsPage({
							params: Promise.resolve({ id: baseProduct.id }),
						})
					}
				</CartSheetProvider>
			</NuqsTestingAdapter>,
		);

		expect(
			screen.getByRole("heading", { name: baseProduct.name }),
		).toBeVisible();
		expect(screen.getByText(`${baseProduct.name} - Pequeno`)).toBeVisible();
		expect(screen.getByAltText(relatedProducts[0].name)).toBeVisible();
		expect(screen.getByAltText(relatedProducts[3].name)).toBeVisible();
		expect(
			screen.queryByAltText(relatedProducts[4].name),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Adicionar ao Carrinho" }),
		).toBeVisible();
		expect(mocks.getProductById).toHaveBeenCalledWith({
			id: baseProduct.id,
		});
		expect(mocks.getProducts).toHaveBeenCalledWith();
	});

	it("calls notFound when the requested product does not exist", async () => {
		mocks.getProductById.mockResolvedValue(null);
		mocks.getProducts.mockResolvedValue([]);

		await expect(
			ProductDetailsPage({
				params: Promise.resolve({ id: "prd_nao_existe" }),
			}),
		).rejects.toThrow("NEXT_NOT_FOUND");

		expect(mocks.notFound).toHaveBeenCalledTimes(1);
	});
});
