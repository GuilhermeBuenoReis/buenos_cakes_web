import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryProvider } from "@/components/application/query-provider";
import { clearAuthSession } from "@/lib/auth/browser-session";
import {
	AUTH_SESSION_COOKIE_NAME,
	AUTH_SESSION_COOKIE_VALUE,
	authRedirects,
	authSessionStorageKeys,
} from "@/lib/auth/session-config";
import { SignInForm } from "./sign-in-form";

const authenticateUserMock = vi.hoisted(() => vi.fn());
const routerReplaceMock = vi.hoisted(() => vi.fn());
const searchParamsMock = vi.hoisted(() => new URLSearchParams());

vi.mock("@/api/backend/auth", () => ({
	authenticateUser: authenticateUserMock,
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: routerReplaceMock,
	}),
	useSearchParams: () => searchParamsMock,
}));

function makeAuthResponse() {
	return {
		accessToken: "access-token",
		user: {
			createdAt: "2026-05-27T12:00:00Z",
			email: "ana.silva@exemplo.com",
			id: "user-1",
			name: "Ana Silva",
			role: "customer",
		},
	};
}

function renderSignInForm() {
	return render(
		<QueryProvider>
			<SignInForm />
		</QueryProvider>,
	);
}

describe("SignInForm", () => {
	beforeEach(() => {
		authenticateUserMock.mockReset();
		routerReplaceMock.mockReset();
		searchParamsMock.forEach((_value, key) => {
			searchParamsMock.delete(key);
		});
		clearAuthSession();
	});

	it("renders the expected fields and navigation links", () => {
		renderSignInForm();

		expect(screen.getByLabelText("E-mail")).toHaveAttribute(
			"placeholder",
			"voce@exemplo.com",
		);
		expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");
		expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
		expect(screen.getByRole("link", { name: "Criar conta" })).toHaveAttribute(
			"href",
			"/sign-up",
		);
	});

	it("validates the fields and clears the messages after valid input", async () => {
		const user = userEvent.setup();

		authenticateUserMock.mockResolvedValue(makeAuthResponse());
		renderSignInForm();

		const emailInput = screen.getByLabelText("E-mail");
		const passwordInput = screen.getByLabelText("Senha");
		const submitButton = screen.getByRole("button", { name: "Entrar" });

		await user.click(submitButton);

		expect(await screen.findByText("Informe um e-mail válido.")).toBeVisible();
		expect(screen.getByText("Informe sua senha.")).toBeVisible();
		expect(emailInput).toHaveAttribute("aria-invalid", "true");
		expect(passwordInput).toHaveAttribute("aria-invalid", "true");

		await user.type(emailInput, "ana.silva@exemplo.com");
		await user.type(passwordInput, "segredo123");
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.queryByText("Informe um e-mail válido."),
			).not.toBeInTheDocument();
			expect(screen.queryByText("Informe sua senha.")).not.toBeInTheDocument();
			expect(emailInput).toHaveAttribute("aria-invalid", "false");
			expect(passwordInput).toHaveAttribute("aria-invalid", "false");
		});

		await waitFor(() => {
			expect(authenticateUserMock).toHaveBeenCalledWith({
				email: "ana.silva@exemplo.com",
				password: "segredo123",
			});
			expect(
				window.localStorage.getItem(authSessionStorageKeys.accessToken),
			).toBe("access-token");
			expect(window.localStorage.getItem(authSessionStorageKeys.user)).toBe(
				JSON.stringify(makeAuthResponse().user),
			);
			expect(document.cookie).toContain(
				`${AUTH_SESSION_COOKIE_NAME}=${AUTH_SESSION_COOKIE_VALUE}`,
			);
			expect(routerReplaceMock).toHaveBeenCalledWith(
				authRedirects.authenticated,
			);
		});
	});

	it("returns to the protected callback route after sign-in", async () => {
		const user = userEvent.setup();

		searchParamsMock.set("callbackUrl", "/checkout?step=payment");
		authenticateUserMock.mockResolvedValue(makeAuthResponse());
		renderSignInForm();

		await user.type(screen.getByLabelText("E-mail"), "ana.silva@exemplo.com");
		await user.type(screen.getByLabelText("Senha"), "segredo123");
		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() => {
			expect(routerReplaceMock).toHaveBeenCalledWith("/checkout?step=payment");
		});
	});
});
