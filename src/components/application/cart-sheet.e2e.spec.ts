import { expect, test } from "@playwright/test";
import {
	addFirstCatalogProductToCart,
	getCartItemByName,
} from "@/test/e2e-storefront";

test.describe("Cart sheet", () => {
	test("opens directly from the cart query param", async ({ page }) => {
		await page.goto("/products?cart=true");

		await expect(
			page.getByRole("heading", { name: "Meu Carrinho" }),
		).toBeVisible();
		await expect(page.getByText("Seu carrinho esta vazio")).toBeVisible();
	});

	test("updates quantity, totals, and empty state while editing cart items", async ({
		page,
	}) => {
		const product = await addFirstCatalogProductToCart(page);

		const cartDialog = page.getByRole("dialog");
		const cartButton = page.locator('button[aria-label="Carrinho"]');
		const cartItem = getCartItemByName(cartDialog, product.name);

		await expect(
			cartDialog.getByRole("heading", { name: "Meu Carrinho" }),
		).toBeVisible();
		await expect(cartButton).toContainText("1");
		await expect(cartItem.getByText(/R\$/).last()).toBeVisible();

		await cartDialog
			.getByRole("button", {
				name: `Adicionar uma unidade de ${product.name}`,
			})
			.click();

		await expect(cartButton).toContainText("2");
		await expect(cartItem.getByText(/R\$/).last()).toBeVisible();
		await expect(
			cartDialog.getByRole("button", {
				name: `Remover uma unidade de ${product.name}`,
			}),
		).toBeEnabled();

		await cartDialog
			.getByRole("button", {
				name: `Remover uma unidade de ${product.name}`,
			})
			.click();

		await expect(cartButton).toContainText("1");
		await expect(cartItem.getByText(/R\$/).last()).toBeVisible();
		await expect(
			cartDialog.getByRole("button", {
				name: `Remover uma unidade de ${product.name}`,
			}),
		).toBeDisabled();

		await cartDialog
			.getByRole("button", {
				name: `Remover ${product.name} do carrinho`,
			})
			.click();

		await expect(cartButton).toContainText("0");
		await expect(cartDialog.getByText("Seu carrinho esta vazio")).toBeVisible();
		await expect(
			cartDialog.getByRole("button", { name: "Finalizar Pedido" }),
		).toBeDisabled();
	});
});
