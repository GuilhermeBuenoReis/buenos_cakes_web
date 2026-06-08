describe("nuqs useQueryState", () => {
	it("reads activeIndex from URL and falls back on invalid value", () => {
		cy.visit("/dashboard?activeIndex=2");
		cy.url().should("include", "activeIndex=2");
		cy.get('button[aria-label="Ir para imagem 3"]')
			.invoke("attr", "class")
			.should("match", /w-5/);

		cy.visit("/dashboard?activeIndex=abc");
		cy.get('button[aria-label="Ir para imagem 1"]')
			.invoke("attr", "class")
			.should("match", /w-5/);

		cy.visit("/dashboard?activeIndex=");
		cy.get('button[aria-label="Ir para imagem 1"]')
			.invoke("attr", "class")
			.should("match", /w-5/);
	});

	it("preserves existing query params when updating activeIndex", () => {
		cy.visit("/dashboard?foo=bar&activeIndex=1");
		cy.get('button[aria-label="Ir para imagem 3"]').click();
		cy.url().should("include", "foo=bar");
		cy.url().should("include", "activeIndex=2");
	});
});
