"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { navigateToPath } from "@/lib/client-navigation";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import { useOrderDetails } from "../_hooks/use-order-details";
import type { OrderChangeFeedback } from "../_lib/order-change-feedback";
import { canEditOrder } from "../_lib/order-edit-permission";
import {
	getProfileOrderStatusClassName,
	type ProfileOrder,
} from "../_lib/profile-content";
import { ProfileOrderAddItem } from "./profile-order-add-item";
import { ProfileOrderChangeResult } from "./profile-order-change-result";
import { ProfileOrderDetailItem } from "./profile-order-detail-item";

interface ProfileOrderDetailsSheetProps {
	customerEmail?: string | null;
	orders: ProfileOrder[];
}

export function ProfileOrderDetailsSheet({
	customerEmail = null,
	orders,
}: ProfileOrderDetailsSheetProps) {
	const router = useRouter();
	const [{ modal, orderId }, setParams] = useQueryStates({
		modal: parseAsString,
		orderId: parseAsString,
	});
	const [changeFeedback, setChangeFeedback] =
		useState<OrderChangeFeedback | null>(null);

	const isOpen = modal === "order-details";
	const order = orders.find((currentOrder) => currentOrder.orderId === orderId);
	const { error, items, loading, reload } = useOrderDetails({
		isOpen,
		orderId,
	});

	const editPermission = order
		? canEditOrder({
				scheduledAt: order.scheduledAt,
				statusTone: order.statusTone,
			})
		: null;
	const canEditItems = editPermission?.canEdit ?? false;

	function handleClose() {
		setChangeFeedback(null);
		setParams({ modal: null, orderId: null });
	}

	function handleChangeResult(feedback: OrderChangeFeedback) {
		setChangeFeedback(feedback);
		reload();
		router.refresh();

		if (feedback.requiresAdditionalPayment && feedback.checkoutUrl) {
			navigateToPath(feedback.checkoutUrl);
		}
	}

	function handleItemApplied() {
		reload();
		router.refresh();
	}

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
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
								getProfileOrderStatusClassName(order.statusTone),
							)}
						>
							{order.status}
						</span>
					)}

					{order && !canEditItems && editPermission?.reason ? (
						<p className="rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium leading-5 text-amber-700">
							{editPermission.reason}
						</p>
					) : null}

					{changeFeedback ? (
						<ProfileOrderChangeResult
							feedback={changeFeedback}
							onDismiss={() => setChangeFeedback(null)}
						/>
					) : null}

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
							order &&
							items.map((item) => (
								<ProfileOrderDetailItem
									key={item.id}
									canEdit={canEditItems}
									customerEmail={customerEmail}
									item={item}
									onApplied={handleItemApplied}
									onResult={handleChangeResult}
									orderId={order.orderId}
								/>
							))}

						{order && !loading && canEditItems ? (
							<ProfileOrderAddItem
								customerEmail={customerEmail}
								onResult={handleChangeResult}
								orderId={order.orderId}
							/>
						) : null}
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
