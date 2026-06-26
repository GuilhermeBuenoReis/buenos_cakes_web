"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatPrice } from "@/lib/format-price";
import { useRemoveOrderItem } from "../_hooks/use-remove-order-item";
import type { OrderChangeFeedback } from "../_lib/order-change-feedback";
import type { OrderDetailItem } from "../_queries/order-details";
import { ProfileOrderItemForm } from "./profile-order-item-form";

interface ProfileOrderDetailItemProps {
	canEdit: boolean;
	customerEmail: string | null;
	item: OrderDetailItem;
	onApplied: () => void;
	onResult: (feedback: OrderChangeFeedback) => void;
	orderId: string;
}

export function ProfileOrderDetailItem({
	canEdit,
	customerEmail,
	item,
	onApplied,
	onResult,
	orderId,
}: ProfileOrderDetailItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const { isRemoving, removeError, removeItem } = useRemoveOrderItem({
		customerEmail,
		onResult,
		orderId,
	});

	function handleStartEditing() {
		setIsEditing(true);
	}

	function handleCancelEditing() {
		setIsEditing(false);
	}

	function handleApplied() {
		setIsEditing(false);
		onApplied();
	}

	async function handleRemove() {
		await removeItem(item.id);
	}

	return (
		<div className="rounded-[1.2rem] border border-[#f2e5e7] bg-[#fffafa] px-4 py-3">
			<div className="flex items-start justify-between gap-4">
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

				<div className="flex shrink-0 items-center gap-2">
					<p className="text-sm font-bold tabular-nums text-slate-900">
						{formatPrice(item.total)}
					</p>
					{canEdit && !isEditing ? (
						<>
							<button
								type="button"
								aria-label={`Editar item ${item.productName}`}
								onClick={handleStartEditing}
								className="flex size-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
							>
								<Pencil className="size-3.5" />
							</button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<button
										type="button"
										aria-label={`Remover item ${item.productName}`}
										disabled={isRemoving}
										className="flex size-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
									>
										<Trash2 className="size-3.5" />
									</button>
								</AlertDialogTrigger>
								<AlertDialogContent size="sm">
									<AlertDialogHeader>
										<AlertDialogTitle>Remover item</AlertDialogTitle>
										<AlertDialogDescription>
											Tem certeza que deseja remover{" "}
											<strong className="text-slate-700">
												{item.productName}
											</strong>{" "}
											deste pedido? A alteração pode gerar reembolso.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancelar</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleRemove}
											variant="destructive"
										>
											Remover
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</>
					) : null}
				</div>
			</div>

			{removeError ? (
				<p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
					{removeError}
				</p>
			) : null}

			{isEditing ? (
				<ProfileOrderItemForm
					customerEmail={customerEmail}
					idPrefix={`order-item-${item.id}`}
					item={item}
					mode="edit"
					onApplied={handleApplied}
					onCancel={handleCancelEditing}
					onResult={onResult}
					orderId={orderId}
					submitLabel="Salvar"
				/>
			) : null}
		</div>
	);
}
