import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";
import type { Product } from "@/api/products/types";
import { NavbarCart } from "@/components/application/navbar-cart";
import { CartSheetProvider } from "@/contexts/cart-sheet-context";
import { ProductCard } from "./product-card";	

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

const product: Product = {
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

describe("ProductCard", () => {
	it("renders the product data, details link and action buttons", () => {
		render(
			<NuqsTestingAdapter hasMemory>
				<CartSheetProvider>
					<ProductCard product={product} />
				</CartSheetProvider>
			</NuqsTestingAdapter>,
		);

		expect(
			screen.getByRole("link", {
				name: `Ver detalhes de ${product.name}`,
			}),
		).toHaveAttribute("href", `/products/${product.id}`);
		expect(screen.getByAltText(product.name)).toBeVisible();
		expect(screen.getByText(product.category)).toBeVisible();
		expect(
			screen.getByText(/145,90/, {
				selector: "strong",
			}),
		).toBeVisible();
		expect(
			screen.getByRole("button", {
				name: `Favoritar ${product.name}`,
			}),
		).toBeVisible();
		expect(
			screen.getByRole("button", {
				name: `Adicionar ${product.name} ao carrinho`,
			}),
		).toBeVisible();
	});

	it("adds the clicked product to the shared cart and updates the navbar counter", async () => {
		const user = userEvent.setup();

		render(
			<NuqsTestingAdapter hasMemory>
				<CartSheetProvider>
					<NavbarCart />
					<ProductCard product={product} />
				</CartSheetProvider>
			</NuqsTestingAdapter>,
		);

		await user.click(
			screen.getByRole("button", {
				name: `Adicionar ${product.name} ao carrinho`,
			}),
		);

		const cartButton = document.body.querySelector(
			'button[aria-label="Carrinho"]',
		);
		const cartDialog = screen.getByRole("dialog");

		expect(cartButton).toHaveTextContent("1");
		expect(within(cartDialog).getByText(product.name)).toBeVisible();
		expect(
			within(cartDialog).getByAltText(`Imagem de ${product.name} no carrinho`),
		).toBeVisible();
		expect(within(cartDialog).getByText(product.category)).toBeVisible();
		expect(within(cartDialog).getAllByText(/145,90/)).toHaveLength(3);
	});
});
