"use client";

import {
	Cookie,
	CupSoda,
	Gift,
	LayoutGrid,
	type LucideIcon,
} from "lucide-react";
import type { MouseEvent } from "react";
import { useProductsCatalog } from "../_context/products-catalog-context";

function getCategoryIcon(label: string): LucideIcon {
	if (label === "Bolos") return CupSoda;
	if (label === "Cookies") return Cookie;
	if (label === "Doces Finos") return Gift;
	if (label === "Padaria") return Gift;
	return LayoutGrid;
}

export function SidebarCategoryList() {
	const { categories, selectedCategory, setCurrentPage, setSelectedCategory } =
		useProductsCatalog();

	function handleCategoryButtonClick(event: MouseEvent<HTMLButtonElement>) {
		const nextCategory = event.currentTarget.dataset.category;
		if (!nextCategory) return;
		setSelectedCategory(nextCategory);
		setCurrentPage(1);
	}

	return (
		<section className="space-y-2 rounded-lg border border-rose-100/70 bg-white/75 p-2">
			<h2 className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
				<LayoutGrid className="h-4 w-4 text-rose-500" />
				Categorias
			</h2>

			<div className="space-y-0.5">
				{categories.map((category) => {
					const Icon = getCategoryIcon(category.label);
					const isActive = selectedCategory === category.label;

					return (
						<button
							type="button"
							key={category.label}
							data-category={category.label}
							onClick={handleCategoryButtonClick}
							className="flex w-full items-center justify-between rounded-md px-1.5 py-1 text-left text-xs transition hover:bg-slate-50"
						>
							<span
								className={`inline-flex items-center gap-2 ${
									isActive
										? "font-bold text-slate-800"
										: "font-medium text-slate-500"
								}`}
							>
								<Icon className="h-3 w-3 text-slate-400" />
								{category.label}
							</span>
							<span
								className={`text-[10px] ${isActive ? "font-bold text-slate-600" : "text-slate-400"}`}
							>
								{category.count}
							</span>
						</button>
					);
				})}
			</div>
		</section>
	);
}
