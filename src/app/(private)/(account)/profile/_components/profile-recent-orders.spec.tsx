import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { QueryProvider } from "@/components/application/query-provider";
import { createCartItemFromCatalog } from "@/test/catalog-seed";
import { ProfileRecentOrders } from "./profile-recent-orders";

function renderWithProviders(ui: ReactNode) {
	return render(
		<QueryProvider>
			<NuqsTestingAdapter>{ui}</NuqsTestingAdapter>
		</QueryProvider>,
	);
}

describe("ProfileRecentOrders", () => {
	it("renders the orders table with totals, statuses and actions", () => {
		renderWithProviders(
			<ProfileRecentOrders
				orders={[
					{
						dateLabel: "24 Mar, 2026",
						id: "order-9482",
						items: [
							createCartItemFromCatalog("prd_8f3a92c1"),
							createCartItemFromCatalog("prd_b71de54f", 2),
						],
						number: "#9482",
						orderId: "9482",
						scheduledAt: null,
						status: "Confirmado",
						statusTone: "confirmed",
						total: 253.9,
					},
				]}
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "Pedidos Recentes" }),
		).toBeVisible();
		expect(screen.getByRole("link", { name: "Ver todos" })).toHaveAttribute(
			"href",
			"#profile-orders",
		);
		expect(screen.getByText("#9482")).toBeVisible();
		expect(screen.getByText("Bolo Red Velvet Premium + 1 item")).toBeVisible();
		expect(screen.getByText("Confirmado")).toBeVisible();
		expect(screen.getByText("R$ 253,90")).toBeVisible();
		expect(screen.getAllByRole("button", { name: "Detalhes" })).toHaveLength(1);
	});

	it("renders an empty state before backend orders are loaded", () => {
		renderWithProviders(<ProfileRecentOrders />);

		expect(
			screen.getByText("Você ainda não confirmou nenhum pedido."),
		).toBeVisible();
		expect(
			screen.getByText(/Assim que o backend retornar seus pedidos/),
		).toBeVisible();
		expect(
			screen.getByRole("link", { name: "Explorar catálogo" }),
		).toHaveAttribute("href", "/products");
		expect(
			screen.queryByRole("link", { name: "Ver todos" }),
		).not.toBeInTheDocument();
	});
});
