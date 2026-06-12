describe("Navbar", () => {
	it("simulates clicks on navbar links", () => {
		cy.visit("/dashboard");

		cy.get('header').within(() => {
			cy.contains("a", "Início").should("be.visible");
			cy.contains("a", "Produtos").should("be.visible");
			cy.contains("a", "Sobre Nós").should("be.visible");
			cy.contains("a", "DoceGestão").should("be.visible");
		});

		cy.get('header').contains("a", "Produtos").click();
		cy.url().should("match", /\/products$/);

		cy.get('header').contains("a", "Sobre Nós").click();
		cy.url().should("match", /\/about$/);

		cy.get('header').contains("a", "Início").click();
		cy.url().should("match", /\/dashboard$/);

		cy.get('header').contains("a", "DoceGestão").click();
		cy.url().should("match", /\/dashboard$/);
	});

	it("simulates clicks on navbar action controls", () => {
		cy.visit("/dashboard");

		cy.get('button[aria-label="Carrinho"]').should("be.visible");
		cy.get('header a[aria-label="Perfil"]').should("be.visible");
		cy.get('button[aria-label="Carrinho"]').should("contain.text", "0");

		cy.location("pathname").then((currentPathname) => {
			cy.get('button[aria-label="Carrinho"]').click();
			cy.contains("h1,h2,h3,h4,h5,h6", "Meu Carrinho").should("be.visible");
			cy.contains("Seu carrinho esta vazio").should("be.visible");
			cy.url().should("satisfy", (url: string) => {
				const parsed = new URL(url);
				return (
					parsed.searchParams.get("cart") === "true" &&
					parsed.pathname === currentPathname
				);
			});

			cy.get('button[aria-label="Fechar carrinho"]').click();
			cy.contains("h1,h2,h3,h4,h5,h6", "Meu Carrinho").should("not.exist");
			cy.url().should("satisfy", (url: string) => {
				const parsed = new URL(url);
				return (
					parsed.searchParams.get("cart") === null &&
					parsed.pathname === currentPathname
				);
			});
		});

		cy.get('header a[aria-label="Perfil"]').click();
		cy.url().should("match", /\/profile$/);
		cy.get('header a[aria-label="Perfil"]').should(
			"have.attr",
			"aria-current",
			"page",
		);
	});
});
