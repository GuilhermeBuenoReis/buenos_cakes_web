import { expect, test } from "@playwright/test";

test.describe("Profile", () => {
	test("shows profile content and navigates back to products", async ({
		page,
	}) => {
		await page.goto("/profile");

		await expect(
			page.getByRole("heading", { name: "Pedidos Recentes" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Informações Pessoais" }),
		).toBeVisible();

		await page
			.getByRole("banner")
			.getByRole("link", { name: "Produtos" })
			.click();

		await expect(page).toHaveURL(/\/products$/);
		await expect(
			page.getByRole("heading", { name: "Catálogo de Doces" }),
		).toBeVisible();
	});
});
