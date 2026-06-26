interface OrderChangeCheckoutUrls {
	cancelUrl?: string;
	successUrl?: string;
}

export function buildOrderChangeCheckoutUrls(
	orderId: string,
): OrderChangeCheckoutUrls {
	if (typeof window === "undefined") {
		return {};
	}

	const { origin } = window.location;

	return {
		cancelUrl: `${origin}/profile`,
		successUrl: `${origin}/profile#order-${orderId}`,
	};
}
