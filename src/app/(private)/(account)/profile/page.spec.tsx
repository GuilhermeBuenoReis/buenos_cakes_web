import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage, { metadata } from "./page";

const mocks = vi.hoisted(() => ({
	fetchCurrentUser: vi.fn(),
	getServerBackendAuthHeaders: vi.fn(),
	listOrderItemsByOrder: vi.fn(),
	listUserAddresses: vi.fn(),
	listUserOrders: vi.fn(),
}));

vi.mock("@/api/backend/profile", () => ({
	fetchCurrentUser: mocks.fetchCurrentUser,
	listOrderItemsByOrder: mocks.listOrderItemsByOrder,
	listUserAddresses: mocks.listUserAddresses,
	listUserOrders: mocks.listUserOrders,
}));

vi.mock("@/api/backend/server-auth", () => ({
	getServerBackendAuthHeaders: mocks.getServerBackendAuthHeaders,
}));

describe("ProfilePage", () => {
	beforeEach(() => {
		mocks.fetchCurrentUser.mockReset();
		mocks.getServerBackendAuthHeaders.mockReset();
		mocks.listOrderItemsByOrder.mockReset();
		mocks.listUserAddresses.mockReset();
		mocks.listUserOrders.mockReset();
		mocks.getServerBackendAuthHeaders.mockResolvedValue({
			Authorization: "Bearer token",
		});
		mocks.fetchCurrentUser.mockResolvedValue({
			user: {
				cpf: "***.456.789-**",
				createdAt: "2023-01-01T00:00:00Z",
				email: "mariana.silva@email.com.br",
				id: "usr_123",
				name: "Mariana Silva de Oliveira",
				phone: "(11) 98765-4321",
				role: "customer",
				updatedAt: null,
			},
		});
		mocks.listUserAddresses.mockResolvedValue({
			addresses: [
				{
					city: "São Paulo",
					complement: null,
					createdAt: "2026-01-01T00:00:00Z",
					houseNumber: "184",
					id: "adr_123",
					isDefault: true,
					label: "Casa",
					recipientName: "Mariana Silva",
					reference: "Referência: portão branco ao lado da floricultura.",
					state: "SP",
					street: "Rua das Camélias",
					updatedAt: null,
					userId: "usr_123",
					zipCode: "00000-000",
				},
			],
		});
		mocks.listUserOrders.mockResolvedValue({
			orders: [],
		});
	});

	it("exports the profile metadata", () => {
		expect(metadata).toEqual({
			title: "Meu Perfil | Buenos'Cakes",
		});
	});

	it("renders user, addresses and empty orders from the backend", async () => {
		render(<NuqsTestingAdapter>{await ProfilePage()}</NuqsTestingAdapter>);

		expect(screen.getByText("Mariana Silva")).toBeVisible();
		expect(
			screen.getByRole("heading", { name: "Informações Pessoais" }),
		).toBeVisible();
		expect(
			screen.getByRole("heading", { name: "Pedidos Recentes" }),
		).toBeVisible();
		expect(
			screen.getByRole("heading", { name: "Endereços salvos" }),
		).toBeVisible();
		expect(
			screen.getByText("Você ainda não confirmou nenhum pedido."),
		).toBeVisible();
		expect(screen.getByText("Rua das Camélias, 184")).toBeVisible();
		expect(mocks.listUserAddresses).toHaveBeenCalledWith(
			{ userId: "usr_123" },
			{ headers: { Authorization: "Bearer token" } },
		);
	});
});
