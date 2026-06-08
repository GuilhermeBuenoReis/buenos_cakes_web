import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { dayjs, getCalendarDayKey } from "@/lib/dayjs";
import { CheckoutPickupProvider } from "../_context/checkout-pickup-context";
import {
	CheckoutPickupScheduler,
	defaultPickupTime,
	formatPickupSummaryDate,
	getInitialPickupDate,
} from "./checkout-pickup-scheduler";

function renderCheckoutPickupScheduler() {
	return render(
		<CheckoutPickupProvider>
			<CheckoutPickupScheduler />
		</CheckoutPickupProvider>,
	);
}

describe("CheckoutPickupScheduler", () => {
	it("renders the quick week selection and the time input", () => {
		renderCheckoutPickupScheduler();

		expect(screen.getByText("Semana de retirada")).toBeVisible();
		expect(
			screen.getAllByRole("button", {
				name: /Selecionar retirada em/i,
			}),
		).toHaveLength(7);
		expect(screen.getByLabelText("Horário da retirada")).toHaveValue(
			defaultPickupTime,
		);
		expect(
			screen.getByRole("button", { name: "Escolher no calendário" }),
		).toBeVisible();
	});

	it("opens the calendar and allows selecting a date from the next week", async () => {
		const user = userEvent.setup();
		const calendarOnlyDate = dayjs(getInitialPickupDate())
			.add(7, "day")
			.toDate();

		renderCheckoutPickupScheduler();

		await user.click(
			screen.getByRole("button", { name: "Escolher no calendário" }),
		);

		const calendarPanel = screen.getByTestId("pickup-calendar-panel");
		const nextWeekButton = calendarPanel.querySelector<HTMLButtonElement>(
			`button[data-day="${getCalendarDayKey(calendarOnlyDate)}"]`,
		);

		expect(nextWeekButton).not.toBeNull();
		if (!nextWeekButton) {
			throw new Error("Expected a calendar button for the next week date.");
		}

		await user.click(nextWeekButton);

		expect(
			screen.queryByTestId("pickup-calendar-panel"),
		).not.toBeInTheDocument();
		expect(
			screen.getAllByText(formatPickupSummaryDate(calendarOnlyDate)).length,
		).toBeGreaterThanOrEqual(1);
	});

	it("updates the pickup time", () => {
		renderCheckoutPickupScheduler();

		const pickupTimeInput = screen.getByLabelText("Horário da retirada");

		fireEvent.change(pickupTimeInput, {
			target: { value: "17:00" },
		});

		expect(pickupTimeInput).toHaveValue("17:00");
	});
});
