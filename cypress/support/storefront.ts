export interface ProductInfo {
	detailsHref: string;
	name: string;
}

export interface SizeInfo {
	count: number;
	label: string;
}

export interface FillingInfo {
	count: number;
	label: string;
}

function extractProductName(ariaLabel: string) {
	const name = ariaLabel.replace(/^Ver detalhes de\s+/, "").trim();
	if (!name) throw new Error("Não foi possível identificar o nome do produto.");
	return name;
}

function normalizeFilllingLabel(raw: string) {
	return raw
		.replace(/\s+/g, " ")
		.replace(/\s+\(\+R\$.*\)$/, "")
		.trim();
}

export function getFirstCatalogProduct(): Cypress.Chainable<ProductInfo> {
	return cy
		.get('a[aria-label^="Ver detalhes de "]')
		.first()
		.should("be.visible")
		.then(($link) => {
			const label = $link.attr("aria-label") ?? "";
			const detailsHref = $link.attr("href") ?? "";
			return { detailsHref, name: extractProductName(label) };
		});
}

export function openFirstCatalogProductDetails(): Cypress.Chainable<ProductInfo> {
	cy.visit("/products");
	return cy
		.get('a[aria-label^="Ver detalhes de "]')
		.first()
		.should("be.visible")
		.then(($link) => {
			const label = $link.attr("aria-label") ?? "";
			const detailsHref = $link.attr("href") ?? "";
			const name = extractProductName(label);
			return cy
				.wrap($link)
				.click()
				.then(() => cy.url().should("match", /\/products\/[^/?#]+/))
				.then(() => ({ detailsHref, name }));
		});
}

export function addFirstCatalogProductToCart(): Cypress.Chainable<ProductInfo> {
	cy.visit("/products");
	return cy
		.get('a[aria-label^="Ver detalhes de "]')
		.first()
		.should("be.visible")
		.then(($link) => {
			const label = $link.attr("aria-label") ?? "";
			const detailsHref = $link.attr("href") ?? "";
			const name = extractProductName(label);
			return cy
				.get(`button[aria-label="Adicionar ${name} ao carrinho"]`)
				.first()
				.click()
				.then(() =>
					cy
						.get('[role="dialog"]')
						.should("be.visible")
						.and("contain.text", "Meu Carrinho"),
				)
				.then(() =>
					cy
						.get('[role="dialog"] article')
						.filter(`:contains("${name}")`)
						.first()
						.should("be.visible"),
				)
				.then(() => ({ detailsHref, name }));
		});
}

export function getCartItemByName(
	productName: string,
): Cypress.Chainable<JQuery<HTMLElement>> {
	return cy
		.get('[role="dialog"] article')
		.filter(`:contains("${productName}")`)
		.first();
}

export function selectProductSizeByIndex(
	index: number,
): Cypress.Chainable<SizeInfo> {
	return cy
		.get("button[aria-pressed]")
		.should("have.length.gte", 1)
		.then(($buttons) => {
			const count = $buttons.length;
			const safeIndex = Math.min(Math.max(index, 0), count - 1);
			const $btn = $buttons.eq(safeIndex);
			const label = $btn.find("p").first().text().trim();
			return cy.wrap($btn).click().then(() => ({ count, label }));
		});
}

export function selectLastProductSize(): Cypress.Chainable<SizeInfo> {
	return cy
		.get("button[aria-pressed]")
		.should("have.length.gte", 1)
		.then(($buttons) => {
			const count = $buttons.length;
			const $btn = $buttons.last();
			const label = $btn.find("p").first().text().trim();
			return cy.wrap($btn).click().then(() => ({ count, label }));
		});
}

export function selectLastProductFilling(): Cypress.Chainable<FillingInfo> {
	cy.get('[aria-label="Selecionar recheio extra"]').click();
	return cy
		.get('[role="option"]')
		.should("have.length.gte", 1)
		.then(($options) => {
			const count = $options.length;
			const $last = $options.last();
			const rawLabel = $last.text();
			const label = normalizeFilllingLabel(rawLabel);
			return cy.wrap($last).click().then(() => ({ count, label }));
		});
}
