"use client";

import { Star } from "lucide-react";
import { useProductDetails } from "../_context/product-details-context";

const starIds = ["star-1", "star-2", "star-3", "star-4", "star-5"];

export function ProductRatingStars() {
	const { fullStars, product } = useProductDetails();

	return (
		<div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 sm:text-xs">
			<div className="flex items-center gap-0.5 text-rose-500">
				{starIds.map((starId, index) => (
					<Star
						key={starId}
						className={`h-3.5 w-3.5 ${
							index < fullStars ? "fill-current" : "text-rose-200"
						}`}
					/>
				))}
			</div>
			<span>({product.reviews} avaliacoes)</span>
		</div>
	);
}
