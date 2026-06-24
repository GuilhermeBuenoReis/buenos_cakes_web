"use client";

import type { ChangeEvent } from "react";
import { useProductDetails } from "../_context/product-details-context";

export function ProductMessageField() {
	const { message, setMessage } = useProductDetails();

	function handleMessageChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setMessage(event.target.value);
	}

	return (
		<div className="space-y-2.5">
			<div className="flex items-center justify-between gap-3">
				<p className="text-[11px] font-extrabold tracking-[0.12em] text-rose-400 uppercase">
					Mensagem personalizada
				</p>
				<span className="text-[11px] font-medium text-slate-400">
					{message.length}/50
				</span>
			</div>
			<textarea
				aria-label="Mensagem personalizada"
				value={message}
				onChange={handleMessageChange}
				placeholder="Ex: Feliz aniversario, Maria!"
				className="min-h-20 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
			/>
		</div>
	);
}
