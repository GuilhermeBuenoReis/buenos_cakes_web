import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfilePage, { metadata } from "./page";

describe("ProfilePage", () => {
	it("exports the profile metadata", () => {
		expect(metadata).toEqual({
			title: "Meu Perfil | Buenos'Cakes",
		});
	});

	it("renders the empty orders state before any checkout confirmation", () => {
		render(<ProfilePage />);

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
	});
});
