"use client";

import { Input } from "@/components/ui/input";

interface SidebarRatingFilterProps {
	onSelect: (rating: 3 | 4) => void;
	value: number;
}

export function SidebarRatingFilter({
	onSelect,
	value,
}: SidebarRatingFilterProps) {
	function handleFourStarChange() {
		onSelect(4);
	}

	function handleThreeStarChange() {
		onSelect(3);
	}

	return (
		<section className="space-y-2 rounded-lg border border-rose-100/70 bg-white/75 p-2">
			<h2 className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
				<span className="text-rose-500">★</span>
				Avaliação
			</h2>

			<div className="space-y-1 text-xs">
				<div className="flex items-center gap-1.5">
					<Input
						type="radio"
						name="rating"
						value={4}
						checked={value === 4}
						onChange={handleFourStarChange}
						aria-label="Avaliação mínima de 4 estrelas"
						className="h-3 w-3 appearance-auto border-0 bg-transparent p-0 accent-rose-500 shadow-none focus-visible:ring-0"
					/>
					<span className="text-rose-500">★★★★★</span>
					<span className="text-[11px] text-slate-600">4.0 ou mais</span>
				</div>

				<div className="flex items-center gap-1.5">
					<Input
						type="radio"
						name="rating"
						value={3}
						checked={value === 3}
						onChange={handleThreeStarChange}
						aria-label="Avaliação mínima de 3 estrelas"
						className="h-3 w-3 appearance-auto border-0 bg-transparent p-0 accent-rose-500 shadow-none focus-visible:ring-0"
					/>
					<span className="text-rose-500">★★★★☆</span>
					<span className="text-[11px] text-slate-600">3.0 ou mais</span>
				</div>
			</div>
		</section>
	);
}
