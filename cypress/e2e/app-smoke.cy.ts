describe("Application smoke", () => {
	it("redirects the root route to dashboard", () => {
		cy.visit("/");
		cy.url().should("match", /\/dashboard$/);
		cy.contains("h1,h2,h3,h4,h5,h6", "A doçura que sua vida merece.").should(
			"be.visible",
		);
	});

	it("navigates from the about page CTA to products", () => {
		cy.visit("/about");
		cy.contains("a", "Ver Produtos").click();
		cy.url().should("match", /\/products$/);
		cy.contains("h1,h2,h3,h4,h5,h6", "Catálogo de Doces").should("be.visible");
	});
});
