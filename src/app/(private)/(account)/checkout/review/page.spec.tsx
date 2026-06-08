import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CartSheetProvider } from "@/contexts/cart-sheet-context";
import { createCartItemFromCatalog } from "@/test/catalog-seed";
import { CheckoutCustomerProvider } from "../_context/checkout-customer-context";
import { CheckoutPaymentProvider } from "../_context/checkout-payment-context";
import { CheckoutPickupProvider } from "../_context/checkout-pickup-context";
import { defaultCheckoutPersonalInfoValues } from "../_lib/checkout-personal-info";
import { metadata } from "./layout";
import CheckoutReviewPage from "./page";

const assignLocationMock = vi.fn();
const mocks = vi.hoisted(() => ({
	createCheckoutPayment: vi.fn(),
	createOrder: vi.fn(),
	createOrderItem: vi.fn(),
	fetchCurrentUser: vi.fn(),
}));

vi.mock("@/api/backend/checkout", () => ({
	createCheckoutPayment: mocks.createCheckoutPayment,
	createOrder: mocks.createOrder,
	createOrderItem: mocks.createOrderItem,
}));

vi.mock("@/api/backend/profile", () => ({
	fetchCurrentUser: mocks.fetchCurrentUser,
}));

vi.mock("@/lib/client-navigation", () => ({
	navigateToPath: (path: string) => assignLocationMock(path),
}));

function renderCheckoutReviewPage({
	customerInfo = {
		email: "ana.souza@exemplo.com",
		fullName: "Ana Beatriz Souza",
		phone: "(11) 99876-5432",
	},
	initialItems = [
		createCartItemFromCatalog("prd_8f3a92c1"),
		createCartItemFromCatalog("prd_b71de54f", 2),
	],
}: {
	customerInfo?: {
		email: string;
		fullName: string;
		phone: string;
	};
	initialItems?: ReturnType<typeof createCartItemFromCatalog>[];
} = {}) {
	return render(
		<NuqsTestingAdapter hasMemory>
			<CartSheetProvider initialItems={initialItems}>
				<CheckoutPickupProvider>
					<CheckoutCustomerProvider initialCustomerInfo={customerInfo}>
						<CheckoutPaymentProvider initialSelectedMethod="debit-card">
							<CheckoutReviewPage />
						</CheckoutPaymentProvider>
					</CheckoutCustomerProvider>
				</CheckoutPickupProvider>
			</CartSheetProvider>
		</NuqsTestingAdapter>,
	);
}

describe("CheckoutReviewPage", () => {
	beforeEach(() => {
		assignLocationMock.mockReset();
		mocks.createCheckoutPayment.mockReset();
		mocks.createOrder.mockReset();
		mocks.createOrderItem.mockReset();
		mocks.fetchCurrentUser.mockReset();
		mocks.fetchCurrentUser.mockResolvedValue({
			user: {
				cpf: null,
				createdAt: "2026-01-01T00:00:00Z",
				email: "ana.souza@exemplo.com",
				id: "usr_123",
				name: "Ana Beatriz Souza",
				phone: "(11) 99876-5432",
				role: "customer",
				updatedAt: null,
			},
		});
		mocks.createOrder.mockResolvedValue({
			order: {
				createdAt: "2026-06-03T12:00:00Z",
				customerNote: null,
				deliveryAddressId: null,
				deliveryFee: 0,
				fulfillmentMethod: "pickup",
				id: "ord_123",
				pickupScheduledAt: "2026-06-03T17:00:00Z",
				status: "pending",
				subtotal: 253.9,
				total: 253.9,
				updatedAt: null,
				userId: "usr_123",
			},
		});
		mocks.createOrderItem.mockResolvedValue({
			orderItem: {
				createdAt: "2026-06-03T12:00:00Z",
				id: "ori_123",
				note: null,
				orderId: "ord_123",
				productFillingId: null,
				productId: "prd_8f3a92c1",
				productSizeId: null,
				quantity: 1,
				total: 145.9,
				unitPrice: 145.9,
				updatedAt: null,
			},
		});
		mocks.createCheckoutPayment.mockResolvedValue({
			checkoutUrl: "https://pay.example/checkout",
			payment: {
				amount: 253.9,
				canceledAt: null,
				createdAt: "2026-06-03T12:00:00Z",
				currency: "BRL",
				expiresAt: null,
				failureReason: null,
				id: "pay_123",
				method: null,
				orderId: "ord_123",
				paidAt: null,
				pixQrCode: null,
				pixQrCodeUrl: null,
				provider: "external",
				providerClientSecret: null,
				providerCustomerId: null,
				providerName: null,
				providerPaymentMethodId: null,
				providerReferenceId: null,
				providerSessionId: null,
				providerStatus: null,
				refundedAt: null,
				status: "pending",
				updatedAt: null,
			},
		});
	});

	it("creates the order, clears the cart and redirects to checkout payment", async () => {
		const user = userEvent.setup();

		renderCheckoutReviewPage();

		await user.click(screen.getByRole("button", { name: "Confirmar Pedido" }));

		await waitFor(() => {
			expect(assignLocationMock).toHaveBeenCalledWith(
				"https://pay.example/checkout",
			);
		});
		expect(mocks.fetchCurrentUser).toHaveBeenCalledTimes(1);
		expect(mocks.createOrder).toHaveBeenCalledWith(
			expect.objectContaining({
				fulfillmentMethod: "pickup",
				userId: "usr_123",
			}),
		);
		expect(mocks.createOrderItem).toHaveBeenCalledTimes(2);
		expect(mocks.createCheckoutPayment).toHaveBeenCalledWith(
			expect.objectContaining({
				customerEmail: "ana.souza@exemplo.com",
				orderId: "ord_123",
			}),
		);
	});

	it("exports the review metadata from the nested layout", () => {
		expect(metadata).toEqual({
			title: "Revisão do Pedido | Buenos'Cakes",
		});
	});

	it("renders the final review step with catalog items and collected checkout data", () => {
		renderCheckoutReviewPage();

		expect(
			screen.getByRole("heading", { name: "Revisão do Pedido" }),
		).toBeVisible();
		expect(screen.getByText("Etapa 3 de 3")).toBeVisible();
		expect(screen.getByText("Bolo Red Velvet Premium")).toBeVisible();
		expect(screen.getByText("Caixa Brigadeiro Belga")).toBeVisible();
		expect(screen.getAllByText("Cartão de débito").length).toBeGreaterThan(0);
		expect(screen.getByText("Ana Beatriz Souza")).toBeVisible();
		expect(screen.getByText("ana.souza@exemplo.com")).toBeVisible();
		expect(screen.getByText("(11) 99876-5432")).toBeVisible();
		expect(screen.getAllByText("R$ 253,90").length).toBeGreaterThan(0);
		expect(
			screen.getByRole("link", { name: "Voltar para pagamento" }),
		).toHaveAttribute("href", "/checkout/payment");
		expect(
			screen.getByRole("button", { name: "Confirmar Pedido" }),
		).toBeEnabled();
	});

	it("shows the empty state and disables confirmation when the checkout data is incomplete", () => {
		renderCheckoutReviewPage({
			customerInfo: defaultCheckoutPersonalInfoValues,
			initialItems: [],
		});

		expect(screen.getByText("Seu carrinho ainda está vazio.")).toBeVisible();
		expect(
			screen.getByRole("button", { name: "Confirmar Pedido" }),
		).toBeDisabled();
	});
});
