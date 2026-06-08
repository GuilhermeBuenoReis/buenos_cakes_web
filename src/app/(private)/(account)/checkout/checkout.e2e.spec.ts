import { expect, type Page, test } from "@playwright/test";
import { dayjs } from "@/lib/dayjs";
import { addFirstCatalogProductToCart } from "@/test/e2e-storefront";
import {
	formatPickupSummaryDate,
	getInitialPickupDate,
} from "./_components/checkout-pickup-scheduler";

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

async function addCatalogProductAndGoToCheckout(page: Page) {
	const product = await addFirstCatalogProductToCart(page);

	await goToCheckoutFromCart(page);

	return product;
}

test.describe("Checkout", () => {
	test.describe.configure({ mode: "serial" });

	test("navigates from the cart to checkout and preserves the order summary", async ({
		page,
	}) => {
		const product = await addFirstCatalogProductToCart(page);

		await expect(
			page.getByRole("heading", { name: "Meu Carrinho" }),
		).toBeVisible();

		await goToCheckoutFromCart(page);

		await expect(
			page.getByRole("heading", { name: "Finalizar Pedido" }),
		).toBeVisible();
		await expect(page.getByText(product.name)).toBeVisible();
		await expect(page.getByText("Qtd. 1")).toBeVisible();
		await expect(page.getByText("1 item")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Ir para Pagamento" }),
		).toBeDisabled();
	});

	test("shows the empty state and disabled actions when opening checkout without cart items", async ({
		page,
	}) => {
		await page.goto("/checkout");

		await expect(
			page.getByText("Seu carrinho ainda está vazio."),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Próximo Passo" }),
		).toBeDisabled();
		await expect(
			page.getByRole("button", { name: "Ir para Pagamento" }),
		).toBeDisabled();
		await expect(page.getByTestId("pickup-schedule-summary")).toHaveText(
			"Às 14:00",
		);
	});

	test("updates the pickup summary after changing the pickup date directly on checkout", async ({
		page,
	}) => {
		await page.goto("/checkout");
		await page.getByRole("button", { name: "Escolher no calendário" }).click();

		const calendarPanel = page.getByTestId("pickup-calendar-panel");
		await expect(calendarPanel).toBeVisible();

		const calendarOnlyDate = dayjs(getInitialPickupDate())
			.add(7, "day")
			.toDate();

		await calendarPanel
			.locator(
				`button[data-day="${dayjs(calendarOnlyDate).format("YYYY-MM-DD")}"]`,
			)
			.click();

		await expect(calendarPanel).not.toBeVisible();
		await expect(page.getByTestId("pickup-date-summary")).toHaveText(
			formatPickupSummaryDate(calendarOnlyDate),
		);
		await expect(page.getByTestId("pickup-schedule-summary")).toHaveText(
			"Às 14:00",
		);
	});

	test("returns to products with cart query when clicking back to cart", async ({
		page,
	}) => {
		await page.goto("/checkout");

		await page.getByRole("link", { name: "Voltar ao Carrinho" }).click();

		await expect(page).toHaveURL(/\/products\?cart=true$/);
	});

	test("moves to the payment step when clicking next step", async ({
		page,
	}) => {
		await addCatalogProductAndGoToCheckout(page);
		await page.getByLabel("Nome Completo").fill("Ana Beatriz Souza");
		await page.getByLabel("E-mail").fill("ana.souza@exemplo.com");
		await page.getByLabel("WhatsApp / Telefone").fill("(11) 99876-5432");
		await page.getByRole("button", { name: "Próximo Passo" }).click();

		await expect(page).toHaveURL(/\/checkout\/payment$/);
		await expect(
			page.getByRole("heading", { name: "Pagamento do Pedido" }),
		).toBeVisible();
		await expect(page.getByText("Escolha como deseja pagar")).toBeVisible();
	});

	test("keeps progression disabled while personal info is invalid", async ({
		page,
	}) => {
		await addCatalogProductAndGoToCheckout(page);

		await expect(
			page.getByRole("button", { name: "Próximo Passo" }),
		).toBeDisabled();
		await expect(
			page.getByRole("button", { name: "Ir para Pagamento" }),
		).toBeDisabled();
	});

	test("confirms the order and makes it available in the profile page", async ({
		page,
	}) => {
		const product = await addCatalogProductAndGoToCheckout(page);

		await page.getByLabel("Nome Completo").fill("Ana Beatriz Souza");
		await page.getByLabel("E-mail").fill("ana.souza@exemplo.com");
		await page.getByLabel("WhatsApp / Telefone").fill("(11) 99876-5432");

		await page.getByRole("button", { name: "Próximo Passo" }).click();
		await expect(page).toHaveURL(/\/checkout\/payment$/);

		await page.locator("label").filter({ hasText: "Dinheiro" }).click();
		await page.getByRole("link", { name: "Continuar para revisão" }).click();

		await expect(page).toHaveURL(/\/checkout\/review$/);
		await expect(
			page.getByRole("heading", { name: "Revisão do Pedido" }),
		).toBeVisible();
		await expect(page.getByText(product.name)).toBeVisible();
		await expect(page.getByText("Ana Beatriz Souza")).toBeVisible();
		await expect(page.getByText("ana.souza@exemplo.com")).toBeVisible();
		await expect(page.getByText("(11) 99876-5432")).toBeVisible();
		await expect(page.getByText("Dinheiro", { exact: true })).toBeVisible();
		await expect(page.getByText("Às 14:00").first()).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Voltar para pagamento" }),
		).toHaveAttribute("href", "/checkout/payment");
		await expect(
			page.getByRole("button", { name: "Confirmar Pedido" }),
		).toBeEnabled();

		await page.getByRole("button", { name: "Confirmar Pedido" }).click();

		await expect(page).toHaveURL(/\/profile#order-/);
		await expect(
			page.getByRole("heading", { name: "Pedidos Recentes" }),
		).toBeVisible();
		const confirmedOrderId = new URL(page.url()).hash.slice(1);
		const confirmedOrderRow = page.locator(`[id="${confirmedOrderId}"]`);
		await expect(confirmedOrderRow).toBeVisible();
		await expect(confirmedOrderRow.getByText(/^#[A-Z0-9]{8}$/)).toBeVisible();
		await expect(confirmedOrderRow.getByText(/R\$/)).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Carrinho" }).getByText("0"),
		).toBeVisible();

		await page.reload();

		await expect(page).toHaveURL(/\/profile#order-/);
		await expect(page.locator(`[id="${confirmedOrderId}"]`)).toBeVisible();
	});
});
