import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryProvider } from "@/components/application/query-provider";
import { SignupForm } from "./signup-form";

const createUserMock = vi.hoisted(() => vi.fn());
const routerPushMock = vi.hoisted(() => vi.fn());

vi.mock("@/api/backend/auth", () => ({
	createUser: createUserMock,
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: routerPushMock,
	}),
}));

function makeCreateUserResponse() {
	return {
		user: {
			createdAt: "2026-05-27T12:00:00Z",
			email: "joao.silva@exemplo.com",
			id: "user-1",
			name: "João da Silva",
			role: "customer",
		},
	};
}

function renderSignupForm() {
	return render(
		<QueryProvider>
			<SignupForm />
		</QueryProvider>,
	);
}

describe("SignupForm", () => {
	beforeEach(() => {
		createUserMock.mockReset();
		routerPushMock.mockReset();
	});

	it("renders the expected fields and navigation links", () => {
		renderSignupForm();

		expect(screen.getByLabelText("Nome completo")).toHaveAttribute(
			"placeholder",
			"João da Silva",
		);
		expect(screen.getByLabelText("E-mail")).toHaveAttribute(
			"placeholder",
			"voce@exemplo.com",
		);
		expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
		expect(screen.getByLabelText("Confirmar senha")).toHaveAttribute(
			"type",
			"password",
		);
		expect(
			screen.getByRole("button", { name: "Criar conta" }),
		).toBeVisible();
		expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute(
			"href",
			"/sign-in",
		);
	});

	it("validates the fields and clears the messages after valid input", async () => {
		const user = userEvent.setup();

		createUserMock.mockResolvedValue(makeCreateUserResponse());
		renderSignupForm();

		const nameInput = screen.getByLabelText("Nome completo");
		const emailInput = screen.getByLabelText("E-mail");
		const passwordInput = screen.getByLabelText("Senha");
		const confirmPasswordInput = screen.getByLabelText("Confirmar senha");
		const submitButton = screen.getByRole("button", { name: "Criar conta" });

		await user.type(nameInput, "João");
		await user.type(emailInput, "joao");
		await user.type(passwordInput, "123");
		await user.type(confirmPasswordInput, "456");
		await user.click(submitButton);

		expect(await screen.findByText("Digite nome e sobrenome.")).toBeVisible();
		expect(screen.getByText("Informe um e-mail válido.")).toBeVisible();
		expect(
			screen.getByText("A senha deve ter pelo menos 8 caracteres."),
		).toBeVisible();
		expect(screen.getByText("As senhas não coincidem.")).toBeVisible();
		expect(nameInput).toHaveAttribute("aria-invalid", "true");
		expect(emailInput).toHaveAttribute("aria-invalid", "true");
		expect(passwordInput).toHaveAttribute("aria-invalid", "true");
		expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "true");

		await user.clear(nameInput);
		await user.type(nameInput, "João da Silva");
		await user.clear(emailInput);
		await user.type(emailInput, "joao.silva@exemplo.com");
		await user.clear(passwordInput);
		await user.type(passwordInput, "segredo123");
		await user.clear(confirmPasswordInput);
		await user.type(confirmPasswordInput, "segredo123");
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.queryByText("Digite nome e sobrenome."),
			).not.toBeInTheDocument();
			expect(
				screen.queryByText("Informe um e-mail válido."),
			).not.toBeInTheDocument();
			expect(
				screen.queryByText("A senha deve ter pelo menos 8 caracteres."),
			).not.toBeInTheDocument();
			expect(
				screen.queryByText("As senhas não coincidem."),
			).not.toBeInTheDocument();
			expect(nameInput).toHaveAttribute("aria-invalid", "false");
			expect(emailInput).toHaveAttribute("aria-invalid", "false");
			expect(passwordInput).toHaveAttribute("aria-invalid", "false");
			expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "false");
		});

		await waitFor(() => {
			expect(createUserMock).toHaveBeenCalledWith({
				email: "joao.silva@exemplo.com",
				name: "João da Silva",
				password: "segredo123",
			});
			expect(routerPushMock).toHaveBeenCalledWith("/sign-in");
		});
	});
});
