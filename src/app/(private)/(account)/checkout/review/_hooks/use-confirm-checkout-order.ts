"use client";

import { useState } from "react";
import {
	createCheckoutPayment,
	createOrder,
	createOrderItem,
} from "@/api/backend/checkout";
import { getBackendErrorMessage } from "@/api/backend/errors";
import { fetchCurrentUser } from "@/api/backend/profile";
import { useCartSheet } from "@/contexts/cart-sheet-context";
import { navigateToPath } from "@/lib/client-navigation";
import { useCheckoutCustomer } from "../../_context/checkout-customer-context";
import { useCheckoutPayment } from "../../_context/checkout-payment-context";
import { useCheckoutPickup } from "../../_context/checkout-pickup-context";
import { isCheckoutPersonalInfoValid } from "../../_lib/checkout-personal-info";
import {
	buildCreateOrderItemPayload,
	buildCreateOrderPayload,
} from "../_lib/checkout-order-payload";

export function useConfirmCheckoutOrder() {
	const [confirmationError, setConfirmationError] = useState<string | null>(
		null,
	);
	const [isConfirming, setIsConfirming] = useState(false);
	const { clearItems, hasItems, items, shipping, subtotal } = useCartSheet();
	const { customerInfo } = useCheckoutCustomer();
	const { cashChange, selectedMethod } = useCheckoutPayment();
	const { pickupDate, pickupTime } = useCheckoutPickup();

	const hasCustomerInfo = isCheckoutPersonalInfoValid(customerInfo);
	const canConfirm = hasItems && hasCustomerInfo && !isConfirming;

	async function confirmOrder() {
		if (!canConfirm) {
			return;
		}

		setConfirmationError(null);
		setIsConfirming(true);

		try {
			const { user } = await fetchCurrentUser();
			const { order } = await createOrder(
				buildCreateOrderPayload({
					cashChange,
					customerInfo,
					pickupDate,
					pickupTime,
					shipping,
					subtotal,
					userId: user.id,
				}),
			);

			await Promise.all(
				items.map((item) =>
					createOrderItem(buildCreateOrderItemPayload(item, order.id)),
				),
			);

			const profileOrderUrl = `/profile#order-${order.id}`;

			if (selectedMethod === "cash") {
				clearItems();
				navigateToPath(profileOrderUrl);
				return;
			}

			const { checkoutUrl } = await createCheckoutPayment({
				cancelUrl: `${window.location.origin}/checkout/payment`,
				customerEmail: customerInfo.email,
				orderId: order.id,
				successUrl: `${window.location.origin}${profileOrderUrl}`,
			});

			clearItems();
			navigateToPath(checkoutUrl);
		} catch (error) {
			setConfirmationError(
				getBackendErrorMessage(
					error,
					"Não foi possível confirmar o pedido agora. Tente novamente.",
				),
			);
		} finally {
			setIsConfirming(false);
		}
	}

	return { confirmOrder, confirmationError, hasCustomerInfo, isConfirming };
}
