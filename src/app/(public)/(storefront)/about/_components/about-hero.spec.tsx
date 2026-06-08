import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutHero } from "./about-hero";

describe("AboutHero", () => {
	it("renders the hero badge, heading, description and image", () => {
		render(<AboutHero />);

		expect(screen.getByText("Sobre a Buenos'Cakes")).toBeVisible();
		expect(
			screen.getByRole("heading", { level: 1, name: "Nossa Doce História" }),
		).toBeVisible();
		expect(
			screen.getByRole("img", {
				name: "Confeiteira da Buenos'Cakes em seu ateliê",
			}),
		).toBeVisible();
	});
});
