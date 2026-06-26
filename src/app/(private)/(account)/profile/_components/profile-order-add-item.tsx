"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { OrderChangeFeedback } from "../_lib/order-change-feedback";
import { ProfileOrderItemForm } from "./profile-order-item-form";

interface ProfileOrderAddItemProps {
	customerEmail: string | null;
	onResult: (feedback: OrderChangeFeedback) => void;
	orderId: string;
}

export function ProfileOrderAddItem({
	customerEmail,
	onResult,
	orderId,
}: ProfileOrderAddItemProps) {
	const [isAdding, setIsAdding] = useState(false);

	function handleOpen() {
		setIsAdding(true);
	}

	function handleClose() {
		setIsAdding(false);
	}

	if (!isAdding) {
		return (
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="w-full rounded-full border-dashed border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
				onClick={handleOpen}
			>
				<Plus className="size-4" />
				Adicionar produto
			</Button>
		);
	}

	return (
		<div className="rounded-[1.2rem] border border-[#f2e5e7] bg-[#fffafa] px-4 py-3">
			<p className="text-sm font-semibold text-slate-900">Adicionar produto</p>
			<ProfileOrderItemForm
				customerEmail={customerEmail}
				idPrefix={`order-add-${orderId}`}
				mode="add"
				onApplied={handleClose}
				onCancel={handleClose}
				onResult={onResult}
				orderId={orderId}
				submitLabel="Adicionar"
			/>
		</div>
	);
}
