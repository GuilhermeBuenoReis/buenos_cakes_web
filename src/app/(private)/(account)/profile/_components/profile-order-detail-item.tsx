import { formatPrice } from "@/lib/format-price";
import type { OrderDetailItem } from "../_hooks/use-order-details";

interface ProfileOrderDetailItemProps {
	item: OrderDetailItem;
}

export function ProfileOrderDetailItem({ item }: ProfileOrderDetailItemProps) {
	return (
		<div className="flex items-start justify-between gap-4 rounded-[1.2rem] border border-[#f2e5e7] bg-[#fffafa] px-4 py-3">
			<div className="min-w-0">
				<p className="text-sm font-semibold text-slate-900">
					{item.productName}
				</p>
				<p className="mt-0.5 text-xs text-slate-400">
					{item.quantity}x {formatPrice(item.unitPrice)}
				</p>
				{item.note && (
					<p className="mt-1 text-xs text-slate-400 italic">{item.note}</p>
				)}
			</div>
			<p className="shrink-0 text-sm font-bold tabular-nums text-slate-900">
				{formatPrice(item.total)}
			</p>
		</div>
	);
}
