describe("SweetsCarousel", () => {
	it("auto-advances and updates URL", () => {
		cy.visit("/dashboard?activeIndex=0");
		cy.wait(5500);
		cy.url().should("not.include", "activeIndex=0");
		cy.url().should("include", "activeIndex=");
	});
});
