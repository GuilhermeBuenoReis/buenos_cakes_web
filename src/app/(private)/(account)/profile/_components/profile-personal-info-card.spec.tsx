import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import { ProfilePersonalInfoCard } from "./profile-personal-info-card";

describe("ProfilePersonalInfoCard", () => {
	it("renders the personal data fields and edit action", () => {
		render(
			<NuqsTestingAdapter>
				<ProfilePersonalInfoCard userId="test-user-id" />
			</NuqsTestingAdapter>,
		);

		expect(
			screen.getByRole("heading", { name: "Informações Pessoais" }),
		).toBeVisible();
		expect(screen.getByText("Mariana Silva de Oliveira")).toBeVisible();
		expect(screen.getByText("mariana.silva@email.com.br")).toBeVisible();
		expect(screen.getByText("(11) 98765-4321")).toBeVisible();
		expect(screen.getByText("***.456.789-**")).toBeVisible();
		expect(
			screen.getByRole("button", { name: "Editar perfil" }),
		).toBeVisible();
	});
});
