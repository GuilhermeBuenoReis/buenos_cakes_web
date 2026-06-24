import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import {
	getProfileOrderItemsSummary,
	getProfileOrderStatusClassName,
	type ProfileOrder,
} from "../_lib/profile-content";

interface ProfileOrderRowProps {
	onOpenDetails: (order: ProfileOrder) => void;
	order: ProfileOrder;
}

export function ProfileOrderRow({
	onOpenDetails,
	order,
}: ProfileOrderRowProps) {
	function handleOpenDetailsClick() {
		onOpenDetails(order);
	}

	return (
		<tr
			className="rounded-[1.4rem] bg-[#fffaf9] shadow-[0_18px_44px_-42px_rgba(15,23,42,0.28)]"
			id={order.id}
		>
			<td className="rounded-l-[1.4rem] px-4 py-4 align-top">
				<p className="text-sm font-black text-rose-500 tabular-nums">
					{order.number}
				</p>
				<p className="mt-1 text-sm text-slate-500">
					{order.itemsSummary ?? getProfileOrderItemsSummary(order.items)}
				</p>
			</td>
			<td className="px-4 py-4 text-sm font-medium text-slate-600 align-top">
				{order.dateLabel}
			</td>
			<td className="px-4 py-4 align-top">
				<span
					className={cn(
						"inline-flex rounded-full px-3 py-1 text-xs font-bold",
						getProfileOrderStatusClassName(order.statusTone),
					)}
				>
					{order.status}
				</span>
			</td>
			<td className="px-4 py-4 text-sm font-bold text-slate-900 tabular-nums align-top">
				{formatPrice(order.total)}
			</td>
			<td className="rounded-r-[1.4rem] px-4 py-4 text-right align-top">
				<button
					onClick={handleOpenDetailsClick}
					className="text-sm font-semibold text-rose-500 transition hover:text-rose-600"
					type="button"
				>
					Detalhes
				</button>
			</td>
		</tr>
	);
}
