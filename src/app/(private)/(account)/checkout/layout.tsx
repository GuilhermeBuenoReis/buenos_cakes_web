import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { fetchCurrentUser } from "@/api/backend/profile";
import { getServerBackendAuthHeaders } from "@/api/backend/server-auth";
import { CheckoutCustomerProvider } from "./_context/checkout-customer-context";
import { CheckoutPaymentProvider } from "./_context/checkout-payment-context";
import { CheckoutPickupProvider } from "./_context/checkout-pickup-context";
import type { CheckoutPersonalInfoValues } from "./_lib/checkout-personal-info";

export const metadata: Metadata = {
	title: "Finalizar Pedido | Buenos'Cakes",
};

function toCheckoutPersonalInfo({
	email,
	name,
	phone,
}: {
	email: string;
	name: string;
	phone?: string | null;
}): CheckoutPersonalInfoValues {
	return {
		email,
		fullName: name,
		phone: phone ?? "",
	};
}

export default async function CheckoutLayout({
	children,
}: {
	children: ReactNode;
}) {
	const headers = await getServerBackendAuthHeaders();

	try {
		const { user } = await fetchCurrentUser({ headers });

		return (
			<CheckoutPickupProvider>
				<CheckoutCustomerProvider
					initialCustomerInfo={toCheckoutPersonalInfo(user)}
				>
					<CheckoutPaymentProvider>{children}</CheckoutPaymentProvider>
				</CheckoutCustomerProvider>
			</CheckoutPickupProvider>
		);
	} catch {
		redirect("/sign-in");
	}
}
