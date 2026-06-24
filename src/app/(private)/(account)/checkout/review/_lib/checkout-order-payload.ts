import type {
	CreateOrderItemRequestInput,
	CreateOrderRequestInput,
} from "@/api/backend/checkout";
import type { CartSheetItemData } from "@/contexts/cart-sheet-context";
import type { CheckoutPersonalInfoValues } from "../../_lib/checkout-personal-info";

export const CHECKOUT_REVIEW_DISCOUNT = 0;

export function getCheckoutReviewTotal(subtotal: number, shipping: number) {
	return subtotal + shipping - CHECKOUT_REVIEW_DISCOUNT;
}

function getBackendProductId(itemId: string, productId?: string) {
	return productId ?? itemId.split("::")[0] ?? itemId;
}

function getPickupScheduledAt(date: Date, time: string) {
	const [hours = 0, minutes = 0] = time.split(":").map(Number);
	const scheduledAt = new Date(date);
	scheduledAt.setHours(hours, minutes, 0, 0);

	return scheduledAt.toISOString();
}

interface BuildCreateOrderPayloadParams {
	cashChange: string;
	customerInfo: CheckoutPersonalInfoValues;
	pickupDate: Date;
	pickupTime: string;
	shipping: number;
	subtotal: number;
	userId: string;
}

export function buildCreateOrderPayload({
	cashChange,
	customerInfo,
	pickupDate,
	pickupTime,
	shipping,
	subtotal,
	userId,
}: BuildCreateOrderPayloadParams): CreateOrderRequestInput {
	return {
		customerNote: [
			`Cliente: ${customerInfo.fullName}`,
			`Telefone: ${customerInfo.phone}`,
			cashChange ? `Troco para: ${cashChange}` : null,
		]
			.filter(Boolean)
			.join(" | "),
		deliveryFee: shipping,
		fulfillmentMethod: "pickup",
		pickupScheduledAt: getPickupScheduledAt(pickupDate, pickupTime),
		subtotal,
		total: getCheckoutReviewTotal(subtotal, shipping),
		userId,
	};
}

export function buildCreateOrderItemPayload(
	item: CartSheetItemData,
	orderId: string,
): CreateOrderItemRequestInput {
	return {
		note: item.note ?? null,
		orderId,
		productFillingId: item.productFillingId ?? null,
		productId: getBackendProductId(item.id, item.productId),
		productSizeId: item.productSizeId ?? null,
		quantity: item.quantity,
		total: item.unitPrice * item.quantity,
		unitPrice: item.unitPrice,
	};
}
