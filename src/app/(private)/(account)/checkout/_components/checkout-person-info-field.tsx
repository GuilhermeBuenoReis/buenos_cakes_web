"use client";

import type { ChangeEvent, HTMLInputAutoCompleteAttribute } from "react";
import { type Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { CheckoutPersonalInfoValues } from "../_lib/checkout-personal-info";

interface CheckoutPersonInfoFieldProps {
	autoComplete: HTMLInputAutoCompleteAttribute;
	className?: string;
	control: Control<CheckoutPersonalInfoValues>;
	id: string;
	label: string;
	name: keyof CheckoutPersonalInfoValues;
	onValueChange: (value: string) => void;
	placeholder: string;
	type?: "email" | "tel" | "text";
}

export function CheckoutPersonInfoField({
	autoComplete,
	className,
	control,
	id,
	label,
	name,
	onValueChange,
	placeholder,
	type = "text",
}: CheckoutPersonInfoFieldProps) {
	const errorId = `${id}-error`;

	return (
		<div className={className}>
			<label
				className="text-[13px] font-semibold tracking-[0.01em] text-slate-700"
				htmlFor={id}
			>
				{label}
			</label>
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => {
					function handleChange(event: ChangeEvent<HTMLInputElement>) {
						field.onChange(event);
						onValueChange(event.target.value);
					}

					return (
						<>
							<Input
								aria-describedby={fieldState.error ? errorId : undefined}
								aria-invalid={fieldState.invalid}
								autoComplete={autoComplete}
								id={id}
								placeholder={placeholder}
								type={type}
								value={field.value}
								variant="subtle"
								onBlur={field.onBlur}
								onChange={handleChange}
							/>
							{fieldState.error ? (
								<p className="text-sm font-medium text-red-500" id={errorId}>
									{fieldState.error.message}
								</p>
							) : null}
						</>
					);
				}}
			/>
		</div>
	);
}
