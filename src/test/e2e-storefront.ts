import { expect, type Locator, type Page } from "@playwright/test";

export interface CatalogProductSelection {
	detailsHref: string;
	name: string;
}

function getProductNameFromDetailsLabel(label: string | null) {
	const name = label?.replace(/^Ver detalhes de\s+/, "").trim();

	if (!name) {
		throw new Error("Não foi possível identificar o nome do produto no card.");
	}

	return name;
}

function getNormalizedOptionLabel(rawLabel: string) {
	return rawLabel
		.replace(/\s+/g, " ")
		.replace(/\s+\(\+R\$.*\)$/, "")
		.trim();
}

export async function getFirstCatalogProduct(page: Page) {
	const detailsLink = page.locator('a[aria-label^="Ver detalhes de "]').first();

	await expect(detailsLink).toBeVisible();

	const label = await detailsLink.getAttribute("aria-label");
	const detailsHref = await detailsLink.getAttribute("href");

	if (!detailsHref) {
		throw new Error(
			"O primeiro produto do catálogo não possui link de detalhe.",
		);
	}

	return {
		detailsHref,
		detailsLink,
		name: getProductNameFromDetailsLabel(label),
	};
}

export async function openFirstCatalogProductDetails(page: Page) {
	await page.goto("/products");

	const { detailsHref, detailsLink, name } = await getFirstCatalogProduct(page);

	await Promise.all([
		page.waitForURL(/\/products\/[^/?#]+/),
		detailsLink.click(),
	]);

	return {
		detailsHref,
		name,
	};
}

export async function addFirstCatalogProductToCart(page: Page) {
	await page.goto("/products");

	const product = await getFirstCatalogProduct(page);

	await page
		.getByRole("button", {
			name: `Adicionar ${product.name} ao carrinho`,
		})
		.first()
		.click();

	const cartDialog = page.getByRole("dialog", { name: "Meu Carrinho" });
	await expect(cartDialog).toBeVisible();
	await expect(getCartItemByName(cartDialog, product.name)).toBeVisible();

	return product;
}

export function getCartItemByName(cartDialog: Locator, productName: string) {
	return cartDialog.locator("article").filter({ hasText: productName }).first();
}

async function getSizeButtonLabel(sizeButton: Locator) {
	return (await sizeButton.locator("p").first().innerText()).trim();
}

export async function selectProductSizeByIndex(page: Page, index: number) {
	const sizeButtons = page.locator("button[aria-pressed]");

	await expect(sizeButtons.first()).toBeVisible();

	const sizeCount = await sizeButtons.count();
	const safeIndex = Math.min(Math.max(index, 0), sizeCount - 1);
	const sizeButton = sizeButtons.nth(safeIndex);
	const label = await getSizeButtonLabel(sizeButton);

	await sizeButton.click();

	return {
		count: sizeCount,
		label,
	};
}

export async function selectLastProductSize(page: Page) {
	const sizeButtons = page.locator("button[aria-pressed]");

	await expect(sizeButtons.first()).toBeVisible();

	const sizeCount = await sizeButtons.count();

	return selectProductSizeByIndex(page, sizeCount - 1);
}

export async function selectLastProductFilling(page: Page) {
	const fillingTrigger = page.getByLabel("Selecionar recheio extra");

	await fillingTrigger.click();

	const options = page.getByRole("option");
	await expect(options.first()).toBeVisible();

	const optionCount = await options.count();
	const option = options.nth(optionCount - 1);
	const rawLabel = await option.innerText();
	const label = getNormalizedOptionLabel(rawLabel);

	await option.click();

	return {
		count: optionCount,
		label,
	};
}
