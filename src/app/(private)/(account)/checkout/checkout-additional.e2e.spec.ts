import { expect, type Page, test } from "@playwright/test";
import { addFirstCatalogProductToCart } from "@/test/e2e-storefront";

async function goToCheckoutFromCart(page: Page) {
	const cartDialog = page.getByRole("dialog", { name: "Meu Carrinho" });
	const checkoutButton = cartDialog.getByRole("button", {
		exact: true,
		name: "Finalizar Pedido",
	});

	await expect(checkoutButton).toBeVisible();
	await expect(checkoutButton).toBeEnabled();

	await Promise.all([page.waitForURL(/\/checkout$/), checkoutButton.click()]);
}

async function goToCheckoutPayment(
	page: Page,
	customer: {
		email: string;
		fullName: string;
		phone: string;
	},
) {
	const product = await addFirstCatalogProductToCart(page);

	await goToCheckoutFromCart(page);
	await page.getByLabel("Nome Completo").fill(customer.fullName);
	await page.getByLabel("E-mail").fill(customer.email);
	await page.getByLabel("WhatsApp / Telefone").fill(customer.phone);

	const paymentButton = page.getByRole("button", {
		name: "Ir para Pagamento",
	});

	await expect(paymentButton).toBeEnabled();
	await paymentButton.click();

	await expect(page).toHaveURL(/\/checkout\/payment$/);

	return product;
}

async function goToCheckoutReview(
	page: Page,
	customer: {
		email: string;
		fullName: string;
		phone: string;
	},
) {
	const product = await goToCheckoutPayment(page, customer);

	await page.getByRole("link", { name: "Continuar para revisão" }).click();

	await expect(page).toHaveURL(/\/checkout\/review$/);

	return product;
}

test.describe("Checkout additional flows", () => {
	test("preserves cash payment details when returning from review to payment", async ({
		page,
	}) => {
		await goToCheckoutPayment(page, {
			email: "beatriz@exemplo.com",
			fullName: "Beatriz Almeida",
			phone: "(11) 97777-1111",
		});

		await page.locator("label").filter({ hasText: "Dinheiro" }).click();
		await expect(page.getByLabel("Precisa de troco?")).toBeVisible();
		await page.getByLabel("Precisa de troco?").fill("100,00");
		await page.getByRole("link", { name: "Continuar para revisão" }).click();

		await expect(page).toHaveURL(/\/checkout\/review$/);
		await expect(page.getByText("Dinheiro", { exact: true })).toBeVisible();
		await expect(page.getByText("Troco solicitado para 100,00.")).toBeVisible();

		await page.getByRole("link", { name: "Voltar para pagamento" }).click();

		await expect(page).toHaveURL(/\/checkout\/payment$/);
		await expect(page.getByText("Forma selecionada")).toBeVisible();
		await expect(page.getByLabel("Precisa de troco?")).toHaveValue("100,00");
	});

	test("returns to products with the cart open when editing an item from review", async ({
		page,
	}) => {
		const product = await goToCheckoutReview(page, {
			email: "camila@exemplo.com",
			fullName: "Camila Araujo",
			phone: "(11) 96666-2222",
		});

		await page.getByRole("link", { name: "Editar item" }).click();

		await expect(page).toHaveURL(/\/products\?cart=true$/);
		await expect(
			page.getByRole("heading", { name: "Meu Carrinho" }),
		).toBeVisible();
		await expect(
			page.getByRole("dialog").getByRole("heading", {
				name: product.name,
			}),
		).toBeVisible();
	});
});
