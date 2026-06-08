import { openFirstCatalogProductDetails } from "../support/storefront";

describe("Product details route", () => {
	it("navigates to product detail when clicking a product card", () => {
		openFirstCatalogProductDetails().then((product) => {
			cy.url().should("include", product.detailsHref);
			cy.contains("h1,h2,h3,h4,h5,h6", product.name).should("be.visible");
			cy.contains("h1,h2,h3,h4,h5,h6", /Sobre este/).should("be.visible");
			cy.contains("button", "Adicionar ao Carrinho").should("be.visible");
		});
	});

	it("renders custom not found state for an unknown product id", () => {
		cy.visit("/products/prd_nao_existe");
		cy.contains("h1,h2,h3,h4,h5,h6", "Produto nao encontrado").should(
			"be.visible",
		);
		cy.contains("a", "Voltar para o catalogo").click();
		cy.url().should("match", /\/products$/);
		cy.contains("h1,h2,h3,h4,h5,h6", "Catálogo de Doces").should("be.visible");
	});
});
