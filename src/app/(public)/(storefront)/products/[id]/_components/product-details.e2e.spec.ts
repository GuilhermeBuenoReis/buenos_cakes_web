import { expect, test } from "@playwright/test";
import { openFirstCatalogProductDetails } from "@/test/e2e-storefront";

test.describe("Product details route", () => {
	test("navigates to product detail when clicking a product card", async ({
		page,
	}) => {
		const product = await openFirstCatalogProductDetails(page);

		await expect(page).toHaveURL(new RegExp(`${product.detailsHref}$`));
		await expect(
			page.getByRole("heading", { name: product.name }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: /Sobre este/ }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Adicionar ao Carrinho" }),
		).toBeVisible();
	});

	test("renders custom not found state for an unknown product id", async ({
		page,
	}) => {
		await page.goto("/products/prd_nao_existe", {
			waitUntil: "networkidle",
		});

		await expect(
			page.getByRole("heading", { name: "Produto nao encontrado" }),
		).toBeVisible();
		await page.getByRole("link", { name: "Voltar para o catalogo" }).click();

		await expect(page).toHaveURL(/\/products$/);
		await expect(
			page.getByRole("heading", { name: "Catálogo de Doces" }),
		).toBeVisible();
	});
});
