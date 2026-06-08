describe("Profile", () => {
	it("shows profile content and navigates back to products", () => {
		cy.visit("/profile");

		cy.contains("h1,h2,h3,h4,h5,h6", "Pedidos Recentes").should("be.visible");
		cy.contains("h1,h2,h3,h4,h5,h6", "Informações Pessoais").should(
			"be.visible",
		);

		cy.get('[role="banner"]').contains("a", "Produtos").click();
		cy.url().should("match", /\/products$/);
		cy.contains("h1,h2,h3,h4,h5,h6", "Catálogo de Doces").should("be.visible");
	});
});
