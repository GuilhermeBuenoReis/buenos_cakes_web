import { expect, test } from "@playwright/test";
import { getFirstCatalogProduct } from "@/test/e2e-storefront";

function getQueryParam(url: string, key: string) {
	return new URL(url).searchParams.get(key);
}

function isFirstPageParam(value: string | null) {
	return value === "1" || value === null;
}

test.describe("Products catalog filters", () => {
	test("applies sidebar filters only after clicking apply", async ({
		page,
	}) => {
		await page.goto("/products?page=2&rating=4");

		await expect(page.getByText(/Mostrando \d+ de \d+ produtos/)).toBeVisible();
		await getFirstCatalogProduct(page);

		await page.getByLabel("Avaliação mínima de 3 estrelas").check();

		await expect.poll(() => getQueryParam(page.url(), "rating")).toBe("4");
		await expect(page.getByText(/Mostrando \d+ de \d+ produtos/)).toBeVisible();

		await page.getByRole("button", { name: "Aplicar Filtros" }).click();

		await expect.poll(() => getQueryParam(page.url(), "rating")).toBe("3");
		await expect
			.poll(() => isFirstPageParam(getQueryParam(page.url(), "page")))
			.toBeTruthy();
		await expect(page.getByText(/Mostrando \d+ de \d+ produtos/)).toBeVisible();
		await getFirstCatalogProduct(page);
	});

	test("applies sort immediately and resets pagination", async ({ page }) => {
		await page.goto("/products?page=2&sort=popular");

		await expect(page.getByText(/Mostrando \d+ de \d+ produtos/)).toBeVisible();
		await getFirstCatalogProduct(page);

		await page.getByRole("combobox").click();
		await page.getByRole("option", { name: "Menor Preço" }).click();

		await expect
			.poll(() => getQueryParam(page.url(), "sort"))
			.toBe("price-asc");
		await expect
			.poll(() => isFirstPageParam(getQueryParam(page.url(), "page")))
			.toBeTruthy();
		await expect(page.getByText(/Mostrando \d+ de \d+ produtos/)).toBeVisible();
		await expect(page.getByRole("combobox")).toContainText("Menor Preço");
		await getFirstCatalogProduct(page);
	});
});
