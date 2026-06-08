"use client";

import { Heart, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/api/products/types";
import { Button } from "@/components/ui/button";
import { useCartSheet } from "@/contexts/cart-sheet-context";
import { formatPrice } from "@/lib/format-price";

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCartSheet();

	function handleAddToCartClick() {
		addItem({
			highlight: product.category,
			id: product.id,
			image: product.image,
			name: product.name,
			productId: product.id,
			unitPrice: product.price,
		});
	}

	return (
		<article className="group relative overflow-hidden rounded-xl border border-rose-100/80 bg-white shadow-[0_14px_28px_-24px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_32px_-24px_rgba(190,24,93,0.32)]">
			<button
				type="button"
				aria-label={`Favoritar ${product.name}`}
				className="absolute right-2 top-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm"
			>
				<Heart className="h-3.5 w-3.5 fill-rose-500" />
			</button>

			<Link
				href={`/products/${product.id}`}
				aria-label={`Ver detalhes de ${product.name}`}
				className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
			>
				<div className="relative h-34 bg-slate-100 sm:h-36">
					<Image
						alt={product.name}
						className="h-full w-full object-cover"
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
						src={product.image}
					/>
					<div className="absolute inset-x-0 bottom-0 h-18 bg-linear-to-t from-black/45 to-transparent" />
					<span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-bold tracking-[0.08em] text-white uppercase">
						{product.category}
					</span>
				</div>

				<div className="space-y-1 p-2.5">
					<h3 className="truncate text-[13px] font-semibold text-slate-900 transition group-hover:text-rose-600">
						{product.name}
					</h3>
					<div className="flex items-center gap-1 text-[12px] text-slate-400">
						<span className="text-amber-400">★★★★★</span>
						<span>({product.reviews})</span>
					</div>
				</div>
			</Link>

			<div className="flex items-center justify-between border-t border-slate-100 px-2.5 pb-2.5 pt-1.5">
				<strong className="text-base font-bold text-slate-900 sm:text-lg">
					{formatPrice(product.price)}
				</strong>
				<Button
					type="button"
					size="icon-xs"
					aria-label={`Adicionar ${product.name} ao carrinho`}
					className="relative z-20 h-7 w-7 rounded-full bg-rose-500 text-white shadow-none hover:bg-rose-600"
					onClick={handleAddToCartClick}
				>
					<ShoppingBasket className="h-3.5 w-3.5" />
				</Button>
			</div>
		</article>
	);
}
