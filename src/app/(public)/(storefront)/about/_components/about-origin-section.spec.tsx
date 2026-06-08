import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutOriginSection } from "./about-origin-section";

describe("AboutOriginSection", () => {
	it("renders the story content and the brand commitment card", () => {
		render(<AboutOriginSection />);

		expect(screen.getByText("Onde tudo começou")).toBeVisible();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: "Do sonho caseiro a uma boutique de confeitaria.",
			}),
		).toBeVisible();
		expect(screen.getByText("Nosso compromisso")).toBeVisible();
		expect(
			screen.getByText(
				"Criar doces que pareçam especiais antes mesmo da primeira colherada.",
			),
		).toBeVisible();
		expect(
			screen.getByText(
				"Sabor memorável, acabamento elegante e calor de cozinha de verdade seguem sendo a base de tudo que fazemos.",
			),
		).toBeVisible();
	});
});
