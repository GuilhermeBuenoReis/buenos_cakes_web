"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductDetails } from "../_context/product-details-context";

export function ProductQuantityStepper() {
	const { quantity, setQuantity } = useProductDetails();

	function handleDecreaseQuantityClick() {
		setQuantity(quantity - 1);
	}

	function handleIncreaseQuantityClick() {
		setQuantity(quantity + 1);
	}

	return (
		<div className="flex h-11 items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-2 sm:w-24">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label="Diminuir quantidade"
				className="h-6.5 w-6.5 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-500"
				onClick={handleDecreaseQuantityClick}
			>
				<Minus className="h-3 w-3" />
			</Button>
			<Input
				aria-label="Quantidade"
				readOnly
				value={quantity}
				className="h-auto border-0 bg-transparent px-0 text-center text-[13px] font-bold text-slate-900 shadow-none focus-visible:ring-0"
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label="Aumentar quantidade"
				className="h-6.5 w-6.5 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-500"
				onClick={handleIncreaseQuantityClick}
			>
				<Plus className="h-3 w-3" />
			</Button>
		</div>
	);
}
