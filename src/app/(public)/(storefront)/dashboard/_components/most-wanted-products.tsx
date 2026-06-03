"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import { useDashboardPopularProducts } from "../_hooks/use-dashboard-catalog";

export function MostWantedProducts() {
	const { products } = useDashboardPopularProducts();
	const hasProducts = products.length > 0;

	return (
		<section className="space-y-4 rounded-2xl bg-[#f4f4f6] px-4 py-5 sm:px-6 sm:py-6">
			<div className="flex items-end justify-between gap-4">
				<div className="space-y-1">
					<h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
						Os Mais Desejados
					</h2>
					<p className="text-xs text-slate-500 sm:text-sm">
						Nossos produtos recordistas de pedidos.
					</p>
				</div>

				<Link
					className="text-xs font-semibold text-rose-500 transition hover:text-rose-600 sm:text-sm"
					href="/products"
				>
					Ver todos
				</Link>
			</div>

			{hasProducts ? (
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{products.map((product) => (
						<article className="space-y-2" key={product.id}>
							<div className="relative h-40 overflow-hidden rounded-[20px] bg-slate-100 sm:h-44">
								<Image
									alt={product.name}
									className="h-full w-full object-cover transition duration-500 hover:scale-105"
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
									src={product.image}
								/>

								{product.isBestSeller ? (
									<span className="absolute left-2.5 top-2.5 rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-bold tracking-[0.08em] text-white uppercase">
										Best Seller
									</span>
								) : null}
							</div>

							<div className="space-y-1">
								<div className="flex items-center gap-1.5 text-[11px] text-slate-400">
									<span className="tracking-[0.12em] text-amber-400">
										★★★★★
									</span>
									<span>({product.ratingCount})</span>
								</div>

								<h3 className="text-sm font-semibold tracking-tight text-slate-900 sm:text-sm">
									{product.name}
								</h3>
								<p className="text-sm font-semibold tracking-tight text-rose-500 sm:text-lg">
									{formatPrice(product.price)}
								</p>
							</div>
						</article>
					))}
				</div>
			) : (
				<div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 text-center text-sm font-medium text-slate-500">
					Nenhum produto ativo foi encontrado no catálogo.
				</div>
			)}
		</section>
	);
}
