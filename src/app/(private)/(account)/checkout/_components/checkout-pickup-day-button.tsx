"use client";

import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import {
	formatPickupMonthLabel,
	formatPickupSummaryDate,
	formatWeekButtonLabel,
} from "../_lib/checkout-pickup";

interface CheckoutPickupDayButtonProps {
	date: Date;
	isSelected: boolean;
	onSelect: (date: Date) => void;
}

export function CheckoutPickupDayButton({
	date,
	isSelected,
	onSelect,
}: CheckoutPickupDayButtonProps) {
	function handleClick() {
		onSelect(date);
	}

	return (
		<button
			type="button"
			aria-label={`Selecionar retirada em ${formatPickupSummaryDate(date)}`}
			aria-pressed={isSelected}
			className={cn(
				"min-h-30 rounded-[1.4rem] border px-3 py-3.5 text-center transition-all",
				isSelected
					? "border-rose-300 bg-[#fff2f4] text-slate-900 shadow-[0_18px_30px_-26px_rgba(216,98,126,0.28)]"
					: "border-[#ece4e4] bg-[#fffdfb] text-slate-600 hover:border-rose-200 hover:bg-[#fff8f8]",
			)}
			onClick={handleClick}
		>
			<div
				className={cn(
					"text-[10px] font-bold tracking-[0.16em] uppercase",
					isSelected ? "text-rose-500" : "text-slate-400",
				)}
			>
				{formatWeekButtonLabel(date)}
			</div>
			<div
				className={cn(
					"mx-auto mt-3 flex size-11 items-center justify-center rounded-full text-lg font-extrabold leading-none",
					isSelected ? "bg-rose-500 text-white" : "bg-[#f5f0f0] text-slate-700",
				)}
			>
				{dayjs(date).format("DD")}
			</div>
			<div
				className={cn(
					"mt-3 text-[11px] font-semibold uppercase",
					isSelected ? "text-slate-700" : "text-slate-400",
				)}
			>
				{formatPickupMonthLabel(date)}
			</div>
		</button>
	);
}
