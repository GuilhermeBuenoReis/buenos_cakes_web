import {
	openFirstCatalogProductDetails,
	selectLastProductFilling,
	selectLastProductSize,
	selectProductSizeByIndex,
} from "../support/storefront";

describe("Product customization", () => {
	it("persists customization in the URL and rehydrates after reload", () => {
		openFirstCatalogProductDetails().then(() => {
			selectLastProductSize().then((size) => {
				selectLastProductFilling().then((filling) => {
					cy.get('[aria-label="Mensagem personalizada"]').type(
						"Feliz aniversario!",
					);
					cy.contains("button", "Aumentar quantidade").click();

					if (size.count > 1) {
						cy.url().should("include", "size=");
					}
					if (filling.count > 1) {
						cy.url().should("include", "filling=");
					}
					cy.url().should("include", "message=Feliz%20aniversario!");
					cy.url().should("include", "quantity=2");

					cy.reload();

					cy.get(`button[aria-pressed="true"] p`)
						.first()
						.should("contain.text", size.label);
					cy.get('[aria-label="Selecionar recheio extra"]').should(
						"contain.text",
						filling.label,
					);
					cy.get('[aria-label="Mensagem personalizada"]').should(
						"have.value",
						"Feliz aniversario!",
					);
					cy.get('input[aria-label="Quantidade"]').should("have.value", "2");
				});
			});
		});
	});

	it("aggregates identical customizations and keeps different ones separated", () => {
		openFirstCatalogProductDetails().then((product) => {
			selectLastProductSize().then((size) => {
				selectLastProductFilling().then((filling) => {
					cy.get('[aria-label="Mensagem personalizada"]').type("Parabens!");
					cy.contains("button", "Aumentar quantidade").click();
					cy.contains("button", "Adicionar ao Carrinho").click();

					const customizedHighlight = `${size.label} • ${filling.label} • Com mensagem`;

					cy.get('[role="dialog"] article')
						.filter(`:contains("${customizedHighlight}")`)
						.should("contain.text", customizedHighlight);
					cy.get('[role="dialog"] article').should("have.length", 1);
					cy.get(
						`button[aria-label="Adicionar uma unidade de ${product.name}"]`,
					).should("be.visible");

					cy.get('button[aria-label="Fechar carrinho"]').click();
					cy.contains("button", "Adicionar ao Carrinho").click();

					cy.get('[role="dialog"] article').should("have.length", 1);
					cy.get('button[aria-label="Carrinho"]').should("contain.text", "4");
					cy.get('[role="dialog"] article')
						.filter(`:contains("${customizedHighlight}")`)
						.contains(/R\$/)
						.should("be.visible");

					cy.get('button[aria-label="Fechar carrinho"]').click();

					selectProductSizeByIndex(0).then((plainSize) => {
						cy.get('[aria-label="Mensagem personalizada"]').clear();
						cy.contains("button", "Diminuir quantidade").click();
						cy.contains("button", "Adicionar ao Carrinho").click();

						const plainHighlight = `${plainSize.label} • ${filling.label}`;

						cy.get('[role="dialog"] article').should("have.length", 2);
						cy.get('[role="dialog"]').should("contain.text", plainHighlight);
						cy.get('button[aria-label="Carrinho"]').should("contain.text", "5");
					});
				});
			});
		});
	});
});
