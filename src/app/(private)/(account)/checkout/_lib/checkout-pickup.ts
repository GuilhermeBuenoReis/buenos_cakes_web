import { dayjs } from "@/lib/dayjs";

export const defaultPickupTime = "14:00";
export const pickupEndTime = "18:30";
export const pickupStartTime = "09:00";
export const pickupStepInSeconds = 1800;
export const quickPickDays = 7;

function capitalize(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getInitialPickupDate() {
	return dayjs().startOf("day").toDate();
}

export function formatPickupSummaryDate(date: Date) {
	return capitalize(dayjs(date).format("dddd, DD [de] MMMM"));
}

export function getQuickPickDates(baseDate: Date) {
	return Array.from({ length: quickPickDays }, (_, index) =>
		dayjs(baseDate).add(index, "day").toDate(),
	);
}

export function getPickupCalendarRange(baseDate: Date) {
	const nextWeekBaseDate = dayjs(baseDate).add(1, "week");
	const daysUntilWeekEnd =
		nextWeekBaseDate.day() === 0 ? 0 : 7 - nextWeekBaseDate.day();

	return {
		from: baseDate,
		to: nextWeekBaseDate.add(daysUntilWeekEnd, "day").endOf("day").toDate(),
	};
}

export function formatWeekButtonLabel(date: Date) {
	if (dayjs(date).isSame(dayjs(), "day")) {
		return "Hoje";
	}

	return capitalize(dayjs(date).format("ddd").replace(".", ""));
}

export function formatPickupMonthLabel(date: Date) {
	return dayjs(date).format("MMM").replace(".", "").toUpperCase();
}
