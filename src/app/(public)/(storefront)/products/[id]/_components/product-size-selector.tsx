"use client";

import { formatPrice } from "@/lib/format-price";
import { useProductDetails } from "../_context/product-details-context";

export function ProductSizeSelector() {
	const { product, selectedSizeId, setSize, sizeOptions } = useProductDetails();

	return (
		<div className="space-y-2.5">
			<p className="text-[11px] font-extrabold tracking-[0.12em] text-rose-400 uppercase">
				Escolha o tamanho
			</p>
			<div className="grid gap-2 sm:grid-cols-3">
				{sizeOptions.map((size) => {
					const isActive = size.id === selectedSizeId;

					function handleSizeButtonClick() {
						setSize(size.id);
					}

					return (
						<button
							type="button"
							key={size.id}
							aria-pressed={isActive}
							onClick={handleSizeButtonClick}
							className={`rounded-[18px] border px-3 py-2 text-left transition ${
								isActive
									? "border-rose-400 bg-rose-50 shadow-[0_14px_30px_-24px_rgba(244,63,94,0.8)]"
									: "border-slate-200 bg-slate-50/80 hover:border-rose-200 hover:bg-white"
							}`}
						>
							<p className="text-[0.95rem] font-bold text-slate-800">
								{size.label}
							</p>
							<p className="text-[11px] font-medium text-slate-500">
								{size.servings || formatPrice(product.price + size.priceDelta)}
							</p>
						</button>
					);
				})}
			</div>
		</div>
	);
}
