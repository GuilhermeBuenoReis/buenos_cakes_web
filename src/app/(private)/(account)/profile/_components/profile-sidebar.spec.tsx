import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileSidebar } from "./profile-sidebar";

const mocks = vi.hoisted(() => ({
	clearAuthSession: vi.fn(),
	navigateToPath: vi.fn(),
}));

vi.mock("@/lib/auth/browser-session", () => ({
	clearAuthSession: mocks.clearAuthSession,
}));

vi.mock("@/lib/client-navigation", () => ({
	navigateToPath: mocks.navigateToPath,
}));

describe("ProfileSidebar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

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
		expect(screen.getByRole("button", { name: "Sair" })).toBeEnabled();
	});

	it("clears the session and redirects to sign-in when signing out", async () => {
		const user = userEvent.setup();

		render(<ProfileSidebar />);

		await user.click(screen.getByRole("button", { name: "Sair" }));

		expect(mocks.clearAuthSession).toHaveBeenCalledTimes(1);
		expect(mocks.navigateToPath).toHaveBeenCalledWith("/sign-in");
	});
});
