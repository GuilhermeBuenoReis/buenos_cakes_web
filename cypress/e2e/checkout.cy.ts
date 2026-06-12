import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { addFirstCatalogProductToCart } from "../support/storefront";

dayjs.locale("pt-br");

function getInitialPickupDate() {
	return dayjs().startOf("day").toDate();
}

function formatPickupSummaryDate(date: Date) {
	const formatted = dayjs(date).format("dddd, DD [de] MMMM");
	return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function goToCheckoutFromCart() {
	return cy
		.get('[role="dialog"]')
		.within(() => {
			cy.contains("button", "Finalizar Pedido")
				.should("be.visible")
				.and("not.be.disabled")
				.click();
		})
		.then(() => cy.url().should("match", /\/checkout$/));
}

function addCatalogProductAndGoToCheckout() {
	return addFirstCatalogProductToCart().then((product) => {
		return goToCheckoutFromCart().then(() => product);
	});
}

describe("Checkout", () => {
	it("navigates from the cart to checkout and preserves the order summary", () => {
		addFirstCatalogProductToCart().then((product) => {
			cy.contains("h1,h2,h3,h4,h5,h6", "Meu Carrinho").should("be.visible");
			goToCheckoutFromCart();

			cy.contains("h1,h2,h3,h4,h5,h6", "Finalizar Pedido").should("be.visible");
			cy.contains(product.name).should("be.visible");
			cy.contains("Qtd. 1").should("be.visible");
			cy.contains("1 item").should("be.visible");
			cy.contains("button", "Ir para Pagamento").should("be.disabled");
		});
	});

	it("shows the empty state and disabled actions when opening checkout without cart items", () => {
		cy.visit("/checkout");
		cy.contains("Seu carrinho ainda está vazio.").should("be.visible");
		cy.contains("button", "Próximo Passo").should("be.disabled");
		cy.contains("button", "Ir para Pagamento").should("be.disabled");
		cy.get('[data-testid="pickup-schedule-summary"]').should(
			"have.text",
			"Às 14:00",
		);
	});

	it("updates the pickup summary after changing the pickup date directly on checkout", () => {
		cy.visit("/checkout");
		cy.contains("button", "Escolher no calendário").click();

		cy.get('[data-testid="pickup-calendar-panel"]').should("be.visible");

		const calendarOnlyDate = dayjs(getInitialPickupDate())
			.add(7, "day")
			.toDate();
		const dayKey = dayjs(calendarOnlyDate).format("YYYY-MM-DD");

		cy.get('[data-testid="pickup-calendar-panel"]')
			.find(`button[data-day="${dayKey}"]`)
			.click();

		cy.get('[data-testid="pickup-calendar-panel"]').should("not.exist");
		cy.get('[data-testid="pickup-date-summary"]').should(
			"have.text",
			formatPickupSummaryDate(calendarOnlyDate),
		);
		cy.get('[data-testid="pickup-schedule-summary"]').should(
			"have.text",
			"Às 14:00",
		);
	});

	it("returns to products with cart query when clicking back to cart", () => {
		cy.visit("/checkout");
		cy.contains("a", "Voltar ao Carrinho").click();
		cy.url().should("match", /\/products\?cart=true$/);
	});

	it("moves to the payment step when clicking next step", () => {
		addCatalogProductAndGoToCheckout().then(() => {
			cy.fillReactInput("Nome Completo", "Ana Beatriz Souza");
			cy.fillReactInput("E-mail", "ana.souza@exemplo.com");
			cy.fillReactInput("WhatsApp / Telefone", "(11) 99876-5432");
			cy.contains("button", "Próximo Passo").should("not.be.disabled").click();

			cy.url().should("match", /\/checkout\/payment$/);
			cy.contains("h1,h2,h3,h4,h5,h6", "Pagamento do Pedido").should(
				"be.visible",
			);
			cy.contains("Escolha como deseja pagar").should("be.visible");
		});
	});

	it("keeps progression disabled while personal info is invalid", () => {
		addCatalogProductAndGoToCheckout().then(() => {
			cy.contains("button", "Próximo Passo").should("be.disabled");
			cy.contains("button", "Ir para Pagamento").should("be.disabled");
		});
	});

	it("confirms the order and makes it available in the profile page", () => {
		addCatalogProductAndGoToCheckout().then((product) => {
			cy.fillReactInput("Nome Completo", "Ana Beatriz Souza");
			cy.fillReactInput("E-mail", "ana.souza@exemplo.com");
			cy.fillReactInput("WhatsApp / Telefone", "(11) 99876-5432");

			cy.contains("button", "Próximo Passo").should("not.be.disabled").click();
			cy.url().should("match", /\/checkout\/payment$/);

			cy.contains("label", "Dinheiro").click();
			cy.contains("a", "Continuar para revisão").click();

			cy.url().should("match", /\/checkout\/review$/);
			cy.contains("h1,h2,h3,h4,h5,h6", "Revisão do Pedido").should(
				"be.visible",
			);
			cy.contains(product.name).should("be.visible");
			cy.contains("Ana Beatriz Souza").should("be.visible");
			cy.contains("ana.souza@exemplo.com").should("be.visible");
			cy.contains("(11) 99876-5432").should("be.visible");
			cy.contains("Dinheiro").should("be.visible");
			cy.contains("Às 14:00").first().should("be.visible");
			cy.contains("a", "Voltar para pagamento").should(
				"have.attr",
				"href",
				"/checkout/payment",
			);
			cy.contains("button", "Confirmar Pedido").should("not.be.disabled");

			cy.contains("button", "Confirmar Pedido").click();

			cy.url().should("match", /\/profile#order-/);
			cy.contains("h1,h2,h3,h4,h5,h6", "Pedidos Recentes").should("be.visible");

			cy.url().then((url) => {
				const confirmedOrderId = new URL(url).hash.slice(1);
				cy.get(`[id="${confirmedOrderId}"]`).should("be.visible");
				cy.get(`[id="${confirmedOrderId}"]`)
					.contains(/^#[A-Z0-9]{8}$/)
					.should("be.visible");
				cy.get(`[id="${confirmedOrderId}"]`)
					.contains(/R\$/)
					.should("be.visible");
				cy.get('button[aria-label="Carrinho"]').should("contain.text", "0");

				cy.reload();

				cy.url().should("match", /\/profile#order-/);
				cy.get(`[id="${confirmedOrderId}"]`).should("be.visible");
			});
		});
	});
});
