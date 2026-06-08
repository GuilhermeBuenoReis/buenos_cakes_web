import { expect, test } from "@playwright/test";
import {
	openFirstCatalogProductDetails,
	selectLastProductFilling,
	selectLastProductSize,
	selectProductSizeByIndex,
} from "@/test/e2e-storefront";

function getQueryParam(url: string, key: string) {
	return new URL(url).searchParams.get(key);
}

test.describe("Product customization", () => {
	test("persists customization in the URL and rehydrates after reload", async ({
		page,
	}) => {
		await openFirstCatalogProductDetails(page);

		const size = await selectLastProductSize(page);
		const filling = await selectLastProductFilling(page);
		await page.getByLabel("Mensagem personalizada").fill("Feliz aniversario!");
		await page.getByRole("button", { name: "Aumentar quantidade" }).click();

		if (size.count > 1) {
			await expect.poll(() => getQueryParam(page.url(), "size")).toBeTruthy();
		}
		if (filling.count > 1) {
			await expect
				.poll(() => getQueryParam(page.url(), "filling"))
				.toBeTruthy();
		}
		await expect
			.poll(() => getQueryParam(page.url(), "message"))
			.toBe("Feliz aniversario!");
		await expect.poll(() => getQueryParam(page.url(), "quantity")).toBe("2");

		await page.reload();

		await expect(
			page.getByRole("button", { name: size.label, pressed: true }),
		).toBeVisible();
		await expect(page.getByLabel("Selecionar recheio extra")).toContainText(
			filling.label,
		);
		await expect(page.getByLabel("Mensagem personalizada")).toHaveValue(
			"Feliz aniversario!",
		);
		await expect(page.getByRole("textbox", { name: "Quantidade" })).toHaveValue(
			"2",
		);
	});

	test("aggregates identical customizations and keeps different ones separated", async ({
		page,
	}) => {
		const product = await openFirstCatalogProductDetails(page);

		const size = await selectLastProductSize(page);
		const filling = await selectLastProductFilling(page);
		await page.getByLabel("Mensagem personalizada").fill("Parabens!");
		await page.getByRole("button", { name: "Aumentar quantidade" }).click();
		await page.getByRole("button", { name: "Adicionar ao Carrinho" }).click();

		const cartDialog = page.getByRole("dialog");
		const cartButton = page.locator('button[aria-label="Carrinho"]');
		const customizedHighlight = `${size.label} • ${filling.label} • Com mensagem`;
		const customizedCartItem = cartDialog
			.locator("article")
			.filter({ hasText: customizedHighlight });

		await expect(customizedCartItem).toContainText(customizedHighlight);
		await expect(cartDialog.locator("article")).toHaveCount(1);
		await expect(
			cartDialog.getByRole("button", {
				name: `Adicionar uma unidade de ${product.name}`,
			}),
		).toBeVisible();

		await page.getByRole("button", { name: "Fechar carrinho" }).click();
		await page.getByRole("button", { name: "Adicionar ao Carrinho" }).click();

		await expect(cartDialog.locator("article")).toHaveCount(1);
		await expect(cartButton).toContainText("4");
		await expect(customizedCartItem.getByText(/R\$/).last()).toBeVisible();

		await page.getByRole("button", { name: "Fechar carrinho" }).click();
		const plainSize = await selectProductSizeByIndex(page, 0);
		await page.getByLabel("Mensagem personalizada").fill("");
		await page.getByRole("button", { name: "Diminuir quantidade" }).click();
		await page.getByRole("button", { name: "Adicionar ao Carrinho" }).click();

		const plainHighlight = `${plainSize.label} • ${filling.label}`;

		await expect(cartDialog.locator("article")).toHaveCount(2);
		await expect(cartDialog.getByText(plainHighlight)).toBeVisible();
		await expect(cartButton).toContainText("5");
	});
});
