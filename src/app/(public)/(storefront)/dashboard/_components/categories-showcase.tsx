"use client";

import Image from "next/image";
import { useDashboardCategories } from "../_hooks/use-dashboard-catalog";

export function CategoriesShowcase() {
	const { categories } = useDashboardCategories();
	const hasCategories = categories.length > 0;

	return (
		<section className="space-y-6 rounded-2xl bg-[#f4f4f6] px-4 py-6 sm:px-6 sm:py-7">
			<div className="space-y-2 text-center">
				<h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
					Navegue por Categorias
				</h2>
				<div className="mx-auto h-1 w-16 rounded-full bg-rose-500" />
			</div>

			{hasCategories ? (
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{categories.map((card) => (
						<article
							className="group relative h-44 overflow-hidden rounded-[24px] bg-slate-100 sm:h-48"
							key={card.id}
						>
							<Image
								alt={card.title}
								className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
								src={card.image}
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

							<div className="absolute inset-x-0 bottom-0 space-y-0.5 p-4 text-white">
								<h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
									{card.title}
								</h3>
								<p className="text-sm text-white/80 sm:text-base">
									{card.subtitle}
								</p>
							</div>
						</article>
					))}
				</div>
			) : (
				<div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 text-center text-sm font-medium text-slate-500">
					Nenhuma categoria ativa foi encontrada no catálogo.
				</div>
			)}
		</section>
	);
}
