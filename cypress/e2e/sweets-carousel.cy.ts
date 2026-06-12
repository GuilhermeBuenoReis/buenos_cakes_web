describe("SweetsCarousel", () => {
	it("auto-advances and updates URL", () => {
		cy.visit("/dashboard?activeIndex=0");
		cy.url({ timeout: 8000 }).should("not.include", "activeIndex=0");
		cy.url().should("include", "activeIndex=");
	});
});
