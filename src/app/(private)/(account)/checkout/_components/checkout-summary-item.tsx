import { CartSheetArtwork } from "@/components/application/cart-sheet-artwork";
import type { CartSheetItemData } from "@/contexts/cart-sheet-context";
import { formatPrice } from "@/lib/format-price";

interface CheckoutSummaryItemProps {
	item: CartSheetItemData;
}

export function CheckoutSummaryItem({ item }: CheckoutSummaryItemProps) {
	return (
		<article className="flex items-center gap-3 rounded-[1.45rem] border border-[#ece4e4] bg-[#fffaf9] p-3.5 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.16)]">
			<CartSheetArtwork
				alt={`Imagem de ${item.name} no checkout`}
				className="size-16 rounded-[1.1rem]"
				src={item.image}
			/>

			<div className="min-w-0 flex-1">
				<h3 className="truncate text-sm font-extrabold tracking-[0.01em] text-slate-900">
					{item.name}
				</h3>
				<p className="mt-1 text-xs font-semibold text-slate-500">
					Qtd. {item.quantity}
				</p>
				<p className="mt-1 truncate text-xs font-semibold text-rose-400">
					{item.highlight}
				</p>
			</div>

			<strong className="text-sm font-extrabold text-slate-900">
				{formatPrice(item.quantity * item.unitPrice)}
			</strong>
		</article>
	);
}
