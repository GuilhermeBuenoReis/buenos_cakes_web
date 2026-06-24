"use client";

import { MapPin, ReceiptText } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartSheet } from "@/contexts/cart-sheet-context";
import { formatPrice } from "@/lib/format-price";
import { useCheckoutCustomer } from "../_context/checkout-customer-context";
import { useCheckoutPickup } from "../_context/checkout-pickup-context";
import { isCheckoutPersonalInfoValid } from "../_lib/checkout-personal-info";
import { formatPickupSummaryDate } from "../_lib/checkout-pickup";
import { CheckoutCard } from "./checkout-card";
import { CheckoutSummaryItem } from "./checkout-summary-item";

const checkoutOrderSummaryDisclaimer =
	"Ao finalizar, você concorda com nossos Termos de Serviço e Política de Cancelamento.";

export function CheckoutOrderSummary() {
	const { hasItems, items, shipping, subtotal, total } = useCartSheet();
	const pathname = usePathname();
	const { customerInfo, handleSubmitCustomerInfo } = useCheckoutCustomer();
	const { pickupDate, pickupTime } = useCheckoutPickup();
	const shouldShowAction = pathname === "/checkout";
	const isCheckoutProgressBlocked =
		!hasItems || !isCheckoutPersonalInfoValid(customerInfo);

	return (
		<aside className="xl:sticky xl:top-6 xl:self-start">
			<CheckoutCard className="border-[#ebe2e2] bg-[#fffdfa] shadow-[0_28px_70px_-54px_rgba(15,23,42,0.22)]">
				<div className="flex items-start justify-between gap-3 text-slate-900">
					<div className="flex items-start gap-3">
						<div className="flex size-10 items-center justify-center rounded-[1rem] border border-[#f0e1e3] bg-[#fff4f5] text-rose-500">
							<ReceiptText className="size-4" />
						</div>
						<div className="space-y-1.5">
							<h2 className="text-lg font-extrabold tracking-tight">
								Resumo do Pedido
							</h2>
							<p className="text-sm leading-6 text-slate-600">
								Confira os itens antes de concluir.
							</p>
						</div>
					</div>

					{hasItems ? (
						<span className="inline-flex rounded-full border border-[#eee0e2] bg-[#fff7f8] px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-rose-500 uppercase">
							{items.length} item{items.length > 1 ? "s" : ""}
						</span>
					) : null}
				</div>

				{hasItems ? (
					<div className="mt-6 space-y-3.5">
						{items.map((item) => (
							<CheckoutSummaryItem item={item} key={item.id} />
						))}
					</div>
				) : (
					<div className="mt-6 rounded-[1.7rem] border border-dashed border-[#ddd3d3] bg-[#fcfaf8] p-5 text-sm leading-6 text-slate-500">
						<p className="font-semibold text-slate-800">
							Seu carrinho ainda está vazio.
						</p>
						<p className="mt-2">
							Adicione produtos ao carrinho para visualizar o resumo do pedido
							aqui.
						</p>
					</div>
				)}

				<div className="mt-6 space-y-2.5 border-t border-[#eee5e4] pt-5 text-sm">
					<div className="flex items-center justify-between text-slate-600">
						<span>Subtotal</span>
						<span className="font-semibold text-slate-800">
							{formatPrice(subtotal)}
						</span>
					</div>
					<div className="flex items-center justify-between text-slate-600">
						<span>Taxa de Retirada</span>
						<span className="font-bold text-emerald-500">
							{shipping === 0 ? "Grátis" : formatPrice(shipping)}
						</span>
					</div>
					<div className="mt-4 flex items-center justify-between rounded-[1.5rem] bg-[#202632] px-4 py-4 text-xl font-extrabold text-white shadow-[0_22px_36px_-30px_rgba(15,23,42,0.45)]">
						<span className="text-sm font-semibold text-slate-200">Total</span>
						<span>{formatPrice(total)}</span>
					</div>
				</div>

				<div className="mt-6 rounded-[1.7rem] border border-[#efe2e3] bg-[#fff8f8] p-4 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.15)]">
					<div className="inline-flex items-center gap-2 rounded-full border border-[#edd9dd] bg-white px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-rose-500 uppercase">
						<MapPin className="size-3.5" />
						Agendamento
					</div>
					<p
						className="mt-4 text-sm font-semibold leading-6 text-slate-900"
						data-testid="pickup-date-summary"
					>
						{formatPickupSummaryDate(pickupDate)}
					</p>
					<p
						className="mt-1 text-sm font-semibold text-rose-500"
						data-testid="pickup-schedule-summary"
					>
						Às {pickupTime}
					</p>
				</div>

				{shouldShowAction ? (
					<Button
						className="mt-6 h-11 w-full rounded-full bg-[#d45470] text-white shadow-[0_18px_36px_-24px_rgba(212,84,112,0.45)] hover:bg-[#c64a65]"
						disabled={isCheckoutProgressBlocked}
						type="button"
						onClick={handleSubmitCustomerInfo}
					>
						Ir para Pagamento
					</Button>
				) : null}

				{shouldShowAction ? (
					<p className="mt-3 text-center text-[11px] leading-5 text-slate-500">
						{checkoutOrderSummaryDisclaimer}
					</p>
				) : null}
			</CheckoutCard>
		</aside>
	);
}
