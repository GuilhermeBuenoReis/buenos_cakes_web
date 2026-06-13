import { addFirstCatalogProductToCart } from "../support/storefront";

interface Customer {
	email: string;
	fullName: string;
	phone: string;
}

function goToCheckoutFromCart() {
	return cy
		.get('[role="dialog"]')
		.contains("button", "Finalizar Pedido")
		.should("not.be.disabled")
		.click()
		.then(() => cy.url().should("match", /\/checkout$/));
}

function goToCheckoutPayment(customer: Customer) {
	return addFirstCatalogProductToCart().then((product) => {
		return goToCheckoutFromCart().then(() => {
			cy.fillReactInput("Nome Completo", customer.fullName);
			cy.fillReactInput("E-mail", customer.email);
			cy.fillReactInput("WhatsApp / Telefone", customer.phone);
			cy.contains("button", "Ir para Pagamento").should("not.be.disabled").click();
			return cy.url().should("match", /\/checkout\/payment$/).then(() => product);
		});
	});
}

function goToCheckoutReview(customer: Customer) {
	return goToCheckoutPayment(customer).then((product) => {
		cy.contains("a", "Continuar para revisão").click();
		return cy.url().should("match", /\/checkout\/review$/).then(() => product);
	});
}

describe("Checkout additional flows", () => {
	it("preserves cash payment details when returning from review to payment", () => {
		goToCheckoutPayment({
			email: "beatriz@exemplo.com",
			fullName: "Beatriz Almeida",
			phone: "(11) 97777-1111",
		}).then(() => {
			cy.contains("label", "Dinheiro").click();
			cy.getByLabel("Precisa de troco?").should("be.visible");
			cy.getByLabel("Precisa de troco?").type("100,00");
			cy.contains("a", "Continuar para revisão").click();

			cy.url().should("match", /\/checkout\/review$/);
			cy.contains("Dinheiro").should("be.visible");
			cy.contains("Troco solicitado para 100,00.").should("be.visible");

			cy.contains("a", "Voltar para pagamento").click();

			cy.url().should("match", /\/checkout\/payment$/);
			cy.contains("Forma selecionada").should("be.visible");
			cy.getByLabel("Precisa de troco?").should("have.value", "100,00");
		});
	});

	it("returns to products with the cart open when editing an item from review", () => {
		goToCheckoutReview({
			email: "camila@exemplo.com",
			fullName: "Camila Araujo",
			phone: "(11) 96666-2222",
		}).then((product) => {
			cy.contains("a", "Editar item").click();

			cy.url().should("match", /\/products\?cart=true$/);
			cy.contains("h1,h2,h3,h4,h5,h6", "Meu Carrinho").should("be.visible");
			cy.get('[role="dialog"]')
				.contains("h1,h2,h3,h4,h5,h6", product.name)
				.should("be.visible");
		});
	});
});
