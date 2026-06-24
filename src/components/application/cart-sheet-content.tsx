"use client";

import {
	ArrowRight,
	CreditCard,
	QrCode,
	ShoppingBag,
	WalletCards,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useCartSheet } from "@/contexts/cart-sheet-context";
import { formatPrice } from "@/lib/format-price";
import { CartSheetItem } from "./cart-sheet-item";

const PAYMENT_METHODS = [
	{ icon: CreditCard, id: "credit-card" },
	{ icon: WalletCards, id: "wallet" },
	{ icon: QrCode, id: "qr-code" },
] as const;

export function CartSheetContent() {
	const router = useRouter();
	const { hasItems, itemCount, items, shipping, subtotal, total } =
		useCartSheet();

	function handleCheckoutButtonClick() {
		router.push("/checkout");
	}

	return (
		<SheetContent
			side="right"
			showCloseButton={false}
			className="w-[88vw] max-w-90 gap-0 border-l border-l-[#6f63ff] bg-[#fffefe] p-0 shadow-[-14px_0_34px_rgba(31,41,55,0.12)] sm:w-93 sm:max-w-93"
		>
			<div className="flex h-full flex-col">
				<SheetHeader className="border-b border-slate-100 bg-white px-5 pb-4 pt-5 sm:px-6">
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-center gap-2.5">
							<div className="flex size-8 items-center justify-center rounded-full bg-rose-50 text-rose-500">
								<ShoppingBag className="size-3.5" />
							</div>

							<div className="flex items-center gap-1.5">
								<SheetTitle className="text-[1.15rem] font-extrabold tracking-tight text-slate-800">
									Meu Carrinho
								</SheetTitle>
								<span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-extrabold text-rose-500">
									{itemCount}
								</span>
							</div>
						</div>

						<SheetClose
							aria-label="Fechar carrinho"
							className="flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
						>
							<X className="size-3.5" />
						</SheetClose>
					</div>

					<SheetDescription className="sr-only">
						Confira os itens escolhidos antes de finalizar o pedido.
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
					{hasItems ? (
						<div className="space-y-4">
							{items.map((item) => (
								<CartSheetItem item={item} key={item.id} />
							))}
						</div>
					) : (
						<div className="flex h-full min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center">
							<div className="mb-3 flex size-12 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm">
								<ShoppingBag className="size-4" />
							</div>
							<h3 className="text-base font-extrabold text-slate-800">
								Seu carrinho esta vazio
							</h3>
							<p className="mt-2 max-w-64 text-[13px] leading-5 text-slate-500">
								Adicione alguns doces para visualizar o resumo do pedido aqui.
							</p>
						</div>
					)}
				</div>

				<SheetFooter className="border-t border-slate-100 bg-white px-5 pb-6 pt-4 sm:px-6">
					<div className="space-y-1.5">
						<div className="flex items-center justify-between text-[13px] text-slate-500">
							<span>Subtotal</span>
							<span>{formatPrice(subtotal)}</span>
						</div>

						<div className="flex items-center justify-between text-[13px] text-slate-500">
							<span>Frete Estimado</span>
							<span className="font-bold text-emerald-500">
								{shipping === 0 ? "Gratis" : formatPrice(shipping)}
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between pt-1 text-lg font-extrabold text-slate-900">
						<span>Total</span>
						<span className="text-rose-500">{formatPrice(total)}</span>
					</div>

					<Button
						className="h-11 rounded-full text-sm font-extrabold shadow-[0_14px_24px_rgba(244,63,94,0.18)]"
						disabled={!hasItems}
						onClick={handleCheckoutButtonClick}
						type="button"
					>
						Finalizar Pedido
						<ArrowRight className="size-3.5" />
					</Button>

					<Link
						className="text-[13px] font-medium text-slate-400 transition hover:text-slate-700"
						href="/products"
					>
						Continuar Comprando
					</Link>

					<div className="flex items-center justify-center gap-2.5 pt-0.5 text-slate-400">
						{PAYMENT_METHODS.map(({ icon: Icon, id }) => (
							<div
								className="flex size-7 items-center justify-center rounded-full bg-slate-50"
								key={id}
							>
								<Icon className="size-3.5" />
							</div>
						))}
					</div>
				</SheetFooter>
			</div>
		</SheetContent>
	);
}
