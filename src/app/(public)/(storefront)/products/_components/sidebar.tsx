"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductsCatalog } from "../_context/products-catalog-context";
import { SidebarCategoryList } from "./sidebar-category-list";
import { SidebarRatingFilter } from "./sidebar-rating-filter";

const sidebarFiltersSchema = z.object({
	maxPrice: z.number().int().min(0).max(250),
	rating: z.union([z.literal(3), z.literal(4)]),
});

type SidebarFilters = z.infer<typeof sidebarFiltersSchema>;

export function Sidebar() {
	const { maxPrice, rating, setCurrentPage, setMaxPrice, setRating } =
		useProductsCatalog();
	const {
		handleSubmit,
		register,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<SidebarFilters>({
		defaultValues: {
			maxPrice,
			rating: rating === 3 ? 3 : 4,
		},
		resolver: zodResolver(sidebarFiltersSchema),
	});
	const watchedMaxPrice = watch("maxPrice");
	const maxPriceLabel = useMemo(
		() => `R$ ${watchedMaxPrice ?? maxPrice}+`,
		[maxPrice, watchedMaxPrice],
	);
	const watchedRating = watch("rating");

	useEffect(() => {
		reset({
			maxPrice,
			rating: rating === 3 ? 3 : 4,
		});
	}, [maxPrice, rating, reset]);

	function handleApplyFiltersSubmit(values: SidebarFilters) {
		setMaxPrice(values.maxPrice);
		setRating(values.rating);
		setCurrentPage(1);
	}

	function handleRatingSelect(nextRating: 3 | 4) {
		setValue("rating", nextRating, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	}

	return (
		<aside className="h-full min-w-52.5 rounded-2xl border border-rose-100/70 bg-linear-to-b from-white to-rose-50/35 p-3 shadow-[0_14px_32px_-26px_rgba(15,23,42,0.45)]">
			<form
				className="flex h-full flex-col gap-3.5"
				onSubmit={handleSubmit(handleApplyFiltersSubmit)}
			>
				<div className="space-y-1.5 border-b border-slate-100 pb-2.5">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-2 text-sm font-bold tracking-tight"
					>
						<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white">
							DG
						</span>
						<span className="text-slate-900">DoceGestão</span>
					</Link>
				</div>

				<SidebarCategoryList />

				<section className="space-y-2 rounded-lg border border-rose-100/70 bg-white/75 p-2">
					<h2 className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
						<CircleDollarSign className="h-3.5 w-3.5 text-rose-500" />
						Faixa de Preço
					</h2>

					<Input
						type="range"
						min={0}
						max={250}
						step={10}
						{...register("maxPrice", { valueAsNumber: true })}
						className="h-1 w-full cursor-pointer appearance-none rounded-full border-0 bg-rose-100 px-0 py-0 accent-rose-500 shadow-none focus-visible:ring-0"
					/>
					{errors.maxPrice ? (
						<p className="text-[11px] text-red-500">
							{errors.maxPrice.message}
						</p>
					) : null}

					<div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
						<span>R$ 0</span>
						<span>{maxPriceLabel}</span>
					</div>
				</section>

				<SidebarRatingFilter
					onSelect={handleRatingSelect}
					value={watchedRating}
				/>

				<Button
					className="mt-auto w-full rounded-lg text-xs"
					size="sm"
					type="submit"
				>
					Aplicar Filtros
				</Button>
			</form>
		</aside>
	);
}
