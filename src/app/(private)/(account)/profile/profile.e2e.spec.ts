import { expect, test } from "@playwright/test";

test.describe("Profile", () => {
	test("shows the empty state and leads back to products", async ({ page }) => {
		await page.goto("/profile");

		await expect(
			page.getByText("Você ainda não confirmou nenhum pedido."),
		).toBeVisible();
		await page.getByRole("link", { name: "Explorar catálogo" }).click();

		await expect(page).toHaveURL(/\/products$/);
		await expect(
			page.getByRole("heading", { name: "Catálogo de Doces" }),
		).toBeVisible();
	});
});
