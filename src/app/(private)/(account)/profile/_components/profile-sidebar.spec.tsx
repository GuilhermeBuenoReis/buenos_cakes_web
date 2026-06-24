import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfileSidebar } from "./profile-sidebar";

describe("ProfileSidebar", () => {
	it("renders the customer summary and sidebar navigation", () => {
		render(<ProfileSidebar />);

		expect(screen.getByText("Mariana Silva")).toBeVisible();
		expect(screen.getByText("Cliente desde 2023")).toBeVisible();
		expect(screen.getByText("MS")).toBeVisible();
		expect(screen.getByRole("link", { name: "Meu Perfil" })).toHaveAttribute(
			"href",
			"#profile-personal-info",
		);
		expect(screen.getByRole("link", { name: "Meus Pedidos" })).toHaveAttribute(
			"href",
			"#profile-orders",
		);
		expect(screen.getByRole("link", { name: "Endereços" })).toHaveAttribute(
			"href",
			"#profile-addresses",
		);
		expect(screen.getByRole("button", { name: "Sair" })).toBeDisabled();
	});
});
