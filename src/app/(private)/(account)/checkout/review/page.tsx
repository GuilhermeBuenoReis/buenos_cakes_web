"use client";

import { useCartSheet } from "@/contexts/cart-sheet-context";
import { useCheckoutCustomer } from "../_context/checkout-customer-context";
import { useCheckoutPayment } from "../_context/checkout-payment-context";
import { useCheckoutPickup } from "../_context/checkout-pickup-context";
import { formatPickupSummaryDate } from "../_lib/checkout-pickup";
import { checkoutPickupLocation } from "../_lib/checkout-pickup-location";
import { paymentMethods } from "../payment/_components/payment-methods";
import { CheckoutConfirmActions } from "./_components/checkout-confirm-actions";
import { CheckoutCustomerInfo } from "./_components/checkout-customer-info";
import { CheckoutDeliveryInfo } from "./_components/checkout-delivery-info";
import { CheckoutOrderItems } from "./_components/checkout-order-items";
import { CheckoutPaymentSummary } from "./_components/checkout-payment-summary";
import { CheckoutReviewHeader } from "./_components/checkout-review-header";
import { CheckoutTotalCard } from "./_components/checkout-total-card";
import { useConfirmCheckoutOrder } from "./_hooks/use-confirm-checkout-order";
import {
	CHECKOUT_REVIEW_DISCOUNT,
	getCheckoutReviewTotal,
} from "./_lib/checkout-order-payload";

export default function CheckoutReviewPage() {
	const { hasItems, items, shipping, subtotal } = useCartSheet();
	const { customerInfo } = useCheckoutCustomer();
	const { cashChange, selectedMethod } = useCheckoutPayment();
	const { pickupDate, pickupTime } = useCheckoutPickup();
	const { confirmOrder, confirmationError, hasCustomerInfo, isConfirming } =
		useConfirmCheckoutOrder();

	const reviewTotal = getCheckoutReviewTotal(subtotal, shipping);
	const reviewItemCount = items.reduce(
		(total, item) => total + item.quantity,
		0,
	);
	const pickupDateLabel = formatPickupSummaryDate(pickupDate);
	const selectedPaymentMethod =
		paymentMethods.find((method) => method.id === selectedMethod) ??
		paymentMethods[0];

	return (
		<div className="relative space-y-7 pb-6">
			<div className="pointer-events-none absolute inset-x-0 top-4 -z-10 h-56 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_right,rgba(225,105,135,0.1),transparent_36%),radial-gradient(circle_at_left,rgba(148,163,184,0.08),transparent_26%)]" />
			<CheckoutReviewHeader />

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
				<div className="space-y-6">
					<CheckoutOrderItems items={items} />

					<div className="grid gap-6 xl:grid-cols-2">
						<CheckoutDeliveryInfo
							address={checkoutPickupLocation.address}
							dateLabel={pickupDateLabel}
							locationName={checkoutPickupLocation.name}
							note="Retirada confirmada no balcão principal da loja."
							timeLabel={pickupTime}
							typeLabel="Retirada no local"
						/>
						<CheckoutPaymentSummary
							cashChange={cashChange}
							paymentMethod={selectedPaymentMethod}
						/>
					</div>

					<CheckoutCustomerInfo customer={customerInfo} />
					<CheckoutConfirmActions
						confirmDisabled={!hasItems || !hasCustomerInfo || isConfirming}
						confirmLabel={isConfirming ? "Confirmando..." : "Confirmar Pedido"}
						errorMessage={confirmationError}
						onConfirm={confirmOrder}
					/>
				</div>

				<div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
					<CheckoutTotalCard
						discount={CHECKOUT_REVIEW_DISCOUNT}
						fees={shipping}
						itemCount={reviewItemCount}
						subtotal={subtotal}
						total={reviewTotal}
					/>
					<CheckoutDeliveryInfo
						address={checkoutPickupLocation.address}
						compact
						dateLabel={pickupDateLabel}
						locationName={checkoutPickupLocation.name}
						timeLabel={pickupTime}
						typeLabel="Retirada no local"
					/>
				</div>
			</div>
		</div>
	);
}
