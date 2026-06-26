"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/format-price";
import { useProductDetails } from "../_context/product-details-context";

export function ProductFillingSelector() {
	const { fillings, selectedFillingId, setFilling } = useProductDetails();

	if (fillings.length === 0) {
		return null;
	}

	return (
		<div className="space-y-2.5">
			<p className="text-[11px] font-extrabold tracking-[0.12em] text-rose-400 uppercase">
				Recheio extra
			</p>
			<Select value={selectedFillingId} onValueChange={setFilling}>
				<SelectTrigger
					aria-label="Selecionar recheio extra"
					className="h-10 w-full rounded-[18px] border-slate-200 bg-slate-50 px-3.5 text-left text-[13px] text-slate-700"
				>
					<SelectValue placeholder="Selecione um recheio" />
				</SelectTrigger>
				<SelectContent className="rounded-[18px] border-slate-200">
					{fillings.map((filling) => (
						<SelectItem key={filling.id} value={filling.id}>
							{filling.priceDelta > 0
								? `${filling.label} (+${formatPrice(filling.priceDelta)})`
								: filling.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
