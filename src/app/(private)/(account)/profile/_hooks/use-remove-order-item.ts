"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buildOrderChangeCheckoutUrls } from "../_lib/order-change-checkout-urls";
import { getOrderChangeErrorMessage } from "../_lib/order-change-errors";
import {
	buildOrderChangeFeedback,
	type OrderChangeFeedback,
} from "../_lib/order-change-feedback";
import { useRemoveOrderItemMutation } from "./use-order-item-mutations";

interface UseRemoveOrderItemParams {
	customerEmail: string | null;
	onResult: (feedback: OrderChangeFeedback) => void;
	orderId: string;
}

export function useRemoveOrderItem({
	customerEmail,
	onResult,
	orderId,
}: UseRemoveOrderItemParams) {
	const router = useRouter();
	const [removeError, setRemoveError] = useState<string | null>(null);
	const removeMutation = useRemoveOrderItemMutation(orderId);

	async function removeItem(orderItemId: string) {
		setRemoveError(null);

		try {
			const response = await removeMutation.mutateAsync({
				...buildOrderChangeCheckoutUrls(orderId),
				customerEmail: customerEmail ?? null,
				orderItemId,
			});

			router.refresh();
			onResult(buildOrderChangeFeedback(response.change));
		} catch (error) {
			setRemoveError(getOrderChangeErrorMessage(error));
		}
	}

	return {
		isRemoving: removeMutation.isPending,
		removeError,
		removeItem,
	};
}
