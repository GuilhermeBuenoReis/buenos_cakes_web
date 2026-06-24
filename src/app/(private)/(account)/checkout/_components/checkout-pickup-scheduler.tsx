"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dayjs, getCalendarDayKey } from "@/lib/dayjs";
import { useCheckoutPickup } from "../_context/checkout-pickup-context";
import {
	formatPickupSummaryDate,
	getInitialPickupDate,
	getPickupCalendarRange,
	getQuickPickDates,
	pickupEndTime,
	pickupStartTime,
	pickupStepInSeconds,
} from "../_lib/checkout-pickup";
import { CheckoutPickupCalendarPanel } from "./checkout-pickup-calendar-panel";
import { CheckoutPickupDayButton } from "./checkout-pickup-day-button";

export {
	defaultPickupTime,
	formatPickupSummaryDate,
	getInitialPickupDate,
} from "../_lib/checkout-pickup";

export function CheckoutPickupScheduler() {
	const { pickupDate, pickupTime, setPickupDate, setPickupTime } =
		useCheckoutPickup();
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [timeZone, setTimeZone] = useState<string>();

	useEffect(() => {
		setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
	}, []);

	const baseDate = useMemo(() => getInitialPickupDate(), []);

	const quickPickDates = useMemo(() => getQuickPickDates(baseDate), [baseDate]);

	const pickupRange = useMemo(
		() => getPickupCalendarRange(baseDate),
		[baseDate],
	);

	const isDateInQuickList = quickPickDates.some((date) =>
		dayjs(date).isSame(pickupDate, "day"),
	);

	function handleQuickPickDateSelect(date: Date) {
		setPickupDate(date);
		setIsCalendarOpen(false);
	}

	function handleCalendarToggleClick() {
		setIsCalendarOpen((current) => !current);
	}

	function handleCalendarDateSelect(date: Date | undefined) {
		if (!date) {
			return;
		}

		setPickupDate(dayjs(date).startOf("day").toDate());
		setIsCalendarOpen(false);
	}

	function handlePickupTimeChange(event: ChangeEvent<HTMLInputElement>) {
		setPickupTime(event.target.value);
	}

	return (
		<div className="mt-6 space-y-6">
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
					<CalendarDays className="size-4 text-rose-500" />
					<span>Semana de retirada</span>
				</div>

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
					{quickPickDates.map((date) => (
						<CheckoutPickupDayButton
							key={getCalendarDayKey(date)}
							date={date}
							isSelected={dayjs(date).isSame(pickupDate, "day")}
							onSelect={handleQuickPickDateSelect}
						/>
					))}
				</div>

				<div className="rounded-[1.6rem] border border-[#efe2e3] bg-[#fff9f8] p-4 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.14)] sm:p-5">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<p className="text-sm font-bold text-slate-900">
								Precisa escolher outra data?
							</p>
							<p className="text-sm leading-6 text-slate-600">
								Você pode agendar qualquer dia até{" "}
								{formatPickupSummaryDate(pickupRange.to).toLowerCase()}.
							</p>
						</div>

						{isDateInQuickList ? null : (
							<span className="inline-flex rounded-full border border-[#eedbde] bg-white px-3 py-1 text-xs font-bold text-rose-500">
								{formatPickupSummaryDate(pickupDate)}
							</span>
						)}
					</div>

					<Button
						className="mt-4 h-11 rounded-full border-[#e7dfdf] bg-white px-5 text-slate-700 shadow-[0_12px_26px_-24px_rgba(15,23,42,0.18)] hover:border-rose-200 hover:bg-white hover:text-rose-500"
						type="button"
						variant="outline"
						onClick={handleCalendarToggleClick}
					>
						Escolher no calendário
					</Button>
				</div>

				{isCalendarOpen ? (
					<CheckoutPickupCalendarPanel
						onSelect={handleCalendarDateSelect}
						range={pickupRange}
						selectedDate={pickupDate}
						timeZone={timeZone}
					/>
				) : null}
			</div>

			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
				<div className="rounded-[1.5rem] border border-[#ece4e4] bg-[#fffdfb] p-4 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.14)]">
					<p className="text-sm font-semibold text-slate-600">
						Data escolhida para retirada
					</p>
					<p className="mt-2 text-base font-extrabold leading-7 text-slate-950">
						{formatPickupSummaryDate(pickupDate)}
					</p>
				</div>

				<div className="rounded-[1.5rem] border border-[#ece4e4] bg-[#fffdfb] p-4 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.14)]">
					<label
						className="flex items-center gap-2 text-sm font-semibold text-slate-700"
						htmlFor="pickup-time"
					>
						<Clock3 className="size-4 text-rose-500" />
						Horário da retirada
					</label>

					<div className="relative mt-3">
						<Clock3 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
						<Input
							className="h-12 rounded-[1.15rem] border-[#e8e1e1] bg-[#fffdfb] px-4 pl-11 text-slate-700 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.18)] focus-visible:border-rose-300 focus-visible:ring-4 focus-visible:ring-rose-100/80"
							id="pickup-time"
							max={pickupEndTime}
							min={pickupStartTime}
							step={pickupStepInSeconds}
							type="time"
							value={pickupTime}
							onChange={handlePickupTimeChange}
						/>
					</div>

					<p className="mt-3 text-xs leading-5 text-slate-500">
						Horários disponíveis entre 09:00 e 18:30, com intervalos de 30
						minutos.
					</p>
				</div>
			</div>
		</div>
	);
}
