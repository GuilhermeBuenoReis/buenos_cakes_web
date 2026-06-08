describe("HeroActions", () => {
	it("navigates both dashboard CTAs to the products catalog", () => {
		cy.visit("/dashboard");
		cy.contains("a", "Comprar Agora").click();
		cy.url().should("match", /\/products$/);
		cy.contains("h1,h2,h3,h4,h5,h6", "Catálogo de Doces").should("be.visible");

		cy.visit("/dashboard");
		cy.contains("a", "Ver Catálogo").click();
		cy.url().should("match", /\/products$/);
		cy.contains("h1,h2,h3,h4,h5,h6", "Catálogo de Doces").should("be.visible");
	});
});
