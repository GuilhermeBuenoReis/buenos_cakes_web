"use client";

import { Loader2 } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { fetchProductById } from "@/api/backend/routes/fetch-product-by-id";
import { listOrderItemsByOrder } from "@/api/backend/routes/list-order-items-by-order";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import {
	type ProfileOrder,
	type ProfileOrderStatusTone,
} from "../_lib/profile-content";

interface OrderDetailItem {
	id: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	total: number;
	note?: string | null;
}

interface ProfileOrderDetailsSheetProps {
	orders: ProfileOrder[];
}

function getOrderStatusClassName(statusTone: ProfileOrderStatusTone) {
	switch (statusTone) {
		case "canceled":
			return "bg-rose-100 text-rose-700";
		case "completed":
			return "bg-slate-100 text-slate-700";
		case "confirmed":
			return "bg-emerald-100 text-emerald-700";
		case "pending":
			return "bg-amber-100 text-amber-700";
		case "preparing":
			return "bg-sky-100 text-sky-700";
		case "ready":
			return "bg-violet-100 text-violet-700";
	}
}

export function ProfileOrderDetailsSheet({
	orders,
}: ProfileOrderDetailsSheetProps) {
	const [{ modal, orderId }, setParams] = useQueryStates({
		modal: parseAsString,
		orderId: parseAsString,
	});

	const [items, setItems] = useState<OrderDetailItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isOpen = modal === "order-details";
	const order = orders.find((o) => o.orderId === orderId);

	useEffect(() => {
		if (!isOpen || !orderId) return;

		let cancelled = false;
		setLoading(true);
		setError(null);
		setItems([]);

		async function fetchDetails() {
			try {
				const { orderItems } = await listOrderItemsByOrder({ orderId: orderId! });

				if (cancelled) return;

				const enriched = await Promise.all(
					orderItems.map(async (item) => {
						try {
							const { product } = await fetchProductById({
								productId: item.productId,
							});
							return {
								id: item.id,
								productName: product.name,
								quantity: item.quantity,
								unitPrice: item.unitPrice,
								total: item.total,
								note: item.note,
							};
						} catch {
							return {
								id: item.id,
								productName: `Produto ${item.productId.slice(0, 8)}…`,
								quantity: item.quantity,
								unitPrice: item.unitPrice,
								total: item.total,
								note: item.note,
							};
						}
					}),
				);

				if (!cancelled) setItems(enriched);
			} catch {
				if (!cancelled)
					setError("Não foi possível carregar os itens do pedido.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchDetails();
		return () => {
			cancelled = true;
		};
	}, [isOpen, orderId]);

	function handleClose() {
		setParams({ modal: null, orderId: null });
	}

	return (
		<Sheet open={isOpen} onOpenChange={(v) => !v && handleClose()}>
			<SheetContent className="flex flex-col gap-0 overflow-y-auto sm:max-w-md">
				<SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6">
					<SheetTitle className="text-xl font-black tracking-tight text-slate-950">
						{order?.number ?? "Detalhes do Pedido"}
					</SheetTitle>
					<SheetDescription className="text-sm text-slate-500">
						{order?.dateLabel}
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-1 flex-col gap-5 px-6 py-6">
					{order && (
						<span
							className={cn(
								"inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold",
								getOrderStatusClassName(order.statusTone),
							)}
						>
							{order.status}
						</span>
					)}

					<div className="space-y-3">
						<p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
							Itens
						</p>

						{loading && (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="size-5 animate-spin text-rose-400" />
							</div>
						)}

						{error && (
							<p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
								{error}
							</p>
						)}

						{!loading && !error && items.length === 0 && orderId && (
							<p className="text-sm text-slate-400 italic">
								Nenhum item encontrado.
							</p>
						)}

						{!loading &&
							items.map((item) => (
								<div
									key={item.id}
									className="flex items-start justify-between gap-4 rounded-[1.2rem] border border-[#f2e5e7] bg-[#fffafa] px-4 py-3"
								>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-slate-900">
											{item.productName}
										</p>
										<p className="mt-0.5 text-xs text-slate-400">
											{item.quantity}x {formatPrice(item.unitPrice)}
										</p>
										{item.note && (
											<p className="mt-1 text-xs text-slate-400 italic">
												{item.note}
											</p>
										)}
									</div>
									<p className="shrink-0 text-sm font-bold tabular-nums text-slate-900">
										{formatPrice(item.total)}
									</p>
								</div>
							))}
					</div>

					{order && !loading && (
						<div className="mt-auto border-t border-slate-100 pt-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-bold text-slate-900">Total</p>
								<p className="text-base font-black tabular-nums text-rose-500">
									{formatPrice(order.total)}
								</p>
							</div>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
