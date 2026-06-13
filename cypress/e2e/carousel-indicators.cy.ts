const mockProducts = {
	products: [
		{
			basePrice: 100,
			categoryId: "cat-1",
			coverImageUrl: "http://localhost:3333/uploads/produto-1.png",
			createdAt: "2026-01-01T00:00:00.000Z",
			description: "Produto 1",
			id: "product-1",
			isActive: true,
			name: "Produto 1",
			popularityScore: 99,
			ratingAvg: 4.9,
			reviewsCount: 10,
			slug: "produto-1",
			updatedAt: null,
		},
		{
			basePrice: 110,
			categoryId: "cat-1",
			coverImageUrl: "http://localhost:3333/uploads/produto-2.png",
			createdAt: "2026-01-01T00:00:00.000Z",
			description: "Produto 2",
			id: "product-2",
			isActive: true,
			name: "Produto 2",
			popularityScore: 88,
			ratingAvg: 4.8,
			reviewsCount: 8,
			slug: "produto-2",
			updatedAt: null,
		},
		{
			basePrice: 120,
			categoryId: "cat-1",
			coverImageUrl: "http://localhost:3333/uploads/produto-3.png",
			createdAt: "2026-01-01T00:00:00.000Z",
			description: "Produto 3",
			id: "product-3",
			isActive: true,
			name: "Produto 3",
			popularityScore: 77,
			ratingAvg: 4.7,
			reviewsCount: 6,
			slug: "produto-3",
			updatedAt: null,
		},
	],
};

function interceptProducts() {
	cy.intercept("GET", "/backend-api/api/products/popularity*", {
		body: mockProducts,
		statusCode: 200,
	}).as("getPopularProducts");

	cy.intercept("GET", "/backend-api/api/products/active*", {
		body: mockProducts,
		statusCode: 200,
	}).as("getActiveProducts");
}

describe("nuqs useQueryState", () => {
	it("reads activeIndex from URL and falls back on invalid value", () => {
		interceptProducts();
		cy.visit("/dashboard?activeIndex=2");
		cy.wait("@getPopularProducts");
		cy.url().should("include", "activeIndex=2");
		cy.get('button[aria-label="Ir para imagem 3"]')
			.invoke("attr", "class")
			.should("match", /w-5/);

		interceptProducts();
		cy.visit("/dashboard?activeIndex=abc");
		cy.wait("@getPopularProducts");
		cy.get('button[aria-label="Ir para imagem 1"]')
			.invoke("attr", "class")
			.should("match", /w-5/);

		interceptProducts();
		cy.visit("/dashboard?activeIndex=");
		cy.wait("@getPopularProducts");
		cy.get('button[aria-label="Ir para imagem 1"]')
			.invoke("attr", "class")
			.should("match", /w-5/);
	});

	it("preserves existing query params when updating activeIndex", () => {
		interceptProducts();
		cy.visit("/dashboard?foo=bar&activeIndex=1");
		cy.wait("@getPopularProducts");
		cy.get('button[aria-label="Ir para imagem 3"]').click();
		cy.url().should("include", "foo=bar");
		cy.url().should("include", "activeIndex=2");
	});
});
