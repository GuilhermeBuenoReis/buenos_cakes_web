"use client";

import { ptBR } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { dayjs } from "@/lib/dayjs";

interface CheckoutPickupCalendarPanelProps {
	onSelect: (date: Date | undefined) => void;
	range: { from: Date; to: Date };
	selectedDate: Date;
	timeZone?: string;
}

export function CheckoutPickupCalendarPanel({
	onSelect,
	range,
	selectedDate,
	timeZone,
}: CheckoutPickupCalendarPanelProps) {
	return (
		<div
			className="rounded-[1.75rem] border border-[#ebe3e3] bg-[#fffdfb] p-3 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.16)]"
			data-testid="pickup-calendar-panel"
		>
			<Calendar
				mode="single"
				selected={selectedDate}
				onSelect={onSelect}
				buttonVariant="ghost"
				className="w-full rounded-[1.4rem] bg-[#fffdfa] p-4 [--cell-size:2.65rem] sm:[--cell-size:2.85rem]"
				disabled={(date) =>
					dayjs(date).isBefore(range.from, "day") ||
					dayjs(date).isAfter(range.to, "day")
				}
				locale={ptBR}
				timeZone={timeZone}
			/>

			<p className="px-2 pb-2 text-xs font-medium text-slate-500">
				Disponível somente entre hoje e a próxima semana.
			</p>
		</div>
	);
}
