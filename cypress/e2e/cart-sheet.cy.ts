import { addFirstCatalogProductToCart } from "../support/storefront";

describe("Cart sheet", () => {
	it("opens directly from the cart query param", () => {
		cy.visit("/products?cart=true");
		cy.contains("h1,h2,h3,h4,h5,h6", "Meu Carrinho").should("be.visible");
		cy.contains("Seu carrinho esta vazio").should("be.visible");
	});

	it("updates quantity, totals, and empty state while editing cart items", () => {
		addFirstCatalogProductToCart().then((product) => {
			cy.contains("h1,h2,h3,h4,h5,h6", "Meu Carrinho").should("be.visible");
			cy.get('button[aria-label="Carrinho"]').should("contain.text", "1");
			cy.get('[role="dialog"] article')
				.filter(`:contains("${product.name}")`)
				.first()
				.contains(/R\$/)
				.should("be.visible");

			cy.get(
				`button[aria-label="Adicionar uma unidade de ${product.name}"]`,
			).click();
			cy.get('button[aria-label="Carrinho"]').should("contain.text", "2");
			cy.get(
				`button[aria-label="Remover uma unidade de ${product.name}"]`,
			).should("not.be.disabled");

			cy.get(
				`button[aria-label="Remover uma unidade de ${product.name}"]`,
			).click();
			cy.get('button[aria-label="Carrinho"]').should("contain.text", "1");
			cy.get(
				`button[aria-label="Remover uma unidade de ${product.name}"]`,
			).should("be.disabled");

			cy.get(
				`button[aria-label="Remover ${product.name} do carrinho"]`,
			).click();
			cy.get('button[aria-label="Carrinho"]').should("contain.text", "0");
			cy.contains("Seu carrinho esta vazio").should("be.visible");
			cy.contains("button", "Finalizar Pedido").should("be.disabled");
		});
	});
});
