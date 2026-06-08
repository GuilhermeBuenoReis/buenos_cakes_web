import { getFirstCatalogProduct } from "../support/storefront";

describe("Products catalog filters", () => {
	it("applies sidebar filters only after clicking apply", () => {
		cy.visit("/products?page=2&rating=4");
		cy.contains(/Mostrando \d+ de \d+ produtos/).should("be.visible");
		getFirstCatalogProduct();

		cy.get('input[aria-label="Avaliação mínima de 3 estrelas"]').check();

		cy.url().should("include", "rating=4");
		cy.contains(/Mostrando \d+ de \d+ produtos/).should("be.visible");

		cy.contains("button", "Aplicar Filtros").click();

		cy.url().should("include", "rating=3");
		cy.url().should("satisfy", (url: string) => {
			const page = new URL(url).searchParams.get("page");
			return page === null || page === "1";
		});
		cy.contains(/Mostrando \d+ de \d+ produtos/).should("be.visible");
		getFirstCatalogProduct();
	});

	it("applies sort immediately and resets pagination", () => {
		cy.visit("/products?page=2&sort=popular");
		cy.contains(/Mostrando \d+ de \d+ produtos/).should("be.visible");
		getFirstCatalogProduct();

		cy.get('[role="combobox"]').click();
		cy.contains('[role="option"]', "Menor Preço").click();

		cy.url().should("include", "sort=price-asc");
		cy.url().should("satisfy", (url: string) => {
			const page = new URL(url).searchParams.get("page");
			return page === null || page === "1";
		});
		cy.contains(/Mostrando \d+ de \d+ produtos/).should("be.visible");
		cy.get('[role="combobox"]').should("contain.text", "Menor Preço");
		getFirstCatalogProduct();
	});
});
